import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Typography, List, ListItem, Box } from "@mui/material";
import BackgroundImageLobby from "styles/views/BackgroundImageLobby";
import WebSocketContext from "../../contexts/WebSocketContext";
import GameSettingsContext from "../../contexts/GameSettingsContext";
import { Message } from "@stomp/stompjs";
import GameStateContext from "../../contexts/GameStateContext";

const RoundVoting = () => {
  const { lobbyId } = useParams();
  const navigate = useNavigate();
  const [playersAnswers, setPlayersAnswers] = useState([]);
  const { connect, disconnect, send, subscribeClient, unsubscribeClient } = useContext(WebSocketContext);
  //const { gameSettings, setGameSettings } = useContext(GameSettingsContext);
  const { setGameSettingsVariable, gameSettings } = useContext(GameSettingsContext);
  const { gameState, setGameStateVariable } = useContext(GameStateContext);

  /*if (!gameSettings) {
    return <div>Loading...</div>; // or some other placeholder component
  } */

  useEffect(() => {
    console.log(lobbyId);
    //connect(lobbyId).then(() => {
      console.log("Test");
      // Request the current game settings when the component mounts
      send(`/app/games/${lobbyId}/settings`, {});
      // Subscribe to the game settings updates
      subscribeClient(
        `/topic/games/${lobbyId}/settings`,
        (message: Message) => {
          console.log(`Received GameSettings update: ${message.body}`);
          const receivedGameSettings = JSON.parse(message.body);
          // Update the gameSettings state in the GameSettingsContext
          //setGameSettings(receivedGameSettings);
          // Update the gameSettings in the context
          setGameSettingsVariable(receivedGameSettings)
        }
      );
      // Subscribe to the game states updates
      subscribeClient(
        `/topic/games/${lobbyId}/state`,
        (message: Message) => {
          console.log(`Received GameState update: ${message.body}`);
          const receivedGameState = JSON.parse(message.body);
          setPlayersAnswers(receivedGameState.players.map((player: any) => player.currentAnswers));


          // Check if the new game phase is VOTING_RESULTS and navigate to the page
          if (receivedGameState.gamePhase === "VOTING_RESULTS") {
            navigate(`/lobbies/${lobbyId}/voting-results`);
          }
        }
      );
    //});

    return () => {
      disconnect();
    };
  }, []);

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
        {/* Iterate over the game settings (categories) */}
        {gameSettings.map((category, index) => {
          {/* Find the corresponding answer from the player's answers */
          }
          const answer = player.answers.find((answer) => answer.category === category);
          return (
            <Box key={index} sx={{ display: "flex", justifyContent: "space-between", margin: "5px 0" }}>
              <Typography>{category}</Typography>
              <Typography>{answer ? answer.value : "-"}</Typography>
            </Box>
          );
        })}
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