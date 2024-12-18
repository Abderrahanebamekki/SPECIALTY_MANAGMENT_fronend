/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
const ButtonGroup = ({ buttons }) => (
  <Box
    sx={{
      display: "flex",
      width: "100%",
      justifyContent: "space-around",
    }}
  >
    {buttons.map((button, index) => (
      <Button
        key={index}
        sx={{ display: "block", ml: 1 }}
        variant="contained"
        color={button.color}
        size="large"
        onClick={button.onClick}
      >
        {button.label}
      </Button>
    ))}
  </Box>
);

export default ButtonGroup;