import BackgroundImageLobby from "components/ui/BackgroundImageLobby";
import React, { useContext, useEffect, useRef, useState } from "react";
import WebSocketContext from "../../contexts/WebSocketContext";
import { useNavigate, useParams } from "react-router-dom";
import GameStateContext from "../../contexts/GameStateContext";
import GameSettingsContext from "../../contexts/GameSettingsContext";
import Countdown from "../ui/Countdown";
import UserContext from "../../contexts/UserContext";
import CustomButton from "../ui/CustomButton";
import ChatComponent from "./ChatComponent";
import { List, ListItem, Typography, Box } from "@mui/material";
import Header from "../ui/Header";

interface Player {
  username: string;
  currentScore: number;
  color: string;
}
const RoundScoreboard = () => {
  const { lobbyId } = useParams();
  const navigate = useNavigate();
  const [players, setPlayers] = useState<Player[]>([]);
  const gameContinuing = useRef(false)
  let sortedPlayers = [];

  /* Context Variables */
  const { gameState } = useContext(GameStateContext);
  const { gameSettings } = useContext(GameSettingsContext);
  const { disconnect, send, unsubscribeAll } = useContext(WebSocketContext);
  const [openLeaveDialog, setOpenLeaveDialog] = useState(false);
  const { user } = useContext(UserContext);
  const [isPressed, setIsPressed] = useState(false);

  /* JSX Variables*/
  let header = (
    <Typography variant="h4" gutterBottom sx={{
      fontFamily: "Londrina Solid",
      textAlign: "center",
    }}>
      Scoreboard
    </Typography>
  )

  const handleOpenDialog = () => {
    setOpenLeaveDialog(true);
  };
  const handleCloseDialog = () => {
    setOpenLeaveDialog(false);
  };

  const handleLeaveGame = () => {
    navigate("/homepage")
  }

  const handleReady = () => {
    send(`/app/games/${lobbyId}/ready/${user.username}`, JSON.stringify({ ready: true }));
    if (gameState.players.every(player => player.isReady)) {
      gameContinuing.current = true;
      navigate(`/lobbies/${lobbyId}/input`);
    }
  };

  useEffect(() => {
    if (gameState) {
      if (gameState.gamePhase) {
        if (gameState.gamePhase === "INPUT") {
          console.log("NDB scoreboard setting gamecontinuing true in scoreboard")
          gameContinuing.current = true;
          navigate(`/lobbies/${lobbyId}/input`)
        }
      }
      if (gameState.players) {
        const players = gameState.players.map((player: any) => ({
          username: player.username,
          currentScore: player.currentScore,
          color: player.color,
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
        console.log("NDB calling cleanup from scoreboard, gamecontinuing: " + gameContinuing.current)
        send(`/app/lobbies/${lobbyId}/leave`, JSON.stringify({ token }));
        unsubscribeAll()
        disconnect()
      }
    }
  }, [gameContinuing.current])

  return (
    <BackgroundImageLobby>
      <Header handleOpenDialog={handleOpenDialog} openLeaveDialog={openLeaveDialog} handleCloseDialog={handleCloseDialog} handleLeaveGame={handleLeaveGame} />
      <Box sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        width: "90%",
        margin: "auto",
        height: "80vh", // Ensures that the container takes up most of the viewport height
      }}>
        {/* Main box */}
        <Box sx={{
          backgroundColor: "rgba(224, 224, 224, 0.9)",
          borderColor: "black",
          borderWidth: "2px",
          borderStyle: "solid",
          width: "60%",
          minWidth: "60%", // Ensure a minimum width for the main box
          //height: "60%",
          height: "80%",
          margin: "auto",
          padding: "20px",
          borderRadius: "10px",
          boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
          position: "relative",
          top: "10px",
        }}>
          {header}
          <Countdown duration={parseInt(gameSettings.scoreboardDuration)} />
          <List sx={{ width: "100%" }}>
            {players.map((player, index) => (
              <ListItem key={index} sx={{ padding: "10px", borderBottom: "1px solid #ccc", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1, justifyContent: "space-between" }}>
                  {index + 1}.
                  <Typography style={{ color: player.color }}>
                    {player.username}
                  </Typography>
                  <Typography variant="body1">Score: {player.currentScore}</Typography>
                </Box>
              </ListItem>
            ))}
          </List>
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <CustomButton
              onClick={() => { handleReady(); setIsPressed(true); }}
              sx={{
                backgroundColor: isPressed ? "#e0e0e0" : "#FFFFFF ",
                "&:hover": { backgroundColor: isPressed ? "#e0e0e0" : "#FFFFFF" }
              }}
              disabled={isPressed}
            >
              Ready
            </CustomButton>
          </Box>
        </Box>
        {/* Chat Component */}
        <Box sx={{
          marginLeft: "20px" // Adding some space between the main box and chat
        }}>
          <ChatComponent lobbyId={lobbyId} />
        </Box>
      </Box>
    </BackgroundImageLobby>
  );
};

export default RoundScoreboard;