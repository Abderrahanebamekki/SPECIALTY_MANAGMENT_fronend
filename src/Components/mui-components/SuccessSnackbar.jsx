/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

const SuccessSnackbar = ({ open, onClose, message }) => (
  <Snackbar open={open} autoHideDuration={3000} onClose={onClose}>
    <Alert severity="success" onClose={onClose}>
      {message}
    </Alert>
  </Snackbar>
);

export {SuccessSnackbar };