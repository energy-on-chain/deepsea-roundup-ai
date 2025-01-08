import React, {useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { InputLabel, Select, MenuItem, Divider, Button, Grid, Dialog, DialogContent, DialogTitle, IconButton, Stack, TextField, Autocomplete} from "@mui/material";
import CircularProgress from '@mui/material/CircularProgress';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import CloseIcon from "@mui/icons-material/Close"
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { loadConfigForYear } from '../../config/masterConfig';

const AddCatchModal = (props) => {

  const { year } = useParams();
  const [config, setConfig] = useState(null);

  const [day1, setDay1] = useState();
  const [day2, setDay2] = useState();
  const [today, setToday] = useState();

  const [anglerId, setAnglerId] = useState();
  const [anglerName, setAnglerName] = useState();
  const [numCatches, setNumCatches] = useState(0);
  const [anglerIsSelected, setAnglerIsSelected] = useState(false);
  const [anglerDivision, setAnglerDivision] = useState(null);
  const [anglerAgeBracket, setAnglerAgeBracket] = useState(null);
  const [anglerBoatName, setAnglerBoatName] = useState(null);
  const [registeredAnglerList, setRegisteredAnglerList] = useState([]);
  const [registeredAnglerNameList, setRegisteredAnglerNameList] = useState([]);
  const [catchData, setCatchData] = useState([]);
  const [speciesList, setSpeciesList] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);  // New state to track submission
  const [isSubmitted, setIsSubmitted] = useState(false);    // New state to track successful submission

  // INITIALIZE
  useEffect(() => {
    fetchConfigAndData(); // Load config and fetch data
  }, [year]);  // add tabName as a dependency to re-fetch when the tab changes

  const fetchConfigAndData = async () => {

    try {
      const loadedConfig = await loadConfigForYear(year); // Load the config dynamically
      setConfig(loadedConfig); // Set the loaded configuration

      const {
        catchConfig: {
          CONFIG_CATCHES_SPECIES_LIST,
        },
      } = loadedConfig;

      const apiUrl = process.env.REACT_APP_NODE_ENV === 'production'
        ? process.env.REACT_APP_SERVER_URL_PRODUCTION
        : process.env.REACT_APP_SERVER_URL_STAGING;

      fetch(`${apiUrl}/api/${year}/admin_get_database_list`, {    // get list of registered anglers
        method: 'POST',    
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({tableName: `anglers${year}`})
      })
      .then(res => res.json())
      .then(data => {
        var tempList = [];
        var tempNameList = [];
        Object.keys(data).map((anglerKey, i) => {
          let tempObject = {};
          let tempNameObject = {};
          tempObject[anglerKey] = data[anglerKey]
          tempNameObject["anglerKey"] = anglerKey;
          tempNameObject["anglerData"] = data[anglerKey];
          tempNameObject["label"]= data[anglerKey].anglerName;
          tempList.push(tempObject);
          tempNameList.push(tempNameObject);
        })

        setRegisteredAnglerList(tempList);
        setRegisteredAnglerNameList(tempNameList);
        setToday(props.today);
        setDay1(props.startDate);
        setDay2(props.endDate);
        setSpeciesList(CONFIG_CATCHES_SPECIES_LIST);

      })
      .catch(e => {
        console.error(e.error);
      })

    } catch (error) {
      console.log('There was an error loading the data for the addCatchModal: ' + error);
    };

  };

  const handleClose = () => {
    setRegisteredAnglerList([]);
    setAnglerId();
    setAnglerName();
    setAnglerId();
    setAnglerIsSelected(false);
    setNumCatches(0);
    setCatchData([]);
    setIsSubmitting(false);
    setIsSubmitted(false);
    props.close();
  }

  const delayRefresh = () => {
    setTimeout(() => {
      console.log('Delaying page refresh...');
      window.location.reload();
    }, 2000);
  }

  const validateUserInput = () => {
    let inputIsValid = true;
  
    catchData.forEach((entry, i) => {
  
      if (!entry.anglerId) {
        toast.warning(`Please select a angler for catch#${i + 1}`);
        inputIsValid = false;
      }
  
      if (!entry.species || entry.species.trim() === "") {
        toast.warning(`Please select a species for catch#${i + 1}`);
        inputIsValid = false;
      }
  
      if (entry.dateTimeIsRequired && !entry.dateTime) {
        toast.warning(`Please enter a date and time for catch#${i + 1}`);
        inputIsValid = false;
      }
  
      if (entry.weightIsRequired && (isNaN(parseFloat(entry.weight)) || parseFloat(entry.weight) <= 0)) {
        toast.warning(`Please enter a valid weight greater than zero for catch#${i + 1}`);
        inputIsValid = false;
      }
  
      if (entry.lengthIsRequired && (isNaN(parseFloat(entry.length)) || parseFloat(entry.length) <= 0)) {
        toast.warning(`Please enter a valid length greater than zero for catch#${i + 1}`);
        inputIsValid = false;
      }
  
      if (entry.girthIsRequired && (isNaN(parseFloat(entry.girth)) || parseFloat(entry.girth) <= 0)) {
        toast.warning(`Please enter a valid girth greater than zero for catch#${i + 1}`);
        inputIsValid = false;
      }
  
      if (entry.photoIsRequired && !entry.catchPhoto) {
        toast.warning(`A photo is required for catch#${i + 1}`);
        inputIsValid = false;
      }
    });
  
    return inputIsValid;
  };
  
  const handleChangeNumberOfCatches = (e) => {

    const currentDateTime = dayjs().toISOString(); // Get the current date and time in ISO format

    setNumCatches(e.target.value);
    if (e.target.value > 0) {
      const catchDataList = [];
      for (let i=0; i<e.target.value; i++) {
        catchDataList.push(
          {
            id: i,
            anglerId: anglerId,
            anglerName: anglerName,
            species: "",
            division: anglerDivision,
            type: "",
            dateTime: currentDateTime,
            length: 0,
            girth: 0,
            weight: 0,
            points: 0,
            catchPhoto: null,
          }
        )
      }
      setCatchData(catchDataList);
    } else {
      setCatchData([]);
    }
  }

  const handlePointsCalculation = (catchEntry) => {
    console.log("In handlePointsCalculation");
    console.log(catchEntry);

    let points = 0;
    const { pointsCalculationMethod, weight, length, species } = catchEntry;
  
    if (pointsCalculationMethod === "flat") {
      let filteredSpeciesList = speciesList.filter((species) => species.division === anglerDivision) 
      let speciesInfo = filteredSpeciesList.find((element) => element.species === species);
      points = speciesInfo.points;  // Assume points are predefined
    } else if (pointsCalculationMethod.includes("weight")) {
      if (pointsCalculationMethod === "weightRoundUp") {
        points = Math.ceil(weight);
      } else if (pointsCalculationMethod === "weightExact") {
        points = weight;
      } else if (pointsCalculationMethod === "weightRoundDown") {
        points = Math.floor(weight);
      }
    } else if (pointsCalculationMethod.includes("length")) {
      if (pointsCalculationMethod === "lengthRoundUp") {
        points = Math.ceil(length);
      } else if (pointsCalculationMethod === "lengthExact") {
        points = length;
      } else if (pointsCalculationMethod === "lengthRoundDown") {
        points = Math.floor(length);
      }
    }
  
    return points;
  };  

  const handleAnglerSelection = (event, value) => {
    if (value) {
      setAnglerId(value["anglerKey"]);
      setAnglerName(value["anglerData"]["anglerName"]);
      setAnglerDivision(value["anglerData"]["division"]); // Store the angler's division
      setAnglerAgeBracket(value["anglerData"]["ageBracket"]); // Store the angler's division
      setAnglerBoatName(value["anglerData"]["boatName"]); 
      setAnglerIsSelected(true);
    
      let updatedCatchData = catchData.map(catchEntry => ({
        ...catchEntry,
        anglerId: value["anglerKey"],
        anglerName: value["anglerData"]["anglerName"],
      }));
    
      setCatchData(updatedCatchData);
    } else {
      setAnglerDivision(null); // Reset division if no angler is selected
      setAnglerAgeBracket(null);
      setAnglerBoatName(null);
      setAnglerIsSelected(false);
    }
  };  

  const handleSpeciesSelection = (event, value, index) => {
    if (!value) return;
  
    let newCatchData = [...catchData];

    const filteredSpeciesList = speciesList.filter((species) => species.division === anglerDivision) 
    const speciesInfo = filteredSpeciesList.find((species) => species.species === value.label);
    // const speciesInfo = speciesList.find((species) => species.species === value.label);
  
    if (speciesInfo) {
      newCatchData[index] = {
        ...newCatchData[index],
        species: speciesInfo.species,
        division: speciesInfo.division,
        type: speciesInfo.type,
        pointsCalculationMethod: speciesInfo.pointsCalculationMethod,
        weightIsRequired: speciesInfo.weightIsRequired,
        lengthIsRequired: speciesInfo.lengthIsRequired,
        girthIsRequired: speciesInfo.girthIsRequired,
        dateTimeIsRequired: speciesInfo.dateTimeIsRequired,
        photoIsRequired: speciesInfo.photoIsRequired,
      };
    }
  
    setCatchData(newCatchData);
  };  
  
  const handleDateTimeSelection = (index, event) => {
    let newCatchData = [...catchData];
    newCatchData[index].dateTime = event ? event.toISOString() : null;  // Use event to set the date or null
    newCatchData[index].points = handlePointsCalculation(newCatchData[index]);
    setCatchData(newCatchData);
  }

  const handleWeightSelection = (index, event) => {
    let newCatchData = [...catchData];
    newCatchData[index].weight = event.target.value;
  
    // Recalculate points if the method involves weight
    if (newCatchData[index].pointsCalculationMethod.includes("weight")) {
      newCatchData[index].points = handlePointsCalculation(newCatchData[index]);
    }
  
    setCatchData(newCatchData);
  };
  
  const handleLengthSelection = (index, event) => {
    let newCatchData = [...catchData];
    newCatchData[index].length = event.target.value;
  
    // Recalculate points if the method involves length
    if (newCatchData[index].pointsCalculationMethod.includes("length")) {
      newCatchData[index].points = handlePointsCalculation(newCatchData[index]);
    }
  
    setCatchData(newCatchData);
  };
  
  const handleGirthSelection = (index, event) => {
    console.log('handleGirthSelection...');
    let newCatchData = [...catchData];
    newCatchData[index].girth = event.target.value;
    setCatchData(newCatchData);
  }

  const handleImageChange = (index, event) => {
    console.log('In handleImageChange...');
    let newCatchData = [...catchData];

    if (event.target.files[0]) {
      const file = event.target.files[0];
      console.log("file:", file);
      const fileExtension = file.name.substring(file.name.lastIndexOf('.'));
      const newFile = new File([file], "catchPhoto", {
        type: file.type,
      });
      newCatchData[index].catchPhoto = file;
      newCatchData[index].catchPhotoUrl = URL.createObjectURL(file);  // Add preview URL
    }
    
    setCatchData(newCatchData);
    console.log(newCatchData);
  };
  
  const handleRemoveImage = (index) => {
    let newCatchData = [...catchData];
    newCatchData[index].catchPhoto = null;
    newCatchData[index].catchPhotoUrl = null;  // Clear the preview URL
    setCatchData(newCatchData);
    document.getElementById(`upload-photo-${index}`).value = '';
  };  

  const addCatches = () => {
    return catchData.map((element, index) => (
      <div>
        <br/>
        <Divider>
          <InputLabel id={"catch-" + index}>Catch #{index + 1}</InputLabel>
        </Divider>
        <br/>
        
        {/* Species, Type, Points */}
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4} md={4} lg={4} xl={4}>
            <Autocomplete
              disablePortal
              id={`select-angler-species-box-${index}`}
              value={catchData[index]?.species || null}
              options={speciesList
                .filter((species) => anglerDivision === null || species.division === anglerDivision) // Filter by division
                .map((species) => ({
                  label: species.species,
                  type: species.type,
                  division: species.division,
                }))
              }
              groupBy={(option) => option.type}
              renderInput={(params) => <TextField {...params} label="Select species" />}
              onChange={(event, value) => handleSpeciesSelection(event, value, index)}
            />
          </Grid>
          <Grid item xs={12} sm={4} md={4} lg={4} xl={4}>
            { catchData[index].type && <InputLabel>Species Type: {catchData[index].type}</InputLabel> }
          </Grid>
          <Grid item xs={12} sm={4} md={4} lg={4} xl={4}>
            { catchData[index].points ? (
              <InputLabel>Points: {catchData[index].points}</InputLabel>
            ) : (
              <InputLabel>Points: -</InputLabel>
            )}
          </Grid>
        </Grid>
        <br/>

        {/* Length, Width, Girth */}
        { (
            catchData[index].lengthIsRequired ||
            catchData[index].widthIsRequired ||
            catchData[index].girthIsRequired
          ) &&
              <Grid container spacing={2}>

                {/* Weight */}
                { catchData[index].weightIsRequired && 
                  <Grid item xs={12} sm={4} md={4} lg={4} xl={4}>
                    <TextField 
                          type="number"
                          id={"select-catch-weight-" + index}
                          InputProps={{
                              inputProps: { 
                                  step: 0.1, min: 0.1 
                              }
                          }}
                          label="Weight (by 1/10 lb)"
                          value={catchData[index].weight || ''}  
                          onChange={(e) => handleWeightSelection(index, e)}
                      />
                  </Grid>
                }

                {/* Length */}
                { catchData[index].lengthIsRequired && 
                  <Grid item xs={12} sm={4} md={4} lg={4} xl={4}>
                    <TextField 
                      type="number"
                      id={"select-catch-length-" + index}
                      InputProps={{
                          inputProps: { 
                              step: 0.125, min: 0.125 
                          }
                      }}
                      label="Length (by 1/8 inch)"
                      value={catchData[index].length || ''}  
                      onChange={(e) => handleLengthSelection(index, e)}
                    />
                  </Grid>
                }

                {/* Girth */}
                { catchData[index].girthIsRequired && 
                  <Grid item xs={12} sm={4} md={4} lg={4} xl={4}>
                    <TextField 
                      type="number"
                      id={"select-catch-girth-" + index}
                      InputProps={{
                          inputProps: { 
                              step: 0.125, min: 0.125 
                          }
                      }}
                      label="Girth (by 1/8 inch)"
                      value={catchData[index].girth || ''} 
                      onChange={(e) => handleGirthSelection(index, e)}
                      />
                  </Grid>
                }

          </Grid>
        }
        <br/>

        {/* DateTime */}
        { catchData[index].dateTimeIsRequired && 
          <div>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DateTimePicker 
                    required 
                    // disablePast 
                    id={"select-catch-date-" + index} 
                    value={catchData[index].dateTime ? dayjs(catchData[index].dateTime) : null}
                    timeSteps={{ minutes: 1 }}
                    minDate={dayjs(day1)} 
                    maxDate={dayjs(day2)} 
                    onChange={(e) => handleDateTimeSelection(index, e)}/>
                </LocalizationProvider>
              </Grid>
            </Grid>
          </div>
        }
        <br/>

        {/* Photo */}
        { catchData[index].photoIsRequired && 
          <div>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <div>
                  {/* Hide the file input and create a custom label to trigger it */}
                  <input
                    accept="image/*"
                    type="file"
                    id={"upload-photo-" + index}
                    style={{ display: 'none' }}  // Hide the default file input
                    onChange={(e) => handleImageChange(index, e)}
                  />
                  <label htmlFor={"upload-photo-" + index}>
                    <Button variant="contained" component="span">
                      Upload Catch Photo*
                    </Button>
                  </label>
                  
                  { catchData[index].catchPhotoUrl && (
                    <div style={{ width: '100px', height: '100px', marginTop: '10px' }}>
                      <img 
                        src={catchData[index].catchPhotoUrl} 
                        alt="Catch preview" 
                        style={{ width: '100px', height: '100px', objectFit: 'cover' }}  // Restrict size to 100x100
                      />
                      <Button onClick={() => handleRemoveImage(index)}>Remove Photo</Button>
                    </div>
                  )}
                </div>
              </Grid>
            </Grid>
          </div>
        }
        <br/>

      </div>
    ))
  }

  const handleCreateCatches = () => {
    if (validateUserInput()) {
      console.log('Input validated! Writing to catch database now...');
      setIsSubmitting(true);
  
      const formData = new FormData();
  
      // Append each catch's data and photo (if present) to FormData
      catchData.forEach((item, index) => {
        formData.append(`catchData[${index}][anglerId]`, item.anglerId);
        formData.append(`catchData[${index}][anglerName]`, item.anglerName);
        formData.append(`catchData[${index}][species]`, item.species);
        formData.append(`catchData[${index}][division]`, item.division);
        formData.append(`catchData[${index}][type]`, item.type);
        // Check if dateTime is a valid Day.js object before calling toISOString()
        formData.append(
          `catchData[${index}][dateTime]`,
          item.dateTime ? dayjs(item.dateTime).toISOString() : '' // Safely append dateTime
        );
        formData.append(`catchData[${index}][length]`, item.length);
        formData.append(`catchData[${index}][girth]`, item.girth);
        formData.append(`catchData[${index}][weight]`, item.weight);
        formData.append(`catchData[${index}][points]`, item.points);
        
        // Append the photo if it exists
        if (item.catchPhoto) {
          console.log('catchPhoto exists!')
          console.log(item.catchPhoto);
          console.log(item.catchPhotoUrl);
          formData.append(`catchPhoto_${index}`, item.catchPhoto);
        }
      });
  
      formData.append('catchYear', props.catchYear);
  
      let apiUrl = null;
      if (process.env.REACT_APP_NODE_ENV === 'staging') {
        apiUrl = process.env.REACT_APP_SERVER_URL_STAGING;
      } else if (process.env.REACT_APP_NODE_ENV === 'production') {
        apiUrl = process.env.REACT_APP_SERVER_URL_PRODUCTION;
      }
  
      fetch(`${apiUrl}/api/${year}/admin_add_catch`, {
        method: 'POST',
        body: formData,
      })
      .then((res) => {
        if (res.ok) {
          toast.success(`Successfully added ${numCatches} catches! Page refreshing...`);
          setIsSubmitted(true); // Mark as submitted
          delayRefresh();
        } else {
          toast.error('Error while attempting to save catches.');
          setIsSubmitting(false); // Reset submission state if failed
        }
      })
      .catch((e) => {
        console.error(e);
        toast.error('Error while attempting to save catches to database.');
        setIsSubmitting(false); // Reset submission state if failed
      });
    } else {
      console.log('Input was not valid or there was an error');
    }
  };
  
  return (
    <Dialog open={props.status} onClose={handleClose} fullWidth maxWidth="xl">
      <form action="/" method="POST" onSubmit={(e) => { e.preventDefault(); alert('Submitted form!'); this.handleClose(); } }>
        <DialogTitle>Add {props.year} Catches<IconButton onClick={handleClose} style={{float:'right'}}><CloseIcon color="primary"></CloseIcon></IconButton>  </DialogTitle>
        <DialogContent>
        {/* <DialogContent style={{ height: '200px', overflowY: 'auto' }}> */}
            <Stack xs spacing={2} margin={2}>
              <InputLabel required id="angler-label">Select angler</InputLabel>
              <Autocomplete
                disablePortal
                id="select-angler-autocomplete-box"
                options={registeredAnglerNameList}
                renderInput={(params) => <TextField {...params} label="Angler name"/>}
                onChange={handleAnglerSelection}
              />

            {anglerIsSelected && (
              <>
                <InputLabel id="angler-division-label"><strong>Division:</strong>  {anglerDivision}</InputLabel>
                <InputLabel id="angler-division-label"><strong>Age Bracket:</strong>  {anglerAgeBracket}</InputLabel>
                <InputLabel id="angler-boat-name-label"><strong>Boat Name:</strong>  {anglerBoatName}</InputLabel>

                <InputLabel required id="num-catches-label">Select number of catches to add</InputLabel>
                <Select labelId="num-catches-label" id="num-catches" value={numCatches} onChange={handleChangeNumberOfCatches}>
                  {[...Array(11).keys()].map(i => <MenuItem key={i} value={i}>{i}</MenuItem>)}
                </Select>

                {catchData.length > 0 && addCatches()}

                {!isSubmitted ? (
                  <Button
                    disabled={isSubmitting || numCatches <= 0}
                    color="primary"
                    variant="contained"
                    onClick={handleCreateCatches}
                    startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
                  >
                    {isSubmitting ? "Submitting..." : "Submit"}
                  </Button>
                ) : (
                  <h3>Submitted!</h3>
                )}
              </>
            )}

            </Stack>
        </DialogContent>
      </form>
    </Dialog>
  );
};

export default AddCatchModal;

