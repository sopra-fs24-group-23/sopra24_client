import React from "react";
import BaseContainer from "components/ui/BaseContainer";
import { useNavigate } from "react-router-dom";
//import { Button } from "components/ui/Button";
import Button from "@mui/material/Button";
import CustomButton from "components/ui/CustomButton";
import HomepageBackgroundImage from "styles/views/HomepageBackgroundImage";
import { Box, Typography, List, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";

const Instructions = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      navigate(`/homepage/${userId}`);
    } else {
      console.error("User ID not found.");
      navigate("/login");
    }
  }

  return (
    <HomepageBackgroundImage>
      <Box sx={{
        display: "flex",
        position: "absolute",
        top: "2%",
        left: "85%",
      }}>
        <CustomButton
          onClick={handleBack}
          sx={{
            backgroundColor: "#e0e0e0",
          }}
        >
          Back
        </CustomButton>
      </Box>
      {/* Outer box */}
      <Box sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "rgba(224, 224, 224, 0.9)", // Semi-transparent grey
        borderColor: "black",
        borderWidth: "2px",
        borderStyle: "solid",
        padding: "20px",
        borderRadius: "27px",
        boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
        width: "35%",
        maxWidth: "500px",
        height: "77%",
        margin: "auto",
        position: "relative",
        paddingTop: "30px",
        paddingBottom: "10px",
      }}>
        <Typography variant="h4" gutterBottom
          sx={{
            fontFamily: "Londrina Solid",
            textAlign: "center",
          }}>
          Instructions
        </Typography>
        <Typography variant="h5" gutterBottom
          sx={{
            fontFamily: "Londrina Solid",
            textAlign: "center",
          }}>
          This is how you play the game.
        </Typography>
      </Box>
    </HomepageBackgroundImage>
  );
};

export default Instructions;