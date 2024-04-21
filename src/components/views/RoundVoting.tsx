import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Typography, List, ListItem, Box } from "@mui/material";
import BackgroundImageLobby from "styles/views/BackgroundImageLobby";
import WebSocketContext from "../../contexts/WebSocketContext";
import { Message } from "@stomp/stompjs";

const RoundVoting = () => {
  const { lobbyId } = useParams();
  const navigate = useNavigate();
  const [playersAnswers, setPlayersAnswers] = useState([]);
  const { connect, disconnect, send, subscribeClient, unsubscribeClient } = useContext(WebSocketContext);
  const [gameSettings, setGameSettings] = useState(null);

  useEffect(() => {
    connect(lobbyId).then(() => {
      // Subscribe to the game states updates
      subscribeClient(
        `/topic/games/${lobbyId}/state`,
        (message: Message) => {
          console.log(`Received GameState update: ${message.body}`);
          const receivedGameState = JSON.parse(message.body);
          setPlayersAnswers(receivedGameState.players.map((player: any) => player.currentAnswers));
          setGameSettings(receivedGameState.gameSettings);
      }
      );
    });

    return () => {
      unsubscribeClient(`/topic/games/${lobbyId}/state`);
      disconnect();
    };
  }, [lobbyId]);

  // Render the players and their answers
  const renderPlayerAnswers = (player) => {
    return (
      <Box key={player.username} sx={{
        backgroundColor: "#e0e0e0",
        borderRadius: "10px",
        padding: "10px",
        margin: "10px 0",
        boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)"
      }}>
        <Typography variant="h6">{player.username}</Typography>
        {/* Iterate over the player's answers */}
        {player.answers.map((answer, index) => (
          <Box key={index} sx={{ display: "flex", justifyContent: "space-between", margin: "5px 0" }}>
            <Typography>{answer.category}</Typography>
            <Typography>{answer.value}</Typography>
          </Box>
        ))}
      </Box>
    );
  };

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
            Vote for wrong answers!
        </Typography>
        {/* Iterate over all players to render their answers */}
        {playersAnswers.map((player) => renderPlayerAnswers(player))}
      </Box>
    </BackgroundImageLobby>
  );
};

export default RoundVoting;