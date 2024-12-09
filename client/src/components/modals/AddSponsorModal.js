import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  InputLabel, Select, MenuItem, Button, FormControl, Dialog, DialogContent, DialogTitle,
  IconButton, Stack, Checkbox, Typography, OutlinedInput, FormControlLabel, TextField
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { loadConfigForYear } from '../../config/masterConfig';

const AddSponsorModal = (props) => {

  const { year } = useParams();
  const [config, setConfig] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false); // New state to track submission
  const [isSubmitted, setIsSubmitted] = useState(false);   // Track if form has been submitted successfully

  const [sponsorName, setSponsorName] = useState('');
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
      // Load the dynamic configuration for the selected year
      const loadedConfig = await loadConfigForYear(year);
      setConfig(loadedConfig); // Set the loaded configuration
  
      const {
        registrationConfig: {
          CONFIG_SPONSOR_REGISTRATION_TIERS,
          CONFIG_SPONSOR_REGISTRATION_ADDITIONAL_SPONSORSHIPS,
          CONFIG_SPONSOR_REGISTRATION_RULES_HYPERLINK,
        }
      } = loadedConfig;
  
    } catch (error) {
      console.log('There was an error loading initial data from the server in the admin add team component: ' + error);
    }
  };

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
  
  const validateInput = () => {

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

  const handlePayment = async () => {
    
    let apiUrl = null;
    if (process.env.REACT_APP_NODE_ENV === "staging") {
        apiUrl = process.env.REACT_APP_SERVER_URL_STAGING;
    } else if (process.env.REACT_APP_NODE_ENV === "production") {
        apiUrl = process.env.REACT_APP_SERVER_URL_PRODUCTION;
    }

    const metaDataObject = {
      type: "sponsor",
      year: props.year,
      tableName: props.tableName,
      sponsorName: sponsorName,
      selectedTier: selectedTier,
      selectedSponsorships: selectedSponsorships,
      totalFee: totalFee,
      tierFeeStructure: config.registrationConfig.CONFIG_SPONSOR_REGISTRATION_TIERS,
      selectedSponsorshipsFeeStructure: config.registrationConfig.CONFIG_SPONSOR_REGISTRATION_ADDITIONAL_SPONSORSHIPS,
    };

    const formData = new FormData();
    formData.append('metaDataObject', JSON.stringify(metaDataObject)); // Append the metaDataObject as a JSON string
    if (sponsorLogo) {
      formData.append('sponsorLogo', sponsorLogo.file); // Add the logo file if uploaded
    }

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
      {config ? (
        <>
          <DialogTitle>
            Register A New Sponsor
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

              {/* Submit Button */}
              <Button
                color="primary"
                variant="contained"
                onClick={handleSubmit}
                disabled={!agreedToRules || totalFee === 0}
              >
                Go to Payment
              </Button>
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

