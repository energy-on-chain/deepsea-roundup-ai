import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { InputLabel, Typography, Select, MenuItem, Button, CircularProgress, FormControl, Dialog, DialogContent, DialogTitle, IconButton, Stack, TextField, Alert, Box, Divider } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import LockIcon from "@mui/icons-material/Lock";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useMediaQuery, useTheme } from "@mui/material";
import { loadConfigForYear } from '../../config/masterConfig'; // Dynamic config loader

const AddAnglerModal = (props) => {

  console.log(props.normalData)
  console.log(props.isEarlyBird)
  console.log(props.earlyBird)

  const { year: yearFromParams } = useParams(); // Get year from URL params
  const [searchParams] = useSearchParams(); // Get search params
  const yearFromSearch = searchParams.get('year');
  const year = props.year || yearFromParams || yearFromSearch || new Date().getFullYear();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // Check if the screen size is small (mobile)

  const navigate = useNavigate();
  const [adminDefaults, setAdminDefaults] = useState({ phone: "", email: "", hometown: "" });
  const [paymentProvider, setPaymentProvider] = useState('stripe');
  const [acceptJsLoaded, setAcceptJsLoaded] = useState(false);
  const [cardholderName, setCardholderName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCode, setCardCode] = useState('');
  const [cardError, setCardError] = useState('');

  useEffect(() => {
    loadConfigForYear(year).then(cfg => {
      const provider = cfg?.registrationConfig?.CONFIG_PAYMENT_PROVIDER || 'stripe';
      setPaymentProvider(provider);

      if (props.isAdmin) {
        const { CONFIG_ADMIN_DEFAULT_PHONE, CONFIG_ADMIN_DEFAULT_EMAIL, CONFIG_ADMIN_DEFAULT_HOMETOWN } = cfg?.adminConfig || {};
        setAdminDefaults({
          phone: CONFIG_ADMIN_DEFAULT_PHONE || "",
          email: CONFIG_ADMIN_DEFAULT_EMAIL || "",
          hometown: CONFIG_ADMIN_DEFAULT_HOMETOWN || "",
        });
      }
    }).catch(() => {});
  }, [year, props.isAdmin]);

  // Load Accept.js when using Authorize.net
  useEffect(() => {
    if (paymentProvider !== 'authorize_net') return;
    const src = import.meta.env.VITE_NODE_ENV === 'production'
      ? 'https://js.authorize.net/v1/Accept.js'
      : 'https://jstest.authorize.net/v1/Accept.js';
    if (document.querySelector(`script[src="${src}"]`)) { setAcceptJsLoaded(true); return; }
    const script = document.createElement('script');
    script.src = src;
    script.charset = 'utf-8';
    script.onload = () => setAcceptJsLoaded(true);
    document.head.appendChild(script);
  }, [paymentProvider]);

  const [numberOfAnglers, setNumberOfAnglers] = useState(0);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [anglerDetails, setAnglerDetails] = useState([]);
  const [earlyBirdData, setEarlyBirdData] = useState({});
  const [normalData, setNormalData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);   // Track if form has been submitted successfully

  const handleNumberOfAnglersChange = (e) => {
    const count = parseInt(e.target.value, 10);
    setNumberOfAnglers(count);
    setAnglerDetails(
      Array.from({ length: count }, (_, index) => ({
        id: index,
        anglerName: "",
        hometown: props.isAdmin ? adminDefaults.hometown : "",
        boatName: "",
        ageBracket: "Adult",
        gender: "Male",
        division: "Offshore",
        over21: false,
      }))
    );
    if (props.isAdmin) {
      if (!email && adminDefaults.email) setEmail(adminDefaults.email);
      if (!phone && adminDefaults.phone) setPhone(adminDefaults.phone);
    }
  };

  const handleAnglerDetailChange = (id, field, value) => {
    setAnglerDetails((prev) =>
      prev.map((angler) => (angler.id === id ? { ...angler, [field]: value } : angler))
    );
  };

  const handleClose = () => {
    setNumberOfAnglers(0);
    setEmail("");
    setPhone("");
    setAnglerDetails([]);
    setIsSubmitting(false);
    props.close();
  };

  const calculateFees = () => {
    const adults = anglerDetails.filter((a) => a.ageBracket === "Adult").length;
    const juniors = anglerDetails.filter((a) => a.ageBracket === "Junior").length;

    const adultFee = props.isEarlyBird
      ? adults * props.earlyBirdData.adultEarlybirdFee
      : adults * props.normalData.adultNormalfee;

    const juniorFee = props.isEarlyBird
      ? juniors * props.earlyBirdData.juniorEarlybirdFee
      : juniors * props.normalData.juniorNormalfee;

    return { total: adultFee + juniorFee, adultFee, juniorFee };
  };

  const { total, adultFee, juniorFee } = calculateFees();

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const validateEmail = (email) => {
    return email.match(
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
  };

  const validatePhone = (phone) => {
    return phone.match(
      /^(\+?\d{1,2}\s?)?(\(?\d{3}\)?[\s.-]?)?\d{3}[\s.-]?\d{4}$/
    );
  };

  const validateAnglerDetails = () => {
    let isValid = true;

    if (props.isAdmin && !validateEmail(email)) {
      toast.warning("A valid email address is required.");
      isValid = false;
    }

    if (props.isAdmin && !validatePhone(phone)) {
      toast.warning("A valid phone number is required.");
      isValid = false;
    }

    anglerDetails.forEach((angler, index) => {
      if (!angler.anglerName) {
        toast.warning(`Angler ${index + 1}: Full name is required.`);
        isValid = false;
      }
      if (!props.isAdmin && !angler.hometown) {
        toast.warning(`Angler ${index + 1}: Hometown is required.`);
        isValid = false;
      }
      if (!angler.boatName && angler.division === "Offshore") {
        toast.warning(
          `Angler ${index + 1}: Boat name is required for the offshore division.`
        );
        isValid = false;
      }
    });

    return isValid;
  };

  const handleFormSubmission = () => {
    if (validateAnglerDetails()) {
      setIsSubmitting(true);
      handlePayment();
    }
  };

  const getApiUrl = () =>
    import.meta.env.VITE_NODE_ENV === 'production'
      ? import.meta.env.VITE_SERVER_URL_PRODUCTION
      : import.meta.env.VITE_SERVER_URL_STAGING;

  const buildMetadata = () => {
    const adultFee = props.isEarlyBird ? props.earlyBirdData.adultEarlybirdFee : props.normalData.adultNormalfee;
    const juniorFee = props.isEarlyBird ? props.earlyBirdData.juniorEarlybirdFee : props.normalData.juniorNormalfee;
    return {
      type: "angler",
      year: props.year,
      tableName: props.tableName,
      email: email || null,
      phone: phone || null,
      anglerDetails,
      adultFee,
      juniorFee,
    };
  };

  const handlePayment = async () => {
    const apiUrl = getApiUrl();
    const metaDataObject = buildMetadata();
    const formData = new FormData();
    formData.append('metaDataObject', JSON.stringify(metaDataObject));

    if (props.isAdmin) {
      // Admin path — no payment, direct Firebase write
      fetch(`${apiUrl}/api/${props.year}/registration_by_admin`, {
        method: 'POST', body: formData,
      }).then(res => res.ok ? res.json() : res.json().then(j => Promise.reject(j)))
        .then(() => { setIsSubmitted(true); window.location.reload(); })
        .catch(e => { console.error(e); setIsSubmitting(false); });

    } else if (paymentProvider === 'authorize_net') {
      // Authorize.net path — tokenize card then charge
      handleAuthorizeNetPayment(apiUrl, metaDataObject);

    } else {
      // Stripe path — redirect to hosted checkout
      fetch(`${apiUrl}/api/${props.year}/registration_checkout_session`, {
        method: 'POST', body: formData,
      }).then(res => res.ok ? res.json() : res.json().then(j => Promise.reject(j)))
        .then(({ url }) => { setIsSubmitted(true); window.location = url; })
        .catch(e => { console.error(e); setIsSubmitting(false); });
    }
  };

  const handleAuthorizeNetPayment = (apiUrl, metadata) => {
    setCardError('');
    const isProduction = import.meta.env.VITE_NODE_ENV === 'production';
    const secureData = {
      authData: {
        clientKey: isProduction
          ? import.meta.env.VITE_AUTHORIZE_NET_CLIENT_KEY_PRODUCTION
          : import.meta.env.VITE_AUTHORIZE_NET_CLIENT_KEY_STAGING,
        apiLoginID: isProduction
          ? import.meta.env.VITE_AUTHORIZE_NET_API_LOGIN_ID_PRODUCTION
          : import.meta.env.VITE_AUTHORIZE_NET_API_LOGIN_ID_STAGING,
      },
      cardData: {
        cardNumber: cardNumber.replace(/\s/g, ''),
        month: cardExpiry.split('/')[0]?.trim().padStart(2, '0'),
        year: cardExpiry.split('/')[1]?.trim(),
        cardCode,
        fullName: cardholderName,
      },
    };

    window.Accept.dispatchData(secureData, (response) => {
      if (response.messages.resultCode === 'Error') {
        const msg = response.messages.message.map(m => m.text).join(' ');
        setCardError(msg);
        setIsSubmitting(false);
        return;
      }

      fetch(`${apiUrl}/api/${props.year}/authorize_net_charge`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ metadata, opaqueData: response.opaqueData }),
      })
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setIsSubmitted(true);
            navigate(`/${props.year}/register/success`);
          } else {
            setCardError(data.message || 'Payment was declined. Please try again.');
            setIsSubmitting(false);
          }
        })
        .catch(() => {
          setCardError('A network error occurred. Please try again.');
          setIsSubmitting(false);
        });
    });
  };

  return (
    <Dialog open={props.status} onClose={handleClose} fullWidth maxWidth="lg">
      <DialogTitle>
        Register New {props.year} Angler(s)
        <IconButton style={{ float: "right" }} onClick={handleClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <br />
        <Stack spacing={3}>

          {props.isAdmin && 
            <>
              <TextField
              label="Email"
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              required
            />
            <TextField
              label="Phone"
              variant="outlined"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              fullWidth
              required
            />
            </>
          }

          {/* Number of Anglers */}
          <FormControl fullWidth>
            <InputLabel>Number of Anglers</InputLabel>
            <Select value={numberOfAnglers} label="Number of Anglers" onChange={handleNumberOfAnglersChange}>
              {Array.from({ length: 10 }, (_, i) => (
                <MenuItem key={i} value={i + 1}>
                  {i + 1}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Angler Details */}
          {anglerDetails.map((angler, index) => (
            <Stack
              key={angler.id}
              spacing={2}
              sx={{ border: "1px solid #ddd", padding: 2 }}
            >
              <Typography variant="h7">Angler #{index + 1}</Typography>

              <Stack direction={isMobile ? "column" : "row"} spacing={2}>
                <TextField
                  label="Full Name"
                  value={angler.anglerName}
                  onChange={(e) =>
                    handleAnglerDetailChange(angler.id, "anglerName", e.target.value)
                  }
                  fullWidth
                />
                <TextField
                  label="Hometown"
                  value={angler.hometown}
                  onChange={(e) =>
                    handleAnglerDetailChange(angler.id, "hometown", e.target.value)
                  }
                  fullWidth
                  required={!props.isAdmin}
                />
                <TextField
                  label="Boat Name (required for offshore division)"
                  value={angler.boatName}
                  onChange={(e) =>
                    handleAnglerDetailChange(angler.id, "boatName", e.target.value)
                  }
                  fullWidth
                />
              </Stack>
                
              <Stack direction={isMobile ? "column" : "row"} spacing={2}>
                <FormControl fullWidth>
                  <InputLabel>Division</InputLabel>
                  <Select
                    value={angler.division}
                    label="Division"
                    onChange={(e) =>
                      handleAnglerDetailChange(angler.id, "division", e.target.value)
                    }
                  >
                    <MenuItem value="Offshore">Offshore</MenuItem>
                    <MenuItem value="Bay/Surf">Bay/Surf</MenuItem>
                    <MenuItem value="Flyfishing">Flyfishing</MenuItem>
                    <MenuItem value="Kayak">Kayak</MenuItem>
                  </Select>
                </FormControl>
                <FormControl fullWidth>
                  <InputLabel>Gender</InputLabel>
                  <Select
                    value={angler.gender}
                    label="Gender"
                    onChange={(e) =>
                      handleAnglerDetailChange(angler.id, "gender", e.target.value)
                    }
                  >
                    <MenuItem value="Male">Male</MenuItem>
                    <MenuItem value="Female">Female</MenuItem>
                  </Select>
                </FormControl>
                <FormControl fullWidth>
                  <InputLabel>Age Bracket</InputLabel>
                  <Select
                    value={angler.ageBracket}
                    label="Age Bracket"
                    onChange={(e) =>
                      handleAnglerDetailChange(angler.id, "ageBracket", e.target.value)
                    }
                  >
                    <MenuItem value="Adult">Adult</MenuItem>
                    <MenuItem value="Junior">Junior</MenuItem>
                  </Select>
                </FormControl>
              </Stack>
            </Stack>
          ))}

          {/* Summary */}
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            Total Registration Fees: {formatCurrency(total)}
          </Typography>
          <Typography sx={{ marginLeft: 2 }}>
            Adults ({anglerDetails.filter((a) => a.ageBracket === "Adult").length} x {formatCurrency(props.isEarlyBird ? props.earlyBirdData.adultEarlybirdFee : props.normalData.adultNormalfee)}{props.isEarlyBird ? "each, early bird" : " each"}): {formatCurrency(adultFee)}
          </Typography>
          <Typography sx={{ marginLeft: 2 }}>
            Juniors ({anglerDetails.filter((a) => a.ageBracket === "Junior").length} x {formatCurrency(props.isEarlyBird ? props.earlyBirdData.juniorEarlybirdFee : props.normalData.juniorNormalfee)}{props.isEarlyBird ? "each, early bird" : " each"}): {formatCurrency(juniorFee)}
          </Typography>

          {/* Email + phone for non-admin Authorize.net registrations (Stripe collects these on its hosted page) */}
          {!props.isAdmin && paymentProvider === 'authorize_net' && (
            <Stack spacing={2} sx={{ border: '1px solid #ddd', p: 2 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>Contact Information</Typography>
              <TextField label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} fullWidth required />
              <TextField label="Phone" value={phone} onChange={e => setPhone(e.target.value)} fullWidth />
            </Stack>
          )}

          {/* Authorize.net inline card form */}
          {!props.isAdmin && paymentProvider === 'authorize_net' && !isSubmitted && (
            <Stack spacing={2} sx={{ border: '1px solid #1976d2', borderRadius: 1, p: 2 }}>
              {/* Card form header: title + accepted cards + security badge */}
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#1976d2' }}>Card Information</Typography>
                {/* Card brand logos */}
                <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
                  {['visa', 'mastercard', 'amex', 'discover'].map(brand => (
                    <Box key={brand} component="img"
                      src={`https://js.authorize.net/v1/images/${brand}.png`}
                      alt={brand}
                      sx={{ height: 22, borderRadius: '3px', border: '1px solid #e0e0e0' }}
                      onError={e => { e.target.style.display = 'none'; }}
                    />
                  ))}
                </Box>
              </Box>
              <Divider />
              <TextField
                label="Cardholder Name"
                value={cardholderName}
                onChange={e => setCardholderName(e.target.value)}
                fullWidth
                required
              />
              <Stack direction={isMobile ? 'column' : 'row'} spacing={2}>
                <TextField
                  label="Card Number"
                  value={cardNumber}
                  onChange={e => setCardNumber(e.target.value.replace(/[^\d\s]/g, '').slice(0, 19))}
                  fullWidth
                  required
                  inputProps={{ inputMode: 'numeric', maxLength: 19 }}
                />
                <TextField
                  label="MM/YY"
                  value={cardExpiry}
                  onChange={e => {
                    let v = e.target.value.replace(/[^\d/]/g, '');
                    if (v.length === 2 && !v.includes('/')) v = v + '/';
                    setCardExpiry(v.slice(0, 5));
                  }}
                  sx={{ width: isMobile ? '100%' : 120 }}
                  required
                  inputProps={{ inputMode: 'numeric', maxLength: 5 }}
                />
                <TextField
                  label="CVV"
                  value={cardCode}
                  onChange={e => setCardCode(e.target.value.replace(/\D/g, '').slice(0, 4))}
                  sx={{ width: isMobile ? '100%' : 100 }}
                  required
                  inputProps={{ inputMode: 'numeric', maxLength: 4 }}
                />
              </Stack>
              {cardError && <Alert severity="error">{cardError}</Alert>}
              <Button
                color="primary"
                variant="contained"
                disabled={numberOfAnglers === 0 || isSubmitting || !acceptJsLoaded || !cardholderName || !cardNumber || !cardExpiry || !cardCode}
                onClick={handleFormSubmission}
                startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
              >
                {isSubmitting ? "Processing..." : `Pay ${formatCurrency(total)}`}
              </Button>
              {/* Authorize.net security badge */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, justifyContent: 'center' }}>
                <LockIcon sx={{ fontSize: 14, color: '#555' }} />
                <Typography variant="caption" sx={{ color: '#555' }}>
                  Secured by{' '}
                  <Box component="a" href="https://verify.authorize.net" target="_blank" rel="noopener noreferrer"
                    sx={{ color: '#555', fontWeight: 'bold', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
                    Authorize.net
                  </Box>
                  {' '}· 256-bit SSL encryption
                </Typography>
              </Box>
            </Stack>
          )}

          {/* Stripe / Admin submit button */}
          {(props.isAdmin || paymentProvider === 'stripe') && !isSubmitted && (
            <Button
              color="primary"
              variant="contained"
              disabled={numberOfAnglers === 0 || isSubmitting}
              onClick={handleFormSubmission}
              startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
            >
              {isSubmitting ? "Submitting..." : props.isAdmin ? "Register team (no payment)" : "Go to payment"}
            </Button>
          )}

          {isSubmitted && <h3>Submitted!</h3>}

        </Stack>
      </DialogContent>
    </Dialog>
  );
};

export default AddAnglerModal;

