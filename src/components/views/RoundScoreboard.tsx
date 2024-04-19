import BackgroundImageLobby from "styles/views/BackgroundImageLobby";
import React, { useContext, useEffect, useState } from "react";
import { List, ListItem, Typography, Box, } from "@mui/material";
import WebSocketContext from "../../contexts/WebSocketContext";
import { Message } from "@stomp/stompjs";
import { useNavigate, useParams } from "react-router-dom";

interface Player {
  username: string;
  currentScore: number;
}
const RoundScoreboard = () => {
  const { lobbyId } = useParams();
  const [players, setPlayers] = useState<Player[]>([]);
  const navigate = useNavigate();
  const [hasReceivedInitialState, setHasReceivedInitialState] = useState(false);

  /** Consuming Websocket Context
   * Context provides functions: connect, disconnect, subscribeClient, unsubscribeClient **/
  const { connect, disconnect, send, subscribeClient, unsubscribeClient } = useContext(WebSocketContext);
  /** On component Mount/Unmount**/
  /*useEffect(() => {
    connect(lobbyId).then(() => {
      // Subscribe to playerlist update and sort players by score in descending order
      subscribeClient(
        `/topic/lobbies/${lobbyId}/players`,
        (message: Message) => {
          console.log(`Received Playerlist update: ${message.body}`)
          const receivedPlayers = JSON.parse(message.body);
          setPlayers(receivedPlayers);
        },
      );
      if (lobbyId) {
        subscribeClient(
          `/topic/games/${lobbyId}/state`,
          (message: Message) => {
            console.log(`Received GameState update: ${message.body}`);
            const receivedGameState = JSON.parse(message.body);
            if (receivedGameState.gamePhase === "INPUT") {
              // Redirect to Input page/component
              navigate(`/lobbies/${lobbyId}/input`);
            }
          }
        )
      }
    });

    return () => {
      unsubscribeClient(`/topic/games/${lobbyId}/state`);
      unsubscribeClient(`/topic/lobbies/${lobbyId}/players`);
      disconnect();
    }
  }, []);*/

  useEffect(() => {
    console.log(`lobbyId: ${lobbyId}`);
    connect(lobbyId).then(() => {
      console.log("Connected to WebSocket");
      // Request another state update
      send(`/app/games/${lobbyId}/state`, {});
      // Subscribe to game state updates
      if (lobbyId) {
        subscribeClient(
          `/topic/games/${lobbyId}/state`,
          (message: Message) => {
            console.log(`Received GameState update: ${message.body}`);
            const receivedGameState = JSON.parse(message.body);
            console.log(receivedGameState);
            console.log(`Game phase: ${receivedGameState.gamePhase}`);
            // Update the players state with the players from the received game state
            console.log("receivedGameState.players:", receivedGameState.players);
            // Map each PlayerGetDTO to a Player object
            const receivedPlayers = receivedGameState.players.map((playerDTO: any) => ({
              username: playerDTO.username,
              currentScore: playerDTO.currentScore,
            }));
            setPlayers(receivedPlayers);
            console.log(players);
            console.log(receivedPlayers);
            if (receivedGameState.gamePhase === "INPUT") {
              // Redirect to Input page/component
              navigate(`/lobbies/${lobbyId}/input`);
              //setHasReceivedInitialState(true);
            }
          }
        )
      }
    });

    return () => {
      unsubscribeClient(`/topic/games/${lobbyId}/state`);
      disconnect();
    }
  }, []);
console.log(players);

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
                <Typography variant="body1">Score: {player.currentScore}</Typography>
              </Box>
            </ListItem>
          ))}
        </List>
      </Box>
  </BackgroundImageLobby>
);
};

export default RoundScoreboard;