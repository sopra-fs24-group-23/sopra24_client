import BackgroundImageLobby from "../../styles/views/BackgroundImageLobby";
import { Box, Typography } from "@mui/material";
import React from "react";

const VotingResults = () => {
  return (
    <BackgroundImageLobby>
      <Box sx={{
        backgroundColor: "rgba(224, 224, 224, 0.9)",
        borderColor: "black",
        borderWidth: "2px",
        borderStyle: "solid",
        width: "60%",
        height: "60%",
        margin: "auto",
        padding: "20px",
        borderRadius: "10px",
        boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
        position: "relative",
        top: "10px",
      }}>
        <Typography variant="h4" gutterBottom sx={{
          fontFamily: "Londrina Solid",
          textAlign: "center",
        }}>
          Voting Results!
        </Typography>
      </Box>
    </BackgroundImageLobby>
  );
}

export default VotingResults;