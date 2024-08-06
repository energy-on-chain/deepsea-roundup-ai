import React, { useState, useEffect } from 'react';
import { InputLabel, Select, MenuItem, Divider, Button, Grid, Dialog, DialogContent, DialogTitle, IconButton, Stack, TextField, FormControlLabel, Checkbox, Autocomplete } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { toast } from 'react-toastify';

import { 
  CONFIG_FIREBASE_TEAMS_TABLE_NAME,
  CONFIG_REGISTRATION_PAST_TEAMS_TABLES_FOR_AUTOCOMPLETE_NAME_LIST,
  CONFIG_GENERAL_LINK_TO_TOURNAMENT_RULES,
  CONFIG_REGISTRATION_HAS_EARLYBIRD_REGISTRATION,
  CONFIG_REGISTRATION_EARLYBIRD_CUTOFF_IN_LOCAL_TIME_IN_MS,
  CONFIG_REGISTRATION_EARLYBIRD_FEE,
  CONFIG_REGISTRATION_NORMAL_FEE,
} from '../../config';

import 'react-toastify/dist/ReactToastify.css';

const RegisterTeamModal = (props) => {

  const [teamNameOptions, setTeamNameOptions] = useState([]);
  const [teamName, setTeamName] = useState('');
  const [registrationFee, setRegistrationFee] = useState(0);
  const [isEarlybird, setIsEarlybird] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [isValidInput, setIsValidInput] = useState(false);

  useEffect(() => {

    // Assess earlybird registration condition
    if (CONFIG_REGISTRATION_HAS_EARLYBIRD_REGISTRATION) {
      
      let now = new Date();
      let localTime = now.getTime() - (now.getTimezoneOffset() * 60000);

      if ((CONFIG_REGISTRATION_EARLYBIRD_CUTOFF_IN_LOCAL_TIME_IN_MS - localTime) > 0) {
        setRegistrationFee(CONFIG_REGISTRATION_EARLYBIRD_FEE);
        setIsEarlybird(true);
      } else {
        setRegistrationFee(CONFIG_REGISTRATION_NORMAL_FEE);
        setIsEarlybird(false);
      }

    } else {
      setRegistrationFee(CONFIG_REGISTRATION_NORMAL_FEE);
      setIsEarlybird(false);
    }

    // Fetch past team names from server
    if (CONFIG_REGISTRATION_PAST_TEAMS_TABLES_FOR_AUTOCOMPLETE_NAME_LIST.length > 0) {

      const fetchTeamNames = async () => {
        try {
          const response = await fetch('/api/registration-get-past-team-name-list', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              teamTableNameList: CONFIG_REGISTRATION_PAST_TEAMS_TABLES_FOR_AUTOCOMPLETE_NAME_LIST,
             })
          });
          const data = await response.json();
          setTeamNameOptions(data.teamNames);
        } catch (error) {
          console.error("Error fetching team names:", error);
        }
      };
    
      fetchTeamNames();
    } 

  }, []);

  const handleClose = () => {
    setTeamName('');
    setIsChecked(false);
    setIsValidInput(false);
    props.close();
  }

  const validateUserInput = () => {
    if (!teamName) {
      toast.warning("Please enter a team name");
      setIsValidInput(false);
      return false;
    }

    if (!isChecked) {
      toast.warning("Please read and agree to the event rules.");
      setIsValidInput(false);
      return false;
    }

    setIsValidInput(true);
    return true;
  }

  const onChangeTeamName = (e, newValue) => {
    setTeamName(newValue || e.target.value);
  }

  const handlePayment = async () => {
    let apiUrl = null;
    if (process.env.REACT_APP_NODE_ENV === "staging") {
      apiUrl = process.env.REACT_APP_SERVER_URL_STAGING;
    } else if (process.env.REACT_APP_NODE_ENV === "production") {
      apiUrl = process.env.REACT_APP_SERVER_URL_PRODUCTION;
    }

    let defaultCheckin = "No";

    let metaDataObject = {
      teamName: teamName,
      registrationFee: registrationFee,
      hasCheckedIn: defaultCheckin,
      isEarlybirdString: isEarlybird,
      teamTableName: CONFIG_FIREBASE_TEAMS_TABLE_NAME,
    }

    fetch(`${apiUrl}/api/registration-checkout-session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(metaDataObject)
    }).then(res => {
      if (res.ok) {
        return res.json()
      } else {
        return res.json().then(json => Promise.reject(json))
      }
    }).then(({ url }) => {
      window.location = url;
    }).catch(e => {
      console.error(e.error)
    })
  }

  const handleFormSubmission = () => {
    if (validateUserInput()) {
      handlePayment();
    }
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <Dialog open={props.status} onClose={handleClose} fullWidth maxWidth="xl">
      <form action="/" method="POST" onSubmit={(e) => { e.preventDefault(); this.handleClose(); }}>
        <DialogTitle>Register a New Team<IconButton onClick={handleClose} style={{ float: 'right' }}><CloseIcon color="primary"></CloseIcon></IconButton></DialogTitle>
        <DialogContent>
          <Stack xs spacing={2} margin={2}>
            <InputLabel required id="team-label">Enter your team name:</InputLabel>
            <Autocomplete
              id="team-name-autocomplete"
              options={teamNameOptions}
              value={teamName}
              onInputChange={onChangeTeamName} // Handling typing in input
              onChange={onChangeTeamName} // Handling selection from dropdown
              renderInput={(params) => <TextField {...params} variant="outlined" />}
              freeSolo
            />
            <br />
            <InputLabel id="total-fee-label">
              <strong>Your Total Fee: {formatCurrency(registrationFee)}</strong>
            </InputLabel>
            {isEarlybird ? (
              <InputLabel key="team-registration-fee">
                Team Registration (Earlybird): {formatCurrency(registrationFee)}
              </InputLabel>
            ) : (
              <InputLabel key="team-registration-fee">
                Team Registration: {formatCurrency(registrationFee)}
              </InputLabel>
            )}
            <FormControlLabel control={<Checkbox color="primary" onChange={(e) => { setIsChecked(e.target.checked) }}></Checkbox>} label={
              <div>
                <span>I have read and understand </span>
                <a href={CONFIG_GENERAL_LINK_TO_TOURNAMENT_RULES} target="_blank" rel="noopener noreferrer"> the rules.</a>
              </div>
            }></FormControlLabel>
            <Button color="primary" variant="contained" disabled={!isChecked} onClick={handleFormSubmission}>Go to payment</Button>
          </Stack>
        </DialogContent>
      </form>
    </Dialog>
  );
};

export default RegisterTeamModal;

