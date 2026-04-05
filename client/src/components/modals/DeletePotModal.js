import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Dialog, DialogContent, DialogTitle, IconButton, Stack, InputLabel, CircularProgress } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { toast } from 'react-toastify';

const DeletePotModal = (props) => {
  const { year } = useParams();
  const { potId, name, totalPotFee } = props.deleteInfo || {};
  const [boardType, setBoardType] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    if (props.editInfo?.boardSelections) {
      const boardSelections = JSON.parse(props.editInfo.boardSelections);
      setBoardType(boardSelections[0]?.board || '');  // Get board type from first selection
    }
  }, [props.editInfo]);

  // Parse boardSelections if it exists
  let parsedBoardSelections = [];
  try {
    if (props.deleteInfo?.boardSelections) {
      parsedBoardSelections = JSON.parse(props.deleteInfo.boardSelections);
    }
  } catch (e) {
    console.error('Error parsing boardSelections:', e);
  }

  const handleClose = () => {
    props.close();
    setIsSubmitting(false);
    setIsSubmitted(false);
  };

  const delayRefresh = () => {
    setTimeout(() => {
      window.location.reload();
    }, 2000);
  };

  const handleDelete = async () => {
    setIsSubmitting(true);
    let apiUrl = import.meta.env.VITE_NODE_ENV === "staging"
      ? import.meta.env.VITE_SERVER_URL_STAGING
      : import.meta.env.VITE_SERVER_URL_PRODUCTION;

    try {
      const response = await fetch(`${apiUrl}/api/${year}/admin_delete_pot`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          potId: potId, 
          potYear: props.potYear 
        }),
      });

      if (response.ok) {
        toast.success('Pot entry deleted successfully!');
        setIsSubmitted(true);
        delayRefresh();
      } else {
        throw new Error('Error deleting the pot entry.');
      }
    } catch (error) {
      toast.error('Error deleting pot entry.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
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

  return (
    <Dialog open={props.status} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>
        Delete Pot Entry
        <IconButton onClick={handleClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Stack spacing={2}>
          <InputLabel id="name-label">
            <strong>{getNameLabel(boardType)}:</strong> {name}
          </InputLabel>
                    
          <InputLabel id="total-fee-label">
            <strong>Total Fee:</strong> {formatCurrency(totalPotFee)}
          </InputLabel>

          {/* Show individual board fees */}
          {props.deleteInfo && (
            <>
              {props.deleteInfo['totalCatch&ReleaseFee'] > 0 && (
                <InputLabel>
                  Catch & Release Fee: {formatCurrency(props.deleteInfo['totalCatch&ReleaseFee'])}
                </InputLabel>
              )}
              {props.deleteInfo['totalOffshoreFee'] > 0 && (
                <InputLabel>
                  Offshore Fee: {formatCurrency(props.deleteInfo['totalOffshoreFee'])}
                </InputLabel>
              )}
              {props.deleteInfo['totalBaySurfFee'] > 0 && (
                <InputLabel>
                  Bay/Surf Fee: {formatCurrency(props.deleteInfo['totalBaySurfFee'])}
                </InputLabel>
              )}
            </>
          )}

          {/* Delete button */}
          {!isSubmitted ? (
            <Button 
              variant="contained" 
              color="primary" 
              onClick={handleDelete}
              disabled={isSubmitting}
              startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
            >
              {isSubmitting ? "Deleting..." : "Delete Pot Entry"}
            </Button>
          ) : (
            <h3>Submitted!</h3>
          )}
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

export default DeletePotModal;

