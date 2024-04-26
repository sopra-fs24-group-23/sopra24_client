import BackgroundImageLobby from "components/ui/BackgroundImageLobby";
import React, { useContext, useEffect, useRef, useState } from "react";
import { List, ListItem, Typography, Box, } from "@mui/material";
import WebSocketContext from "../../contexts/WebSocketContext";
import { useNavigate, useParams } from "react-router-dom";
import GameStateContext from "../../contexts/GameStateContext";
import GameSettingsContext from "../../contexts/GameSettingsContext";
import Countdown from "../ui/Countdown";

interface Player {
  username: string;
  currentScore: number;
}
const RoundScoreboard = () => {
  const { lobbyId } = useParams();
  const navigate = useNavigate();
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentRoundNumber, setCurrentRoundNumber] = useState(0);
  const [maxRoundNumber, setMaxRoundNumber] = useState(0);
  const gameContinuing = useRef(false)
  let sortedPlayers = [];

  /* Context Variables */
  const { gameState } = useContext(GameStateContext);
  const { gameSettings } = useContext(GameSettingsContext);
  const { disconnect, send, unsubscribeAll } = useContext(WebSocketContext);

  /* JSX Variables*/
  let header = (
    <Typography variant="h4" gutterBottom sx={{
      fontFamily: "Londrina Solid",
      textAlign: "center",
    }}>
      Scoreboard
    </Typography>
  )

  useEffect(() => {
    if (gameState) {
      if (gameState.gamePhase) {
        if (gameState.gamePhase === "INPUT") {
          gameContinuing.current = true;
          navigate(`/lobbies/${lobbyId}/input`)
        }
      }
      if (gameState.players) {
        const players = gameState.players.map((player: any) => ({
          username: player.username,
          currentScore: player.currentScore,
        }));
        sortedPlayers = players.sort((a, b) => b.currentScore - a.currentScore);
        setPlayers(players);
      }
    }
  }, [gameState]);

  useEffect(() => {
    return () => {
      if (!gameContinuing.current) {
        const token = localStorage.getItem("token");
        send(`/app/lobbies/${lobbyId}/leave`, JSON.stringify({ token }));
        unsubscribeAll()
        disconnect()
      }
    }
  }, [])

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
        {header}
        <Countdown duration={parseInt(gameSettings.scoreboardDuration)}/>
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