/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
const SearchBox = ({ label, value, onChange, placeholder }) => (
  <Box sx={{ mx: 4, my: 2, display: 'flex', alignItems: 'center' }}>
    <TextField
      label={label}
      variant="outlined"
      fullWidth
      value={value}
      onChange={onChange}
      placeholder={placeholder}
    />
  </Box>
);

export default SearchBox;