import React from 'react';
import { Button as MuiButton } from '@mui/material';

const Button = ({ children, variant = 'contained', color = 'primary', className = '', ...props }) => {
  return (
    <MuiButton
      variant={variant}
      color={color}
      className={`capitalize font-semibold shadow-md hover:shadow-lg transition-all duration-300 ${className}`}
      {...props}
    >
      {children}
    </MuiButton>
  );
};

export default Button;
