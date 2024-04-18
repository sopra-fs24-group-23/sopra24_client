import BackgroundImageLobby from "styles/views/BackgroundImageLobby";
import React, { useContext, useEffect, useState } from "react";
import { List, ListItem, Typography, Box, } from "@mui/material";
import WebSocketContext from "../../contexts/WebSocketContext";
import { Message } from "@stomp/stompjs";
import { useParams } from "react-router-dom";

interface Player {
  username: string;
  score: number;
}
const RoundScoreboard = () => {
  const { connect, disconnect, subscribeClient, unsubscribeClient } = useContext(WebSocketContext);
  const { lobbyId } = useParams();
  const [players, setPlayers] = useState<Player[]>([]);

  // Subscribe to playerlist update and sort players by score in descending order
  /*useEffect(() => {
    connect(lobbyId).then(() => {
      subscribeClient(`/topic/games/${lobbyId}/state`,
        (message: Message) => {
        console.log(`Received GameState update: ${message.body}`);
        const receivedGameState = JSON.parse(message.body);
        const sortedPlayers = [...receivedGameState.players].sort((a, b) => b.score - a.score);
        setPlayers(sortedPlayers);
        },
    );
    });
    return () => {
      unsubscribeClient(`/topic/games/${lobbyId}/state`);
      disconnect();
    }
  }, []); */

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
          Scoreboard
        </Typography>
        <List sx={{ width: "100%" }}>
          {players.map((player, index) => (
            <ListItem key={index} sx={{ padding: "10px", borderBottom: "1px solid #ccc", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1, justifyContent: 'space-between' }}>
                {index + 1}. {player.username}
                <Typography variant="body1">Score: {player.score}</Typography>
              </Box>
            </ListItem>
          ))}
        </List>
      </Box>
  </BackgroundImageLobby>
);
};

export default RoundScoreboard;