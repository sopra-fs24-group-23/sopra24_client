import BackgroundImageLobby from "styles/views/BackgroundImageLobby";
import React, { useContext, useEffect, useState } from "react";
import { List, ListItem, Typography, Box, } from "@mui/material";
import WebSocketContext from "../../contexts/WebSocketContext";
import { Message } from "@stomp/stompjs";
import { useNavigate, useParams } from "react-router-dom";
// TO-DO: not work with localStorage but Context
interface Player {
  username: string;
  currentScore: number;
}
const RoundScoreboard = () => {
  const { lobbyId } = useParams();
  const [players, setPlayers] = useState<Player[]>([]);
  const navigate = useNavigate();
  const [hasReceivedInitialState, setHasReceivedInitialState] = useState(false);
  const [currentRoundNumber, setCurrentRoundNumber] = useState(0);
  const [maxRoundNumber, setMaxRoundNumber] = useState(0);

  /** Consuming Websocket Context
   * Context provides functions: connect, disconnect, subscribeClient, unsubscribeClient **/
  const { connect, disconnect, send, subscribeClient, unsubscribeClient } = useContext(WebSocketContext);
  /** On component Mount/Unmount**/

  useEffect(() => {
    const currentState = localStorage.getItem("gameState");
    if (currentState) {
      const parsedState = JSON.parse(currentState);
      console.log(parsedState);
      const players = parsedState.players.map((player: any) => ({
        username: player.username,
        currentScore: player.currentScore,
      }));
      setPlayers(players);
    }
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
            setCurrentRoundNumber(receivedGameState.currentRoundNumber);

            if (receivedGameState.gamePhase === "INPUT") {
              localStorage.setItem("gameState", JSON.stringify(receivedGameState));
              // Redirect to Input page/component
              navigate(`/lobbies/${lobbyId}/input`);
              //setHasReceivedInitialState(true);
            }
          }
        )
        // TO-DO: Work with Context to receive GameSettings here
        // Subscribe to the game settings to get MaxRoundNumber
        subscribeClient(
          `/topic/games/${lobbyId}/settings`,
          (message: Message) => {
            console.log(`Received GameSettings update: ${message.body}`);
            const receivedGameSettings = JSON.parse(message.body);
            console.log("Before setting max round number");
            setMaxRoundNumber(receivedGameSettings.maxRounds);
            console.log(`MaxRoundNumber: ${receivedGameSettings.maxRounds}`);
          })
      }
    });

    return () => {
      unsubscribeClient(`/topic/games/${lobbyId}/state`);
      unsubscribeClient(`/topic/games/${lobbyId}/settings`);
      disconnect();
    }
  }, []);

  // Sort players by score
  const sortedPlayers = players.sort((a, b) => b.currentScore - a.currentScore);

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
          {/* Is it the final round? If so display 'Final Scoreboard' */}
          {currentRoundNumber === maxRoundNumber ? "Final Scoreboard" : "Scoreboard"}
        </Typography>
        {currentRoundNumber === maxRoundNumber && sortedPlayers[0] && (
          <Typography variant="h5" gutterBottom sx={{
            fontFamily: "Londrina Solid",
            textAlign: "center",}}>
            Winner: {sortedPlayers[0].username}
          </Typography>
        )}
        <List sx={{ width: "100%" }}>
          {players.map((player, index) => (
            <ListItem key={index} sx={{ padding: "10px", borderBottom: "1px solid #ccc", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1, justifyContent: "space-between" }}>
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