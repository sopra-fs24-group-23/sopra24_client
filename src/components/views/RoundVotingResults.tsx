import BackgroundImageLobby from "../ui/BackgroundImageLobby";
import React, { useContext, useEffect, useState } from "react";
import GameStateContext from "../../contexts/GameStateContext";
import { useNavigate, useParams } from "react-router-dom";
import Countdown from "../ui/Countdown";
import GameSettingsContext from "../../contexts/GameSettingsContext";
import WebSocketContext from "../../contexts/WebSocketContext";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Typography,
  Box,
  IconButton,
  Tooltip,
} from "@mui/material";
import CustomButton from "../ui/CustomButton";
/* Icons import */
import CircleIcon from "@mui/icons-material/Circle";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import LooksOneOutlinedIcon from "@mui/icons-material/LooksOneOutlined";
import ContentCopyOutlinedIcon from "@mui/icons-material/ContentCopyOutlined";
import UserContext from "../../contexts/UserContext";

const VotingResults = () => {
  const { lobbyId } = useParams();
  const navigate = useNavigate();
  const [allPlayersAnswers, setAllPlayersAnswers] = useState([]);
  const [openLeaveDialog, setOpenLeaveDialog] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  

  /* Context variables */
  const { gameState } = useContext(GameStateContext);
  const { gameSettings } = useContext(GameSettingsContext);
  const { user } = useContext(UserContext);
  const { disconnect, send, unsubscribeAll } = useContext(WebSocketContext);

  useEffect(() => {
    // Access the current answers of all players
    const answers = gameState.players.map(player => player.currentAnswers);
    setAllPlayersAnswers(answers);

    if (gameState.gamePhase === "SCOREBOARD") {
      navigate(`/lobbies/${lobbyId}/scoreboard`);
    }
    else if (gameState.gamePhase === "ENDED") {
      navigate(`/lobbies/${lobbyId}/winners`);
    }
  }, [gameState.gamePhase]);

  /* Render Icons */
  const renderStatusIcons = (answer) => (
    <Box sx={{ display: "flex", gap: "5px" }}>
      {answer.isCorrect ? (
        <Tooltip title={"This answer is correct."}>
          <CircleIcon sx={{ color: "green" }} />
        </Tooltip>) : null}
      {answer.joker ? (
        <Tooltip title={"This answer was a joker."}>
          <AutoAwesomeIcon sx={{ color: "yellow" }} />
        </Tooltip>) : null}
      {answer.isDoubted ? (
        <Tooltip title={"This answer was doubted."}>
          <CancelOutlinedIcon sx={{ color: "blue" }} />
        </Tooltip>) : null}
      {answer.isUnique ? (
        <Tooltip title={"This answer is unique."}>
          <LooksOneOutlinedIcon sx={{ color: "purple" }} />
        </Tooltip>) : null}
      {answer.answer ? !answer.isCorrect && (
        <Tooltip title={"This answer is incorrect."}>
          <CircleIcon sx={{ color: "red" }} />
        </Tooltip>) : null}
      {!answer.isUnique ? (
        <Tooltip title={"This answer is not unique."}>
          <ContentCopyOutlinedIcon sx={{ color: "purple" }} />
        </Tooltip>) : null}
    </Box>
  );

  const renderPlayerAnswers = (player) => {
    return (
      <Box key={player.id} sx={{
        backgroundColor: "white",
        borderRadius: "10px",
        padding: "10px",
        margin: "10px 0",
        boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
        borderColor: "black",
        borderWidth: "2px",
        borderStyle: "solid",
      }}>
        <Typography variant="h6">{player.username}</Typography>
        {player.currentAnswers.map((answer, index) => (
          <Box key={index} sx={{ display: "flex", justifyContent: "space-between", margin: "5px 0" }}>
            {/* Set a fixed width for the category label */}
            <Typography sx={{ width: "150px", flexShrink: 0 }}>{answer.category}</Typography>
            {/* Have answer aligned properly */}
            <Typography sx={{ textAlign: "left", flexGrow: 1}}>{answer.answer ? answer.answer : "NO ANSWER"}</Typography>
            <Typography sx={{ width: "50px", textAlign: "right" }}>{answer.points} pts </Typography>
            {renderStatusIcons(answer)}
          </Box>
        ))}
      </Box>
    );
  };

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
      navigate(`/lobbies/${lobbyId}/scoreboard`);
    }
  };

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
        height: "auto",
        margin: "auto",
        padding: "20px",
        borderRadius: "10px",
        boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
        position: "relative",
        top: "10px",
        overflowY: "auto",
      }}>
        <Typography variant="h4" gutterBottom sx={{
          fontFamily: "Londrina Solid",
          textAlign: "center",
        }}>
          Voting Results
        </Typography>
        <Countdown duration={gameSettings.scoreboardDuration} />
        {/* Iterate over all players to render their answers */}
        {gameState.players.map((player) => (
          <React.Fragment key={player.id}>
            {renderPlayerAnswers(player)}
          </React.Fragment>
        ))}
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
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
}

export default VotingResults;