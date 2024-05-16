import BackgroundImageLobby from "components/ui/BackgroundImageLobby";
import React, { useContext, useEffect, useRef, useState } from "react";
import WebSocketContext from "../../contexts/WebSocketContext";
import { useNavigate, useParams } from "react-router-dom";
import GameStateContext from "../../contexts/GameStateContext";
import GameSettingsContext from "../../contexts/GameSettingsContext";
import Countdown from "../ui/Countdown";
import UserContext from "../../contexts/UserContext";
import CustomButton from "../ui/CustomButton";
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, List, ListItem, Typography, Box } from "@mui/material";

interface Player {
  username: string;
  currentScore: number;
  color: string;
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
    send(`/app/games/${lobbyId}/leave`, JSON.stringify({ token: user.token }));
    unsubscribeAll()
    disconnect()
    navigate("/homepage")
  }

  const handleReady = () => {
    send(`/app/games/${lobbyId}/ready/${user.username}`, JSON.stringify({ ready: true }));
    if (gameState.players.every(player => player.isReady)) {
      navigate(`/lobbies/${lobbyId}/input`);
    }
  };

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
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        //height: "50vh", // Use viewport height to fill the screen
        padding: "20px",
        backgroundColor: "rgba(224, 224, 224, 0.9)", // Semi-transparent grey
        borderColor: "black",
        borderWidth: "2px",
        borderStyle: "solid",
        borderRadius: "27px",
        boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
        width: "90%",
        height: "5%",
        margin: "auto",
        position: "relative",
        top: 30,
        marginBottom: "30px",
      }}>
        <img src="/Images/logo.png" alt="Descriptive Text"
          style={{ width: "auto", height: "200px", marginTop: "100px" }} />
        <CustomButton
          onClick={handleOpenDialog}
          sx={{
            backgroundColor: "#e0e0e0",
            "&:hover": {
              backgroundColor: "red",
            },
          }}
        >
          Leave Game
        </CustomButton>
        <Dialog open={openLeaveDialog} onClose={handleCloseDialog}>
          <DialogTitle>Leave the game?</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to leave the game?
              You will be returned to your profile page and all your progress in the current game will be lost.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <CustomButton onClick={handleLeaveGame}>Leave</CustomButton>
            <CustomButton onClick={handleCloseDialog}>Stay</CustomButton>
          </DialogActions>
        </Dialog>
      </Box>
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
    </BackgroundImageLobby>
  );
};

export default RoundScoreboard;