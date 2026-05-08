import React from 'react';
import { TextField } from '@mui/material';

const Input = ({ label, variant = 'outlined', fullWidth = true, className = '', ...props }) => {
  return (
    <TextField
      label={label}
      variant={variant}
      fullWidth={fullWidth}
      className={`bg-white rounded-lg ${className}`}
      sx={{
        '& .MuiOutlinedInput-root': {
          '& fieldset': {
            borderColor: '#e2e8f0',
          },
          '&:hover fieldset': {
            borderColor: '#3b82f6',
          },
          '&.Mui-focused fieldset': {
            borderColor: '#3b82f6',
          },
        },
      }}
      {...props}
    />
  );
};

export default Input;
