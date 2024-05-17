import BackgroundImageLobby from "components/ui/BackgroundImageLobby";
import React, { useContext, useEffect, useRef, useState } from "react";
import WebSocketContext from "../../contexts/WebSocketContext";
import { useNavigate, useParams } from "react-router-dom";
import CustomButton from "components/ui/CustomButton";
import GameStateContext from "../../contexts/GameStateContext";
import GameSettingsContext from "../../contexts/GameSettingsContext";
import UserContext from "../../contexts/UserContext";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import Countdown from "../ui/Countdown";
import { isProduction } from "../../helpers/isProduction";
import { Typography, Box, TextField, IconButton, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from "@mui/material";
const RoundInput = () => {
  /* Context Variables */
  const { gameSettings } = useContext(GameSettingsContext);
  const { unsubscribeAll, disconnect, send } = useContext(WebSocketContext);
  const { gameState } = useContext(GameStateContext);
  const { user } = useContext(UserContext);

  const { lobbyId } = useParams();
  const navigate = useNavigate();
  //const inputRefs = useRef(false);
  const inputRefs = useRef<InputRefType>({});
  const gameContinuing = useRef(false);
  const [jokerCategory, setJokerCategory] = useState("");
  const [allFieldsFilled, setAllFieldsFilled] = useState(false);
  const [openLeaveDialog, setOpenLeaveDialog] = useState(false);

  type InputRefType = {
    [key: string]: {
      answer: string;
      isJoker: boolean;
    };
  };

  useEffect(() => {
    if (gameSettings.categories) {
      if(!isProduction) console.log("DEBUG refs were initialized")
      inputRefs.current = gameSettings.categories.reduce((acc, category) => ({ ...acc, [category]: { answer: "", isJoker: false } }), {})
    }
  }, [gameSettings]);

  useEffect(() => {
    if (gameState.gamePhase === "AWAITING_ANSWERS") {
      gameContinuing.current = true;
      handleAwaitingAnswers()
      navigate(`/lobbies/${lobbyId}/voting`)
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

  const handleInputChange = (pCategory, value) => {
    inputRefs.current[pCategory] = {
      answer: value,
      isJoker: pCategory === jokerCategory
    };

    const allFieldsFilled = Object.values(inputRefs.current).every(
      (field) => field.answer.trim() !== ""
    );
    setAllFieldsFilled(allFieldsFilled);
  };

  const handleJokerClick = (category) => {
    // If the clicked category is already the jokerCategory, unset it
    if (jokerCategory === category) {
      inputRefs.current[category] = {
        ...inputRefs.current[category],
        isJoker: false
      };
      setJokerCategory("");
    } else {
      // Reset the isJoker property of the previous jokerCategory to false
      if (jokerCategory) {
        inputRefs.current[jokerCategory] = {
          ...inputRefs.current[jokerCategory],
          isJoker: false
        };
      }
      // Set the new jokerCategory and update the isJoker property of the corresponding category in inputRefs.current
      setJokerCategory(category);
      inputRefs.current[category] = {
        ...inputRefs.current[category],
        isJoker: true
      };
    }
  };

  const formatAndSendAnswers = (answers) => {
    const answersList = Object.entries(answers).map(([category, value]) => {
      const { answer, isJoker } = value as { answer: string; isJoker: boolean; };

      return {
        category: category,
        answer: answer,
        isDoubted: false,
        isJoker: isJoker,
        isUnique: false,
        isCorrect: false
      }
    });

    if(!isProduction) console.log("Payload being sent:", JSON.stringify(answersList));
    send(`/app/games/${lobbyId}/answers/${user.username}`, JSON.stringify(answersList));
  };

  const handleDone = () => {
    send(`/app/games/${lobbyId}/close-inputs`)
  }

  const handleAwaitingAnswers = () => {
    if(!isProduction) console.log("DEBUG Sending answers to BE")
    formatAndSendAnswers(inputRefs.current);
  }

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
        minHeight: "60%",
        margin: "auto",
        padding: "20px",
        borderRadius: "10px",
        boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
        position: "relative",
        top: "10px",
        alignItems: "center",
        justifyContent: "space-between",
        display: "flex",
        flexDirection: "column",
        overflowY: "auto",
      }}>
        <Typography variant="h4" gutterBottom sx={{
          fontFamily: "Londrina Solid",
          textAlign: "center",
        }}>
          Answers must start with {gameState.currentLetter}
        </Typography>
        <Countdown duration={gameSettings.inputDuration} />
        <Box sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          flexWrap: "wrap",
          width: "90%"
        }}>
          {gameSettings && gameSettings.categories && gameSettings.categories.map((category) => (
            <Box key={category} sx={{ margin: "10px 0" }}>
              <TextField
                label={category}
                key={category}
                onChange={(e) => handleInputChange(category, e.target.value)}
              />
              <IconButton onClick={() => handleJokerClick(category)}>
                <AutoAwesomeIcon style={{ color: jokerCategory === category ? "yellow" : "grey" }} />
              </IconButton>
            </Box>
          ))}
        </Box>
        <CustomButton onClick={handleDone} disabled={!allFieldsFilled}>
          Done
        </CustomButton>
      </Box>
    </BackgroundImageLobby>
  )
}

export default RoundInput;