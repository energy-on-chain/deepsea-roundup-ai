import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { InputLabel, Button, Dialog, DialogContent, DialogTitle, IconButton, Stack, TextField, FormControlLabel, Checkbox, Autocomplete } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CircularProgress from '@mui/material/CircularProgress';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { loadConfigForYear } from '../../config/masterConfig';

const AdminAddPotModal = (props) => {
  const { year } = useParams();
  const [config, setConfig] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // State
  const [isLoaded, setIsLoaded] = useState(false);
  const [anglerData, setAnglerData] = useState([]); // Store raw angler data
  const [selectedBoard, setSelectedBoard] = useState(null);
  const [eligibleParticipants, setEligibleParticipants] = useState([]);
  const [boardList, setBoardList] = useState([]);
  const [teamIsSelected, setTeamIsSelected] = useState(false);
  const [teamId, setTeamId] = useState();
  const [teamName, setTeamName] = useState();
  const [boardSelections, setBoardSelections] = useState([]);
  const [isValidInput, setIsValidInput] = useState(false);

  useEffect(() => {
    fetchConfigAndData();
  }, [year]);

  useEffect(() => {
    if (anglerData.length > 0 && selectedBoard) {
      updateEligibleParticipants();
    }
  }, [selectedBoard, anglerData]);

  const fetchConfigAndData = async () => {
    try {
      const loadedConfig = await loadConfigForYear(year);
      setConfig(loadedConfig);

      // Set board list from config
      const boards = loadedConfig?.potsConfig?.CONFIG_POTS_BOARD_LIST.map(board => 
        Object.keys(board)[0]
      );
      setBoardList(boards);

      const apiUrl = import.meta.env.VITE_NODE_ENV === 'production'
        ? import.meta.env.VITE_SERVER_URL_PRODUCTION
        : import.meta.env.VITE_SERVER_URL_STAGING;

      // Fetch angler data
      const response = await fetch(`${apiUrl}/api/${year}/admin_get_angler_list`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      
      // Store raw angler data
      const anglers = Object.entries(data).map(([id, angler]) => ({
        id,
        ...angler
      }));
      setAnglerData(anglers);
      setIsLoaded(true);

    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Error loading data. Please try again.');
    }
  };

  const updateEligibleParticipants = () => {
    const participants = [];
    
    switch(selectedBoard) {
      case 'Billfish Pots':
      case 'Offshore Fish Pots':
      case 'Newly Added Pots':
        // Get unique boat names
        const uniqueBoats = [...new Set(anglerData
          .filter(angler => angler.boatName && angler.boatName.trim() !== '')
          .map(angler => angler.boatName)
        )];
        participants.push(...uniqueBoats.map(boat => ({
          id: boat,
          label: boat,
          type: 'boat'
        })));
        break;

      case 'Bay/Surf Fish Pots':
        // Get unique Bay/Surf Adult anglers
        const baySurfAnglers = anglerData.filter(angler => 
          angler.division === 'Bay/Surf' && 
          angler.ageBracket === 'Adult'
        );
        participants.push(...baySurfAnglers.map(angler => ({
          id: angler.anglerId,
          label: angler.anglerName,
          type: 'angler'
        })));
        break;
    }
    setEligibleParticipants(participants);
  };

  const handleClose = () => {
    setSelectedBoard(null);
    props.close();
  }

  const handleBoardChange = (event, newValue) => {
    setSelectedBoard(newValue);
    // Reset selections when board changes
    setTeamId(undefined);
    setTeamName(undefined);
    setTeamIsSelected(false);
    setBoardSelections([]);
  };

  const handleTeamSelection = (event, value) => {
    if (value) {
      setTeamId(value.id);
      setTeamName(value.label);
      setTeamIsSelected(true);
      console.log('Selected team details:')
      console.log(value.id)
      console.log(value.label)
    } else {
      setTeamId(undefined);
      setTeamName(undefined);
      setTeamIsSelected(false);
    }
  };

  const handleBoardSelection = (boardName, isSelected) => {
    const pots = config?.potsConfig?.CONFIG_POTS_BOARD_LIST.find(board => 
      Object.keys(board)[0] === boardName
    )[boardName];
    
    const totalFee = pots.reduce((acc, pot) => acc + pot.amount, 0);
    const newSelections = [...boardSelections];
    const currentBoardIndex = newSelections.findIndex(selection => 
      selection.board === boardName
    );

    if (isSelected) {
      if (currentBoardIndex === -1) {
        newSelections.push({
          board: boardName,
          potList: pots.map(pot => pot.title),
          totalFee,
        });
      } else {
        const currentBoard = newSelections[currentBoardIndex];
        currentBoard.potList = pots.map(pot => pot.title);
        currentBoard.totalFee = totalFee;
        newSelections[currentBoardIndex] = currentBoard;
      }
    } else {
      newSelections.splice(currentBoardIndex, 1);
    }

    setBoardSelections(newSelections);
  };

  const handlePotSelection = (boardName, potTitle, isSelected, potAmount) => {
    const newSelections = [...boardSelections];
    const currentBoardIndex = newSelections.findIndex(selection => 
      selection.board === boardName
    );
    
    let currentBoard = newSelections[currentBoardIndex] || {
      board: boardName,
      potList: [],
      totalFee: 0,
    };

    if (isSelected) {
      if (!currentBoard.potList.includes(potTitle)) {
        currentBoard.potList.push(potTitle);
        currentBoard.totalFee += potAmount;
      }
    } else {
      currentBoard.potList = currentBoard.potList.filter(pot => pot !== potTitle);
      currentBoard.totalFee -= potAmount;
    }

    if (currentBoard.potList.length === 0) {
      newSelections.splice(currentBoardIndex, 1);
    } else if (currentBoardIndex === -1) {
      newSelections.push(currentBoard);
    } else {
      newSelections[currentBoardIndex] = currentBoard;
    }

    setBoardSelections(newSelections);
  };

  const validateUserInput = () => {
    // Bay/Surf Fish Pots are entered by individual angler; all other boards by team/boat.
    if (selectedBoard === 'Bay/Surf Fish Pots') {
      if (!teamName) {
        toast.warning("Please select an angler.");
        return false;
      }
    } else {
      if (!teamName) {
        toast.warning("Please select a team.");
        return false;
      }
    }

    if (boardSelections.length === 0) {
      toast.warning("Please select at least one pot.");
      return false;
    }

    setIsValidInput(true);
    return true;
  };

  const handleFormSubmission = async () => {
    if (validateUserInput()) {
      setIsSubmitting(true);

      let apiUrl = null;
      if (import.meta.env.VITE_NODE_ENV === "staging") {
        apiUrl = import.meta.env.VITE_SERVER_URL_STAGING;
      } else if (import.meta.env.VITE_NODE_ENV === "production") {
        apiUrl = import.meta.env.VITE_SERVER_URL_PRODUCTION;
      }

      // Check for duplicate entries
      try {
        const checkDuplicateResponse = await fetch(`${apiUrl}/api/${year}/admin_add_pot_check_for_duplicate_entries`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            potYear: `pots${year}`,
            participantId: teamName,
            boardType: selectedBoard,
          }),
        });

        const duplicateData = await checkDuplicateResponse.json();

        if (duplicateData.exists) {
          toast.warning(`This ${selectedBoard === 'Bay/Surf Fish Pots' ? 'angler' : 'team'} has already been entered for the selected board.`);
          setIsSubmitting(false);
          return;
        }

        // Prepare submission data
        let formData = {
          potYear: `pots${year}`,
          name: selectedBoard === 'Bay/Surf Fish Pots' ? teamName : teamId, // Use our state values
          boardType: selectedBoard,
          boardSelections,
          timestamp: new Date().toISOString(),
        };

        const response = await fetch(`${apiUrl}/api/${year}/admin_add_pot`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          toast.success('Successfully added new pot entry! Page refreshing...');
          setIsSubmitted(true);
          delayRefresh();
        } else {
          throw new Error('Failed to submit pot entry');
        }
      } catch (error) {
        console.error('Error submitting pot entry:', error);
        toast.error('Error while saving pot entry. Please try again or contact the administrator.');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const delayRefresh = () => {
    setTimeout(() => {
      window.location.reload();
    }, 2000);
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  return (
    <Dialog open={props.status} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>
        Add {year} Pot Entry
        <IconButton onClick={props.close} style={{ float: 'right' }}>
          <CloseIcon color="primary" />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Stack spacing={2} margin={2}>
          {/* Board Selection Dropdown */}
          <InputLabel required>Select Board</InputLabel>
          <Autocomplete
            value={selectedBoard}
            onChange={handleBoardChange}
            options={boardList}
            renderInput={(params) => <TextField {...params} label="Select board" />}
            disabled={!isLoaded}
          />

          {/* Participant Selection */}
          {selectedBoard && (
            <>
              <InputLabel required>
                Select {selectedBoard === 'Bay/Surf Fish Pots' ? 'Angler' : 'Team'}
              </InputLabel>
              <Autocomplete
                value={eligibleParticipants.find(p => p.id === teamId) || null}
                onChange={handleTeamSelection}
                options={eligibleParticipants}
                getOptionLabel={(option) => option.label}
                renderInput={(params) => <TextField {...params} label={
                  selectedBoard === 'Bay/Surf Fish Pots' ? 'Angler name' : 'Team name'
                }/>}
                disabled={!isLoaded}
              />
            </>
          )}

          {/* Pot Selection */}
          {selectedBoard && config?.potsConfig?.CONFIG_POTS_BOARD_LIST.map((boardObj, boardIndex) => {
            const boardName = Object.keys(boardObj)[0];
            if (boardName !== selectedBoard) return null;

            const pots = boardObj[boardName];
            const isBoardSelected = boardSelections.find(selection => 
              selection.board === boardName
            );
            const selectedPots = isBoardSelected ? isBoardSelected.potList : [];

            return (
              <div key={boardIndex}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={selectedPots.length === pots.length}
                      indeterminate={selectedPots.length > 0 && selectedPots.length < pots.length}
                      onChange={(e) => handleBoardSelection(boardName, e.target.checked)}
                    />
                  }
                  label="Select All"
                />
                {pots.map((pot, potIndex) => (
                  <FormControlLabel
                    key={potIndex}
                    control={
                      <Checkbox
                        checked={selectedPots.includes(pot.title)}
                        onChange={(e) =>
                          handlePotSelection(boardName, pot.title, e.target.checked, pot.amount)
                        }
                      />
                    }
                    label={pot.title}
                  />
                ))}
              </div>
            );
          })}

          {/* Fee Summary */}
          {boardSelections.length > 0 && (
            <div>
              <h3>Total Fees: {formatCurrency(
                boardSelections.reduce((acc, selection) => acc + selection.totalFee, 0)
              )}</h3>
              {boardSelections.map((boardSelection, index) => (
                <div key={index}>
                  <h4>
                    {formatCurrency(boardSelection.totalFee)} in {boardSelection.board} Pots
                  </h4>
                </div>
              ))}
            </div>
          )}

          {/* Submit Button */}
          {!isSubmitted ? (
            <Button
              color="primary"
              variant="contained"
              disabled={!teamIsSelected || boardSelections.length === 0 || isSubmitting}
              onClick={handleFormSubmission}
              startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          ) : (
            <h3>Submitted!</h3>
          )}
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

export default AdminAddPotModal;

