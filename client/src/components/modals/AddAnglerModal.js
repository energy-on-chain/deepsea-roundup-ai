import React, { useState, useEffect } from 'react';
import { InputLabel, Typography, Select, MenuItem, Button, CircularProgress, FormControl, Dialog, DialogContent, DialogTitle, IconButton, Stack, TextField } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useMediaQuery, useTheme } from "@mui/material";

const AddAnglerModal = (props) => {

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // Check if the screen size is small (mobile)

  const [numberOfAnglers, setNumberOfAnglers] = useState(0);
  const [anglerDetails, setAnglerDetails] = useState([]);
  const [isEarlyBird, setIsEarlyBird] = useState(false);
  const [earlyBirdData, setEarlyBirdData] = useState({});
  const [normalData, setNormalData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);   // Track if form has been submitted successfully

  useEffect(() => {
    console.log("EarlyBird value is:", props.isEarlyBird)
    setIsEarlyBird(props.isEarlyBird);
    setEarlyBirdData(props.earlyBirdData);
    setNormalData(props.normalData);
  }, [props.isEarlyBird, props.earlyBirdData, props.normalData]);

  const handleNumberOfAnglersChange = (e) => {
    const count = parseInt(e.target.value, 10);
    setNumberOfAnglers(count);
    setAnglerDetails(
      Array.from({ length: count }, (_, index) => ({
        id: index,
        anglerName: "",
        hometown: "",
        boatName: "",
        ageBracket: "Adult",
        gender: "Male",
        division: "Offshore",
        over21: false,
      }))
    );
  };

  const handleAnglerDetailChange = (id, field, value) => {
    setAnglerDetails((prev) =>
      prev.map((angler) => (angler.id === id ? { ...angler, [field]: value } : angler))
    );
  };

  const handleClose = () => {
    setNumberOfAnglers(0);
    setAnglerDetails([]);
    setIsSubmitting(false);
    props.close();
  };

  const calculateFees = () => {
    const adults = anglerDetails.filter((a) => a.ageBracket === "Adult").length;
    const juniors = anglerDetails.filter((a) => a.ageBracket === "Junior").length;

    const adultFee = isEarlyBird
      ? adults * earlyBirdData.adultEarlybirdFee
      : adults * normalData.adultNormalfee;

    const juniorFee = isEarlyBird
      ? juniors * earlyBirdData.juniorEarlybirdFee
      : juniors * normalData.juniorNormalfee;

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

  const validateAnglerDetails = () => {
    let isValid = true;

    anglerDetails.forEach((angler, index) => {
      if (!angler.anglerName) {
        toast.warning(`Angler ${index + 1}: Full name is required.`);
        isValid = false;
      }
      if (!angler.hometown) {
        toast.warning(`Angler ${index + 1}: Hometown is required.`);
        isValid = false;
      }
      if (!angler.boatName && angler.division === "Offshore") {
        toast.warning(`Angler ${index + 1}: Boat name required for offshore division.`);
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
    if (process.env.REACT_APP_NODE_ENV === "staging") {
        apiUrl = process.env.REACT_APP_SERVER_URL_STAGING;
    } else if (process.env.REACT_APP_NODE_ENV === "production") {
        apiUrl = process.env.REACT_APP_SERVER_URL_PRODUCTION;
    }

    const adultFee = isEarlyBird ? earlyBirdData.adultEarlybirdFee : normalData.adultNormalfee;
    const juniorFee = isEarlyBird ? earlyBirdData.juniorEarlybirdFee : normalData.juniorNormalfee;

    const metaDataObject = {
      type: "angler",
      year: props.year,
      tableName: props.tableName,
      anglerDetails: anglerDetails,
      adultFee: adultFee,
      juniorFee: juniorFee,
    };

    const formData = new FormData();
    formData.append('metaDataObject', JSON.stringify(metaDataObject)); // Append the metaDataObject as a JSON string

    if (props.isAdmin) { // register as admin, non-payment case

      // FIXME: 
      // try {
      //   const response = await fetch(`${apiUrl}/api/${year}/admin_add_team`, {
      //     method: 'POST',
      //     body: formData,
      //   });

      //   if (response.ok) {
      //     toast.success("Successfully added a new team! Page refreshing...");
      //     setIsSubmitted(true);
      //     delayRefresh();
      //   } else {
      //     const errorResponse = await response.json(); // Parse JSON response body
      //     const errorMessage = errorResponse.error || 'Error saving team to database as administrator.';
      //     throw new Error(errorMessage);
      //   }
      // } catch (error) {
      //   toast.error(`${error}`);
      //   setIsSubmitting(false); // Re-enable the button if there's an error
      // }

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
            Adults ({anglerDetails.filter((a) => a.ageBracket === "Adult").length} x {formatCurrency(isEarlyBird ? earlyBirdData.adultEarlybirdFee : normalData.adultNormalfee)}{isEarlyBird ? "each, early bird" : " each"}): {formatCurrency(adultFee)}
          </Typography>
          <Typography sx={{ marginLeft: 2 }}>
            Juniors ({anglerDetails.filter((a) => a.ageBracket === "Junior").length} x {formatCurrency(isEarlyBird ? earlyBirdData.juniorEarlybirdFee : normalData.juniorNormalfee)}{isEarlyBird ? "each, early bird" : " each"}): {formatCurrency(juniorFee)}
          </Typography>

          {/* Submit Button */}
          { !isSubmitted ? ( // Only show the button if the form has not been submitted
            props.isAdmin ? (
              <Button 
                color="primary" 
                variant="contained" 
                onClick={handleFormSubmission} 
                disabled={isSubmitting}
                startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
              >
                {isSubmitting ? "Submitting..." : "Register team (with no online payment)"}
              </Button>
            ) : (
              <Button 
                color="primary" 
                variant="contained" 
                disabled={isSubmitting} 
                onClick={handleFormSubmission}
                startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
              >
                {isSubmitting ? "Submitting..." : "Go to payment"}
              </Button>
            )
          ) : (
            <h3>Submitted!</h3>
          )}

        </Stack>
      </DialogContent>
    </Dialog>
  );
};

export default AddAnglerModal;

