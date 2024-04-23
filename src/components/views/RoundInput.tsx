import BackgroundImageLobby from "styles/views/BackgroundImageLobby";
import React, { useContext, useEffect, useRef, useState } from "react";
import { List, ListItem, Typography, Box, } from "@mui/material";
import WebSocketContext from "../../contexts/WebSocketContext";
import { Message } from "@stomp/stompjs";
import { useNavigate, useParams } from "react-router-dom";
import CustomButton from "components/ui/CustomButton";
import TextField from "@mui/material/TextField";
import  Answer from "models/Answer.js"
import GameStateContext from "../../contexts/GameStateContext";
import GameSettingsContext from "../../contexts/GameSettingsContext";

const RoundInput = () => {
  /* Context Variables */
  const { gameSettings } = useContext(GameSettingsContext);
  const { disconnect, send } = useContext(WebSocketContext);
  const { gameState } = useContext(GameStateContext);

  const { gameId } = useParams();
  const navigate = useNavigate();
  const inputRefs = useRef(false);

  useEffect(() => {
    if (gameSettings.categories) {
      console.log("DEBUG refs were initialized")
      inputRefs.current = gameSettings.categories.reduce((acc, category) => ({ ...acc, [category]: "" }), {})
    }
  }, [gameSettings]);

  useEffect(() => {
    if (gameState.gamePhase === "AWAITING_ANSWERS") {
      handleAwaitingAnswers()
    }
  }, [gameState]);

  const handleInputChange = (pCategory, value) => {
    inputRefs.current[pCategory] = value
  };

  const formatAndSendAnswers = (answers) => {
    const answersList = Object.entries(answers).map(([category, answer]) => ({
      category: category,
      answer: answer,
      isDoubted: false,
      isJoker: false,
      isUnique: true,
      isCorrect: null
    }));

    const payload = { answers: answersList };
    console.log("Payload being sent:", JSON.stringify(payload));
    send(`/app/games/${gameId}/setAnswers`, JSON.stringify(payload));
  };

  const handleDone = () => {
    send(`/app/games/${gameId}/closeInput`)
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
          Write words that start with A
        </Typography>
        <Box sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          flexWrap: "wrap",
          width: "90%"
        }}>
        {gameSettings && gameSettings.categories && gameSettings.categories.map((category) => (
            <TextField
              label={category}
              key={category}
              onChange={(e) => handleInputChange(category, e.target.value)}
            />))}
        </Box>
        <CustomButton onClick={handleDone}>
            Done
        </CustomButton>
        <CustomButton onClick={() => navigate(`/lobbies/${gameId}/voting`)}>
            Voting
        </CustomButton>
      </Box>
    </BackgroundImageLobby>
  )
}

export default RoundInput;