import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { InputLabel, Typography, Select, MenuItem, Button, CircularProgress, FormControl, Dialog, DialogContent, DialogTitle, IconButton, Stack, TextField } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
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

  const [adminDefaults, setAdminDefaults] = useState({ phone: "", email: "", hometown: "" });

  useEffect(() => {
    if (props.isAdmin) {
      loadConfigForYear(year).then(cfg => {
        const { CONFIG_ADMIN_DEFAULT_PHONE, CONFIG_ADMIN_DEFAULT_EMAIL, CONFIG_ADMIN_DEFAULT_HOMETOWN } = cfg?.adminConfig || {};
        setAdminDefaults({
          phone: CONFIG_ADMIN_DEFAULT_PHONE || "",
          email: CONFIG_ADMIN_DEFAULT_EMAIL || "",
          hometown: CONFIG_ADMIN_DEFAULT_HOMETOWN || "",
        });
      }).catch(() => {});
    }
  }, [year, props.isAdmin]);

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

  const handlePayment = async () => {
    
    let apiUrl = null;
    if (import.meta.env.VITE_NODE_ENV === "staging") {
        apiUrl = import.meta.env.VITE_SERVER_URL_STAGING;
    } else if (import.meta.env.VITE_NODE_ENV === "production") {
        apiUrl = import.meta.env.VITE_SERVER_URL_PRODUCTION;
    }

    const adultFee = props.isEarlyBird ? props.earlyBirdData.adultEarlybirdFee : props.normalData.adultNormalfee;
    const juniorFee = props.isEarlyBird ? props.earlyBirdData.juniorEarlybirdFee : props.normalData.juniorNormalfee;

    let metaDataObject;
    if (props.isAdmin) {
      metaDataObject = {
        type: "angler",
        year: props.year,
        tableName: props.tableName,
        email: email,
        phone: phone,
        anglerDetails: anglerDetails,
        adultFee: adultFee,
        juniorFee: juniorFee,
      };
    } else {
      metaDataObject = {
        type: "angler",
        year: props.year,
        tableName: props.tableName,
        anglerDetails: anglerDetails,
        adultFee: adultFee,
        juniorFee: juniorFee,
      };
    }

    const formData = new FormData();
    formData.append('metaDataObject', JSON.stringify(metaDataObject)); // Append the metaDataObject as a JSON string

    if (props.isAdmin) { // register as admin, non-payment case

      fetch(`${apiUrl}/api/${props.year}/registration_by_admin`, {
        method: 'POST',
        body: formData,
      }).then(res => {
        if (res.ok) {
          return res.json();
        } else {
          return res.json().then(json => Promise.reject(json));
        }
      }).then(({ url }) => {
        setIsSubmitted(true);
        window.location.reload();
      }).catch(e => {
        console.error(e.error);
      });

    } else {

      fetch(`${apiUrl}/api/${props.year}/registration_checkout_session`, {
        method: 'POST',
        body: formData,
      }).then(res => {
        if (res.ok) {
          return res.json();
        } else {
          return res.json().then(json => Promise.reject(json));
        }
      }).then(({ url }) => {
        setIsSubmitted(true);
        window.location = url;
      }).catch(e => {
        console.error(e.error);
      });

    }
  }

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

          {!isSubmitted ? (
            <Button
              color="primary"
              variant="contained"
              disabled={numberOfAnglers === 0 || isSubmitting} // Enabled if anglers > 0
              onClick={handleFormSubmission}
              startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
            >
              {isSubmitting ? "Submitting..." : props.isAdmin ? "Register team (no payment)" : "Go to payment"}
            </Button>
          ) : (
            <h3>Submitted!</h3>
          )}

        </Stack>
      </DialogContent>
    </Dialog>
  );
};

export default AddAnglerModal;

