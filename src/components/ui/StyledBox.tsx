import { Box, BoxProps } from "@mui/material";
import React from "react";

interface StyledBoxProps extends BoxProps {
    children?: React.ReactNode;
}

const StyledBox: React.FC<StyledBoxProps> = ({ children, sx, ...props }) => {
    return (
      <Box
        sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "20px",
            backgroundColor: "rgba(224, 224, 224, 0.9)",
            borderColor: "black",
            borderWidth: "2px",
            borderStyle: "solid",
            borderRadius: "27px",
            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
            width: "90%",
            height: "5%",
            margin: "auto",
            position: "relative",
            top: 30,
            marginBottom: "30px",
            ...sx,
        }}
        {...props}
      >
          {children}
      </Box>
    );
};

export default StyledBox;