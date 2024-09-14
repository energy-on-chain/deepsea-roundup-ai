import React, { useState, useEffect } from 'react';
import { InputLabel, Button, Dialog, DialogContent, DialogTitle, IconButton, Stack, TextField, CircularProgress, FormControlLabel, Checkbox } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { toast } from 'react-toastify';

import { 
  CONFIG_POTS_BOARD_LIST,
} from '../../config/potsConfig';

const EditPotModal = (props) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [teamId, setTeamId] = useState();
  const [teamName, setTeamName] = useState();
  const [boardSelections, setBoardSelections] = useState([]);

  useEffect(() => {
    console.log("In EditPotModal...");
    if (props.editInfo) {
      console.log(props.editInfo);
      setTeamId(props.editInfo.teamId);
      setTeamName(props.editInfo.teamName);
      setBoardSelections(props.editInfo.boardSelections || []);
      setIsLoaded(true);
    }
  }, [props.editInfo]);

  const handleClose = () => {
    props.close();
  }

  const delayRefresh = () => {
    setTimeout(() => {
      window.location.reload();
    }, 2000);
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  const validateUserInput = () => {

    const hasValidSelections = boardSelections.some(selection => selection.potList && selection.potList.length > 0);
    if (!hasValidSelections) {
      toast.warning("Please select at least one pot.");
      return false;
    }

    return true;
  };

  const handleFormSubmission = async () => {
    if (validateUserInput()) {
      let apiUrl = process.env.REACT_APP_NODE_ENV === "staging"
        ? process.env.REACT_APP_SERVER_URL_STAGING
        : process.env.REACT_APP_SERVER_URL_PRODUCTION;

      let formData = {
        potId: props.editInfo.potId,
        potYear: props.potYear,  
      };

      // Add board selections
      const allBoardSelections = CONFIG_POTS_BOARD_LIST.map((boardObj) => {
        const boardName = Object.keys(boardObj)[0];
        const selectedBoard = boardSelections.find(selection => selection.board === boardName);
  
        // If the board is selected, keep its data, otherwise add it with empty potList and totalFee 0
        return selectedBoard || {
          board: boardName,
          potList: [],
          totalFee: 0,
        };
      });
      formData["boardSelections"] = allBoardSelections;
  
      // Add total fees for each board
      allBoardSelections.forEach((selection) => {
        const boardFeeKey = `total${selection.board.replace(/ /g, '')}Fee`;
        formData[boardFeeKey] = selection.totalFee;
      });

      try {
        const response = await fetch(`${apiUrl}/api/admin_edit_pot`, {
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
        toast.error('Error updating pot entry.');
      }
    }
  };

  const handleBoardSelection = (boardName, isSelected) => {
    const newSelections = [...boardSelections];
    const pots = CONFIG_POTS_BOARD_LIST.find(board => board[boardName])[boardName];
    const totalFee = pots.reduce((acc, pot) => acc + pot.amount, 0);
  
    const currentBoardIndex = newSelections.findIndex(selection => selection.board === boardName);
  
    if (isSelected) {
      // If the board isn't selected yet, add all pots for the board
      if (currentBoardIndex === -1) {
        newSelections.push({
          board: boardName,
          potList: pots.map(pot => pot.title),
          totalFee,
        });
      } else {
        // If the board is partially selected, add the remaining pots
        const currentBoard = newSelections[currentBoardIndex];
        currentBoard.potList = pots.map(pot => pot.title); // Select all pots
        currentBoard.totalFee = totalFee;
        newSelections[currentBoardIndex] = currentBoard;
      }
    } else {
      // Unselect all pots for this board
      newSelections.splice(currentBoardIndex, 1);
    }
  
    setBoardSelections(newSelections);
  };
  
  const handlePotSelection = (boardName, potTitle, isSelected, potAmount) => {
    const newSelections = [...boardSelections];
    const currentBoardIndex = newSelections.findIndex(selection => selection.board === boardName);
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
  
      // If all pots are unselected, remove the board from the selections
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


  return (
    <Dialog open={props.status} onClose={handleClose} fullWidth maxWidth="sm">
      <form onSubmit={(e) => e.preventDefault()}>
        <DialogTitle>Edit Team Pot Info<IconButton onClick={handleClose}><CloseIcon /></IconButton></DialogTitle>
        <DialogContent>
          <Stack spacing={2}>

            <InputLabel id="team-id-label"><strong>Team ID:</strong>  {teamId}</InputLabel>
            <InputLabel id="team-name-label"><strong>Team Name:</strong>  {teamName}</InputLabel>

            {/* Select pots */}
            {CONFIG_POTS_BOARD_LIST.map((boardObj, boardIndex) => {
              const boardName = Object.keys(boardObj)[0];
              const pots = boardObj[boardName];
              const isBoardSelected = boardSelections.find(selection => selection.board === boardName);
              const selectedPots = isBoardSelected ? isBoardSelected.potList : [];

              return (
                <div key={boardIndex}>
                  <InputLabel>{boardName} Pots</InputLabel>
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
                      label={`${pot.title}`}
                    />
                  ))}
                </div>
              );
            })}

            {/* Tally fee(s) */}
            <div>
              <h3>Total Fees: {formatCurrency(boardSelections.reduce((acc, selection) => acc + selection.totalFee, 0))}</h3>
              {boardSelections.map((boardSelection, index) => (
                <div key={index}>
                  {boardSelection.totalFee > 0 && 
                    <h4>{formatCurrency(boardSelection.totalFee)} in {boardSelection.board} Pots</h4>
                  }
                </div>
              ))}
            </div>
            
            <Button variant="contained" color="primary" onClick={handleFormSubmission}>Update Pot Info</Button>
          </Stack>
        </DialogContent>
      </form>
    </Dialog>
  );
};

export default EditPotModal;

