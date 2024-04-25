import BackgroundImageLobby from "components/ui/BackgroundImageLobby";
import React, { useContext, useEffect, useRef, useState } from "react";
import { Typography, Box, } from "@mui/material";
import WebSocketContext from "../../contexts/WebSocketContext";
import { useNavigate, useParams } from "react-router-dom";
import CustomButton from "components/ui/CustomButton";
import TextField from "@mui/material/TextField";
import GameStateContext from "../../contexts/GameStateContext";
import GameSettingsContext from "../../contexts/GameSettingsContext";
import UserContext from "../../contexts/UserContext";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import IconButton from "@mui/material/IconButton";
import Countdown from "../ui/Countdown";
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

  type InputRefType = {
    [key: string]: {
      answer: string;
      isJoker: boolean;
    };
  };

  useEffect(() => {
    if (gameSettings.categories) {
      console.log("DEBUG refs were initialized")
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
    //const answersList = Object.entries(answers).map(([category, { answer, isJoker }]) => ({
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

    console.log("Payload being sent:", JSON.stringify(answersList));
    send(`/app/games/${lobbyId}/answers/${user.username}`, JSON.stringify(answersList));
  };

  const handleDone = () => {
    send(`/app/games/${lobbyId}/close-inputs`)
  }

  const handleAwaitingAnswers = () => {
    console.log("DEBUG Sending answers to BE")
    formatAndSendAnswers(inputRefs.current);
  }

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
        alignItems: "center",
        justifyContent: "center",
        display: "flex",
        flexDirection: "column",
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
        <CustomButton onClick={handleDone}>
          Done
        </CustomButton>
      </Box>
    </BackgroundImageLobby>
  )
}

export default RoundInput;