import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Box  from '@mui/material/Box';
import { Typography } from '@mui/material';

export default function DeleteAlert({handleDelete, deleteCommand, children, friendName}) {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleAgree = () =>{
    handleDelete();
    setOpen(false);
  }
  return (
    <Box>
      <Box   onClick={handleClickOpen}>
       {children}
      </Box>
      <Dialog
        open={open}
        onClose={handleClose}
      
      >
        <DialogTitle >
          {deleteCommand ==="comment"&& "Are you sure you want to delete this comment?"}
          {deleteCommand ==="post"&& "Are you sure you want to delete this post?"}
          {deleteCommand ==="reply"&& "Are you sure you want to delete this reply?"}
          {deleteCommand ==="unfriend"&& `Are you sure you want to unfriend ${friendName}?`}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
          {deleteCommand ==="comment"&& "You can't restore deleted comments."}
          {deleteCommand ==="post"&& "You can't restore deleted posts."}
          {deleteCommand ==="reply"&& "You can't restore deleted replies."}
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{display:"flex", justifyContent:"space-between"}} >
          <Button  variant='contained' onClick={handleClose} autoFocus><Typography fontSize={15}>Nevermind</Typography></Button>
          <Button  variant='contained' onClick={handleAgree} color='error'>
            <Typography fontSize={15}>Yes I'm Sure</Typography> 
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}