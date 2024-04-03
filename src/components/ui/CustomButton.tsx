import React, { ReactNode } from "react";
import Button from "@mui/material/Button";

interface CustomButtonProps {
  disabled?: boolean;
  sx?: object;
  onClick?: () => void;
  children?: ReactNode; // Ensure children is accepted
}

const CustomButton: React.FC<CustomButtonProps> = ({ children, disabled, sx, onClick }) => {
  // Combine default styles with the styles passed through the sx prop
  const combinedStyles = {
    fontFamily: "Londrina Solid",
    backgroundColor: "#f8f8f8", // button color
    color: "black", // text color
    borderColor: "black",
    borderWidth: "1px",
    borderStyle: "solid",
    fontSize: "16px",
    fontWeight: "bold",
    textTransform: "uppercase",
    boxShadow: "0px 4px 3px -2px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12)", // This is the Material-UI default, adjust to match mockup
    //boxShadow: '2px 2px 10px rgba(0,0,0,0.1)',
    borderRadius: "20px",
    padding: "6px 16px", // Adjust padding as needed
    "&:hover": {
      backgroundColor: "lightgray", // Replace with the color for hover state
      //boxShadow: '2px 2px 10px rgba(0,0,0,0.2)',
      transform: "translateY(-1px)", // Moves the button up by 3 pixels
      boxShadow: "0px 5px 5px rgba(0,0,0,0.2)"
      // more styling for hover state here
    },
    ...sx, // Override the default styles with the ones passed as props
  };
  
  return (
    <Button
      sx={combinedStyles}
      disabled={disabled}
      onClick={onClick}
      variant="contained"
    >
      {children}
    </Button>
  );
};

export default CustomButton;