import React, { ReactNode } from 'react';
import Button from '@mui/material/Button';

interface CustomButtonProps {
  disabled?: boolean;
  sx?: object;
  onClick?: () => void;
  children?: ReactNode; // Ensure children is accepted
}

const CustomButton: React.FC<CustomButtonProps> = ({ children, disabled, sx, onClick }) => {
  return (
    <Button
      sx={{
        backgroundColor: '#white', // button color
        color: '#black', // text color
        fontSize: '16px',
        fontWeight: 'bold',
        textTransform: 'uppercase',
        boxShadow: '0px 3px 1px -2px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12)', // This is the Material-UI default, adjust to match your mockup
        borderRadius: '20px',
        padding: '6px 16px', // Adjust padding as needed
        '&:hover': {
          backgroundColor: '#lightgray', // Replace with the color for hover state
          // more styling for hover state here
        },
        // more styling to match mockup
      }}
      disabled={disabled}
      onClick={onClick}
      variant="contained"
      >
      {children}
    </Button>
  );
};

export default CustomButton;