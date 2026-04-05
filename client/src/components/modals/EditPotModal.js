import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { InputLabel, Button, Dialog, DialogContent, DialogTitle, IconButton, Stack, FormControlLabel, Checkbox, CircularProgress } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { toast } from 'react-toastify';
import { loadConfigForYear } from '../../config/masterConfig';

const EditPotModal = (props) => {
  const { year } = useParams();
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [name, setName] = useState();
  const [boardType, setBoardType] = useState('');
  const [boardSelections, setBoardSelections] = useState([]);
  const [config, setConfig] = useState(null);

  useEffect(() => {
    const loadConfigs = async () => {
      const loadedConfig = await loadConfigForYear(year);
      if (loadedConfig) {
        setConfig(loadedConfig);
      }
    };

    loadConfigs();
  }, [year]);

  useEffect(() => {
    if (props.editInfo) {
      let parsedSelections = [];
      try {
        if (props.editInfo.boardSelections) {
          parsedSelections = JSON.parse(props.editInfo.boardSelections);
          setBoardType(parsedSelections[0]?.board || '');
        }
      } catch (e) {
        console.error('Error parsing boardSelections:', e);
      }
  
      setName(props.editInfo.name);
      setBoardSelections(parsedSelections);
      setIsLoaded(true);
    }
  }, [props.editInfo]);

  const handleClose = () => {
    setIsSubmitting(false);
    setIsSubmitted(false);
    props.close();
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

  const validateUserInput = () => {
    const totalFee = boardSelections.reduce((acc, selection) => 
      acc + (selection.totalFee || 0), 0
    );
    
    if (totalFee === 0) {
      toast.warning("Please select at least one pot.");
      return false;
    }
    return true;
  };

  const handleFormSubmission = async () => {
    if (validateUserInput()) {
      setIsSubmitting(true);
      setIsSubmitted(true);
  
      let apiUrl = import.meta.env.VITE_NODE_ENV === "staging"
        ? import.meta.env.VITE_SERVER_URL_STAGING
        : import.meta.env.VITE_SERVER_URL_PRODUCTION;
  
      // Only send the active board selections
      const activeSelections = boardSelections.filter(selection => {
        let boardFeeKey;
        switch(selection.board) {
          case 'Catch & Release':
            boardFeeKey = 'totalCatch&ReleaseFee';
            break;
          case 'Offshore':
            boardFeeKey = 'totalOffshoreFee';
            break;
          case 'Bay/Surf':
            boardFeeKey = 'totalBaySurfFee';
            break;
        }
        return props.editInfo[boardFeeKey] > 0;
      });
  
      const formData = {
        potId: props.editInfo.potId,
        potYear: props.potYear,
        name: name,
        boardSelections: activeSelections
      };
  
      try {
        const response = await fetch(`${apiUrl}/api/${year}/admin_edit_pot`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
  
        if (response.ok) {
          toast.success('Pot entry updated successfully!');
          delayRefresh();
        } else {
          throw new Error('Error updating the pot entry.');
        }
      } catch (error) {
        toast.error('Error while attempting to save pot entry to the database.');
        setIsSubmitted(false);
        setIsSubmitting(false);
      }
    } else {
      console.log('Input was not valid or there was an error');
      setIsSubmitting(false);
    }
  };

  const handleBoardSelection = (boardName, isSelected) => {
    const newSelections = [...boardSelections];
    const pots = config.potsConfig.CONFIG_POTS_BOARD_LIST.find(board => 
      board[boardName]
    )[boardName];
    const totalFee = pots.reduce((acc, pot) => acc + pot.amount, 0);

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

      if (currentBoard.potList.length === 0) {
        newSelections.splice(currentBoardIndex, 1);
      }
    }

    if (currentBoard.potList.length > 0 && currentBoardIndex === -1) {
      newSelections.push(currentBoard);
    } else if (currentBoard.potList.length > 0) {
      newSelections[currentBoardIndex] = currentBoard;
    }

    setBoardSelections(newSelections);
  };

  const isActiveBoard = (boardName) => {
    let feeKey;
    switch(boardName) {
      case 'Catch & Release':
        feeKey = 'totalCatch&ReleaseFee';
        break;
      case 'Offshore':
        feeKey = 'totalOffshoreFee';
        break;
      case 'Bay/Surf':
        feeKey = 'totalBaySurfFee';
        break;
    }
    return props.editInfo && props.editInfo[feeKey] > 0;
  };

  const getNameLabel = (boardType) => {
    switch(boardType) {
      case 'Catch & Release':
      case 'Offshore':
        return 'Team Name';
      case 'Bay/Surf':
        return 'Angler Name';
      default:
        return 'Name';
    }
  };

  if (!config) {
    return <CircularProgress />;
  }

  return (
    <Dialog open={props.status} onClose={handleClose} fullWidth maxWidth="sm">
      <form onSubmit={(e) => e.preventDefault()}>
        <DialogTitle>
          Edit Pot Entry
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2}>
            <InputLabel id="name-label">
              <strong>{getNameLabel(boardType)}:</strong> {name}
            </InputLabel>

            {/* Select pots */}
            {config.potsConfig.CONFIG_POTS_BOARD_LIST.map((boardObj, boardIndex) => {
              const boardName = Object.keys(boardObj)[0];
              
              // Only show boards that were originally active
              if (!isActiveBoard(boardName)) return null;
              
              const pots = boardObj[boardName];
              const isBoardSelected = boardSelections.find(selection => 
                selection.board === boardName
              );
              const selectedPots = isBoardSelected ? isBoardSelected.potList : [];

              return (
                <div key={boardIndex}>
                  <InputLabel>{boardName} Pots</InputLabel>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={selectedPots.length === pots.length}
                        indeterminate={selectedPots.length > 0 && 
                          selectedPots.length < pots.length}
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
                      label={`${pot.title}`}
                    />
                  ))}
                </div>
              );
            })}

            {/* Tally fees */}
            <div>
              <h3>Total Fees: {formatCurrency(boardSelections.reduce((acc, selection) => 
                acc + selection.totalFee, 0))}
              </h3>
              {boardSelections.map((boardSelection, index) => (
                <div key={index}>
                  {boardSelection.totalFee > 0 && 
                    <h4>{formatCurrency(boardSelection.totalFee)} in {boardSelection.board} Pots</h4>
                  }
                </div>
              ))}
            </div>
            
            {!isSubmitted ? (
              <Button
                variant="contained"
                color="primary"
                onClick={handleFormSubmission}
                disabled={isSubmitting || boardSelections.reduce((acc, selection) => 
                  acc + selection.totalFee, 0
                ) === 0}
                startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
              >
                {isSubmitting ? "Submitting..." : "Update Pot Entry"}
              </Button>
            ) : (
              <h3>Submitted!</h3>
            )}

          </Stack>
        </DialogContent>
      </form>
    </Dialog>
  );
};

export default EditPotModal;

