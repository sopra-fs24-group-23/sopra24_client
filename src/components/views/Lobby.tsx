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


  let content = <Spinner />;

  return (
    <BackgroundImageLobby>
      <Box sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#e0e0e0", // Grey
        padding: "20px",
        borderRadius: "10px",
        boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
        width: "80%",
        maxWidth: "500px",
        height: "60%",
      }}>
        <Typography variant="h4" gutterBottom sx={{ fontFamily: "Londrina Solid"}}>
          Players
        </Typography>
        <List sx={{
          width: "100%",
        }}>
        </List>
      </Box>
    </BackgroundImageLobby>
  );
};

export default Lobby;