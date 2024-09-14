import React from 'react';
import { Button, Dialog, DialogContent, DialogTitle, IconButton, Stack, TextField, InputLabel } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { toast } from 'react-toastify';

const DeletePotModal = (props) => {
  const { potId, teamId, teamName, totalPotFee, boardSelections } = props.deleteInfo || {};
  console.log(boardSelections);

  const handleClose = () => {
    props.close();
  };

  const delayRefresh = () => {
    setTimeout(() => {
      window.location.reload();
    }, 2000);
  }

  const handleDelete = async () => {
    let apiUrl = process.env.REACT_APP_NODE_ENV === "staging"
      ? process.env.REACT_APP_SERVER_URL_STAGING
      : process.env.REACT_APP_SERVER_URL_PRODUCTION;

    try {
      const response = await fetch(`${apiUrl}/api/admin_delete_pot`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ potId: potId, potYear: props.potYear }),
      });

      if (response.ok) {
        toast.success('Pot entry deleted successfully!');
        delayRefresh();
      } else {
        throw new Error('Error deleting the pot entry.');
      }
    } catch (error) {
      toast.error('Error deleting pot entry.');
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  return (
    <Dialog open={props.status} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Delete Pot Entry<IconButton onClick={handleClose}><CloseIcon /></IconButton></DialogTitle>
      <DialogContent>
        <Stack spacing={2}>

          <InputLabel id="team-id-label"><strong>Team ID:</strong>  {teamId}</InputLabel>
          <InputLabel id="team-name-label"><strong>Team Name:</strong>  {teamName}</InputLabel>
          
          <InputLabel id="total-fee-label"><strong>Total Fee:</strong>  {formatCurrency(totalPotFee)}</InputLabel>
          {boardSelections && boardSelections.map((board, index) => (
            <div key={index}>
              <InputLabel>({board.board}: {formatCurrency(board.totalFee)})</InputLabel>
            </div>
          ))}
          
          <Button variant="contained" color="primary" onClick={handleDelete}>Delete Pot Entry</Button>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

export default DeletePotModal;

