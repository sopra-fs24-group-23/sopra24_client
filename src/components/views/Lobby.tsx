import BackgroundImageLobby from "styles/views/BackgroundImageLobby";
import React, { useState } from "react";
import { Spinner } from "../ui/Spinner";
import CustomButton from "components/ui/CustomButton";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Typography, List, ListItem, Dialog, DialogActions, DialogContent, DialogTitle, DialogContentText } from "@mui/material";

const Lobby = () => {
  const { lobbyId } = useParams();
  const [players, setPlayers] = useState([]);
  const [lobbyDetails, setLobbyDetails] = useState(null);
  const navigate = useNavigate();
  const [openLeaveDialog, setOpenLeaveDialog] = useState(false);

  const handleOpenDialog = () => {
    setOpenLeaveDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenLeaveDialog(false);
  };

  const handleLeaveGame = () => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      navigate(`/homepage/${userId}`);
    } else {
      console.error("User ID not found.");
      navigate("/login");
    }
  }

  let content = <Spinner />;


  return (
    <BackgroundImageLobby>
      <Box sx={{
        display: "flex",
        position: "absolute",
        top: "2%",
        left: "85%",
      }}>
        <CustomButton
          onClick={handleOpenDialog}
          sx={{
            backgroundColor: "#e0e0e0",
            "&:hover": {
              backgroundColor: "red",
            },
          }}
        >
          Leave Game
        </CustomButton>
        <Dialog open={openLeaveDialog} onClose={handleCloseDialog}>
          <DialogTitle>Leave the lobby?</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to leave the lobby?
              You will be returned to your profile page but you can still return as long as the
              game hasn&apos;t started yet. If the host leaves the lobby,
              the lobby will be closed for all players.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <CustomButton onClick={handleLeaveGame}>Leave</CustomButton>
            <CustomButton onClick={handleCloseDialog}>Stay</CustomButton>
          </DialogActions>
        </Dialog>
      </Box>
      {/* Outer box */}
      <Box sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#e0e0e0", // Grey
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
      }}>
        {/*
        <CustomButton onClick={() => navigate(`/lobbies/${response.data.id}`)}>
            Instructions
    </CustomButton> */}
        {/* Inner box for player list*/}
        <Box sx={{
          backgroundColor: "#e0e0e0",
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
          top: "-8%",
        }}>
          <Typography variant="h4" gutterBottom
            sx={{
              fontFamily: "Londrina Solid",
              textAlign: "center",
            }}>
            Players
          </Typography>
          <List sx={{
            width: "100%",
          }}>
          </List>
        </Box>
      </Box>
    </BackgroundImageLobby>
  );
};

export default Lobby;