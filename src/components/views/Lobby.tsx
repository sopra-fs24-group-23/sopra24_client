import BackgroundImageLobby from "styles/views/BackgroundImageLobby";
import React, { useState } from "react";
import { Spinner } from "../ui/Spinner";
import CustomButton from "components/ui/CustomButton";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Typography, List, ListItem } from "@mui/material";

const Lobby = () => {
  const { lobbyId } = useParams();
  const [players, setPlayers] = useState([]);
  const [lobbyDetails, setLobbyDetails] = useState(null);
  const navigate = useNavigate();

  const goToEditSettings = () => {
    navigate("/editSettings");
  };


  let content = <Spinner />;

  return (
    <BackgroundImageLobby>
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