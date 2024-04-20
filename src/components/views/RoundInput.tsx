import BackgroundImageLobby from "styles/views/BackgroundImageLobby";
import React, { useContext, useEffect, useState } from "react";
import { List, ListItem, Typography, Box, } from "@mui/material";
import WebSocketContext from "../../contexts/WebSocketContext";
import { Message } from "@stomp/stompjs";
import { useNavigate, useParams } from "react-router-dom";
import CustomButton from "components/ui/CustomButton";

const RoundInput = () => {
  const { lobbyId } = useParams();
  const navigate = useNavigate();
  const [hasReceivedInitialState, setHasReceivedInitialState] = useState(false);

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
          Write words that start with LETTER
        </Typography>
        <CustomButton>
            Done
        </CustomButton>
      </Box>
  </BackgroundImageLobby>
);
}

export default RoundInput;