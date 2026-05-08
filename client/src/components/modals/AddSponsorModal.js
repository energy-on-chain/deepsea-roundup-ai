import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  InputLabel, Select, MenuItem, Button, FormControl, Dialog, DialogContent, DialogTitle,
  IconButton, Stack, Checkbox, Typography, OutlinedInput, FormControlLabel, TextField, Alert
} from "@mui/material";
import { CircularProgress } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useMediaQuery, useTheme } from "@mui/material";
import { loadConfigForYear } from '../../config/masterConfig';

const AddSponsorModal = (props) => {

  const { year } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [config, setConfig] = useState(null);
  const [paymentProvider, setPaymentProvider] = useState('stripe');
  const [acceptJsLoaded, setAcceptJsLoaded] = useState(false);
  const [cardholderName, setCardholderName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCode, setCardCode] = useState('');
  const [cardError, setCardError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [sponsorName, setSponsorName] = useState('');
  const [email, setEmail] = useState();
  const [phone, setPhone] = useState();
  const [selectedTier, setSelectedTier] = useState('None');
  const [selectedSponsorships, setSelectedSponsorships] = useState([]);
  const [totalFee, setTotalFee] = useState(0);
  const [agreedToRules, setAgreedToRules] = useState(false);
  const [sponsorLogo, setSponsorLogo] = useState(null); // State for sponsor logo
  const [previewUrl, setPreviewUrl] = useState(null); // State for image preview

  // INITIALIZE
  useEffect(() => {
    fetchConfigAndData(); // Load config and fetch data
  }, [year]);  // add tabName as a dependency to re-fetch when the tab changes

  useEffect(() => {
    calculateTotalFee();
  }, [selectedTier, selectedSponsorships]);

  const fetchConfigAndData = async () => {
    try {
      const loadedConfig = await loadConfigForYear(year);
      setConfig(loadedConfig);
      const provider = loadedConfig?.registrationConfig?.CONFIG_PAYMENT_PROVIDER || 'stripe';
      setPaymentProvider(provider);
    } catch (error) {
      console.log('Error loading config in AddSponsorModal: ' + error);
    }
  };

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

  const calculateTotalFee = () => {
    const tierFee = selectedTier === "None" ? 0 : config?.registrationConfig?.CONFIG_SPONSOR_REGISTRATION_TIERS[selectedTier] || 0;
    const sponsorshipFee = selectedSponsorships.reduce((total, sponsorship) => {
      return total + (config?.registrationConfig?.CONFIG_SPONSOR_REGISTRATION_ADDITIONAL_SPONSORSHIPS[sponsorship] || 0);
    }, 0);
    setTotalFee(tierFee + sponsorshipFee);
  };

  const handleLogoUpload = (event) => {
    const fieldName = "sponsorLogo"; // Define the field name explicitly
    if (event.target.files[0]) {
      const file = event.target.files[0];
      const fileExtension = file.name.substring(file.name.lastIndexOf('.'));
      const newFile = new File([file], fieldName, { type: file.type });
  
      setSponsorLogo({
        file: newFile,
        fieldName: fieldName,
        url: URL.createObjectURL(newFile), // Create an object URL for the preview
        fileName: fieldName, // Store the new filename without extension
        fileExtension: fileExtension,
      });
  
      setPreviewUrl(URL.createObjectURL(newFile)); // Generate a preview URL
    }
  };
  
  const handleLogoDelete = () => {
    setSponsorLogo(null);
    setPreviewUrl(null);
    const uploadButton = document.getElementById(`upload-button-sponsorLogo`);
    if (uploadButton) {
      uploadButton.value = ''; // Clear the input value
    }
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
  
  const validateInput = () => {

    if (props.isAdmin && !validateEmail(email)) {
      toast.warning(`Valid email address is required.`);
      return false;
    };

    if (props.isAdmin && !validatePhone(phone)) {
      toast.warning(`Valid phone number is required.`);
      return false;
    };

    if (!sponsorName) {
      toast.warning("You include a sponsor name.");
      return false;
    }

    if (!selectedTier && selectedSponsorships.length === 0) {
      toast.warning("Please select at least one sponsorship tier or additional sponsorship.");
      return false;
    }
  
    if (!agreedToRules) {
      toast.warning("You must agree to the sponsorship rules.");
      return false;
    }
  
    return true;
  };

  const handleClose = () => {
    setSponsorName('');
    setEmail();
    setPhone();
    setSelectedTier('None');
    setSelectedSponsorships([]);
    setTotalFee(0);
    setAgreedToRules(false);
    setSponsorLogo(null);
    setPreviewUrl(null);
    props.close();
  };

  const handleSubmit = () => {
    if (validateInput()) {
      setIsSubmitting(true);
      handlePayment();
    }
  };

  const getApiUrl = () =>
    import.meta.env.VITE_NODE_ENV === 'production'
      ? import.meta.env.VITE_SERVER_URL_PRODUCTION
      : import.meta.env.VITE_SERVER_URL_STAGING;

  const buildMetadata = () => ({
    type: "sponsor",
    year: props.year,
    tableName: props.tableName,
    sponsorName,
    email: email || null,
    phone: phone || null,
    selectedTier,
    selectedSponsorships,
    totalFee,
    tierFeeStructure: config.registrationConfig.CONFIG_SPONSOR_REGISTRATION_TIERS,
    selectedSponsorshipsFeeStructure: config.registrationConfig.CONFIG_SPONSOR_REGISTRATION_ADDITIONAL_SPONSORSHIPS,
  });

  const readLogoAsBase64 = () =>
    new Promise((resolve) => {
      if (!sponsorLogo?.file) { resolve(null); return; }
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = e.target.result.split(',')[1];
        resolve({ [sponsorLogo.file.name]: { buffer: base64, mimetype: sponsorLogo.file.type } });
      };
      reader.readAsDataURL(sponsorLogo.file);
    });

  const handlePayment = async () => {
    const apiUrl = getApiUrl();
    const metaDataObject = buildMetadata();
    const formData = new FormData();
    formData.append('metaDataObject', JSON.stringify(metaDataObject));
    if (sponsorLogo) formData.append('sponsorLogo', sponsorLogo.file);

    if (props.isAdmin) {
      fetch(`${apiUrl}/api/${props.year}/registration_by_admin`, {
        method: 'POST', body: formData,
      }).then(res => res.ok ? res.json() : res.json().then(j => Promise.reject(j)))
        .then(() => { setIsSubmitted(true); window.location.reload(); })
        .catch(e => { console.error(e); setIsSubmitting(false); });

    } else if (paymentProvider === 'authorize_net') {
      const imageBuffers = await readLogoAsBase64();
      handleAuthorizeNetPayment(apiUrl, { ...metaDataObject, imageBuffers });

    } else {
      // Stripe path
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
      {config ? (
        <>
          <DialogTitle>
            Register A New {props.year} Sponsor
            <IconButton onClick={handleClose} style={{ float: 'right' }}>
              <CloseIcon color="primary" />
            </IconButton>
          </DialogTitle>

          <DialogContent>

            <Stack spacing={2} margin={1}>  
              <Typography variant="h7"><strong>General Info</strong></Typography>
              <TextField
                label="Sponsor Name"
                value={sponsorName}
                onChange={(e) => setSponsorName(e.target.value)}
                fullWidth
              />

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
            </Stack>
            <br/>

            <Stack spacing={2} margin={1}>
              <Typography variant="h7"><strong>Sponsorship Option(s)</strong></Typography>
              {/* Sponsorship Tier Dropdown */}
              <FormControl fullWidth>
                <InputLabel id="tier-label">Tiered Sponsorship</InputLabel>
                <Select
                  labelId="tier-label"
                  label="Tiered Sponsorship"
                  value={selectedTier}
                  onChange={(e) => setSelectedTier(e.target.value)}
                >
                  <MenuItem key="none" value="None">None</MenuItem>
                  {Object.keys(config.registrationConfig.CONFIG_SPONSOR_REGISTRATION_TIERS).map((tier, index) => (
                    <MenuItem key={index} value={tier}>
                      {tier} - ${config.registrationConfig.CONFIG_SPONSOR_REGISTRATION_TIERS[tier].toLocaleString()}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Individual Sponsorships Multi-Select */}
              <FormControl fullWidth>
                <InputLabel id="sponsorships-label">Individual Sponsorship(s)</InputLabel>
                <Select
                  labelId="sponsorships-label"
                  multiple
                  value={selectedSponsorships}
                  onChange={(e) => setSelectedSponsorships(e.target.value)}
                  input={<OutlinedInput label="Individual Sponsorship(s)" />}
                  renderValue={(selected) =>
                    selected
                      .map((sponsorship) =>
                        `${sponsorship} - $${config.registrationConfig.CONFIG_SPONSOR_REGISTRATION_ADDITIONAL_SPONSORSHIPS[sponsorship].toLocaleString()}`
                      )
                      .join(', ')
                  }
                >
                  {Object.keys(config.registrationConfig.CONFIG_SPONSOR_REGISTRATION_ADDITIONAL_SPONSORSHIPS).map((sponsorship, index) => (
                    <MenuItem key={index} value={sponsorship}>
                      <Checkbox checked={selectedSponsorships.includes(sponsorship)} />
                      {`${sponsorship} - $${config.registrationConfig.CONFIG_SPONSOR_REGISTRATION_ADDITIONAL_SPONSORSHIPS[sponsorship].toLocaleString()}`}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <br/>

              {/* Sponsor Logo Upload */}
              <Stack spacing={2} margin={1}>
                <Typography variant="h7"><strong>Logo (optional)</strong></Typography>
                {previewUrl ? (
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <img
                      src={previewUrl}
                      alt="Preview"
                      style={{ width: 100, height: 100, objectFit: 'cover' }}
                    />
                    <Button color="error" variant="outlined" onClick={handleLogoDelete}>
                      Delete
                    </Button>
                  </Stack>
                ) : (
                  <Button variant="outlined" component="label">
                    Upload Image
                    <input
                      id="upload-button-sponsorLogo"
                      type="file"
                      accept="image/*"
                      hidden
                      onChange={handleLogoUpload}
                    />
                  </Button>
                )}
              </Stack>
              <br/>

              {/* Total Fee */}
              <Typography variant="h6"><strong>Total Fee:</strong> ${totalFee.toLocaleString()}</Typography>

              {/* Message for Missing Selection */}
              {totalFee === 0 && (
                <Typography color="error">
                  Please select at least one sponsorship tier or additional sponsorship to proceed to checkout.
                </Typography>
              )}

              {/* Dynamic List of Selections */}
              <Stack spacing={1}>
                <Typography variant="h7" sx={{ textDecoration: 'underline' }}><strong>Selections</strong></Typography>
                {selectedTier && selectedTier !== "None" && (
                  <Typography>
                    {selectedTier} - ${config.registrationConfig.CONFIG_SPONSOR_REGISTRATION_TIERS[selectedTier].toLocaleString()}
                  </Typography>
                )}
                {selectedSponsorships.map((sponsorship, index) => (
                  <Typography key={index}>
                    {sponsorship} - ${config.registrationConfig.CONFIG_SPONSOR_REGISTRATION_ADDITIONAL_SPONSORSHIPS[sponsorship].toLocaleString()}
                  </Typography>
                ))}
              </Stack>

              {/* Rules Agreement */}
              <FormControlLabel
                control={
                  <Checkbox
                    checked={agreedToRules}
                    onChange={(e) => setAgreedToRules(e.target.checked)}
                  />
                }
                label={
                  <Typography>
                    I agree to the sponsorship rules outlined{' '}
                    <a href={config.registrationConfig.CONFIG_SPONSOR_REGISTRATION_RULES_HYPERLINK} target="_blank" rel="noopener noreferrer">
                      here
                    </a>.
                  </Typography>
                }
              />

              {/* Email for non-admin Authorize.net (Stripe collects on its hosted page) */}
              {!props.isAdmin && paymentProvider === 'authorize_net' && (
                <Stack spacing={2} sx={{ border: '1px solid #ddd', p: 2 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>Contact Information</Typography>
                  <TextField label="Email" type="email" value={email || ''} onChange={e => setEmail(e.target.value)} fullWidth required />
                  <TextField label="Phone" value={phone || ''} onChange={e => setPhone(e.target.value)} fullWidth />
                </Stack>
              )}

              {/* Authorize.net inline card form */}
              {!props.isAdmin && paymentProvider === 'authorize_net' && !isSubmitted && (
                <Stack spacing={2} sx={{ border: '1px solid #1976d2', borderRadius: 1, p: 2 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#1976d2' }}>Card Information</Typography>
                  <TextField label="Cardholder Name" value={cardholderName} onChange={e => setCardholderName(e.target.value)} fullWidth required />
                  <Stack direction={isMobile ? 'column' : 'row'} spacing={2}>
                    <TextField
                      label="Card Number"
                      value={cardNumber}
                      onChange={e => setCardNumber(e.target.value.replace(/[^\d\s]/g, '').slice(0, 19))}
                      fullWidth required inputProps={{ inputMode: 'numeric', maxLength: 19 }}
                    />
                    <TextField
                      label="MM/YY"
                      value={cardExpiry}
                      onChange={e => {
                        let v = e.target.value.replace(/[^\d/]/g, '');
                        if (v.length === 2 && !v.includes('/')) v = v + '/';
                        setCardExpiry(v.slice(0, 5));
                      }}
                      sx={{ width: isMobile ? '100%' : 120 }} required inputProps={{ inputMode: 'numeric', maxLength: 5 }}
                    />
                    <TextField
                      label="CVV"
                      value={cardCode}
                      onChange={e => setCardCode(e.target.value.replace(/\D/g, '').slice(0, 4))}
                      sx={{ width: isMobile ? '100%' : 100 }} required inputProps={{ inputMode: 'numeric', maxLength: 4 }}
                    />
                  </Stack>
                  {cardError && <Alert severity="error">{cardError}</Alert>}
                  <Button
                    color="primary" variant="contained"
                    disabled={!agreedToRules || totalFee === 0 || isSubmitting || !acceptJsLoaded || !cardholderName || !cardNumber || !cardExpiry || !cardCode}
                    onClick={handleSubmit}
                    startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
                  >
                    {isSubmitting ? "Processing..." : `Pay $${totalFee.toLocaleString()}`}
                  </Button>
                </Stack>
              )}

              {/* Stripe / Admin submit button */}
              {(props.isAdmin || paymentProvider === 'stripe') && !isSubmitted && (
                <Button
                  color="primary" variant="contained"
                  onClick={handleSubmit}
                  disabled={!agreedToRules || totalFee === 0 || isSubmitting}
                  startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
                >
                  {isSubmitting ? "Submitting..." : props.isAdmin ? "Add sponsor (no payment)" : "Go to Payment"}
                </Button>
              )}

              {isSubmitted && <Typography variant="h6">Submitted!</Typography>}
            </Stack>
          </DialogContent>
        </>
      ) : (
        <Typography>Loading...</Typography> // Show a loading state while config is being fetched
      )}
    </Dialog>

  );  
};

export default AddSponsorModal;

