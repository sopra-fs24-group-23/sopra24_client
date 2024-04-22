import BackgroundImageLobby from "styles/views/BackgroundImageLobby";
import React, { useContext, useEffect, useState } from "react";
import { List, ListItem, Typography, Box, } from "@mui/material";
import WebSocketContext from "../../contexts/WebSocketContext";
import { Message } from "@stomp/stompjs";
import { useNavigate, useParams } from "react-router-dom";
import CustomButton from "components/ui/CustomButton";
import TextField from "@mui/material/TextField";
import  Answer from "models/Answer.js"
import GameStateContext from "../../contexts/GameStateContext";

const RoundInput = () => {
  const { lobbyId } = useParams();
  const navigate = useNavigate();
  const [hasReceivedInitialState, setHasReceivedInitialState] = useState(false);
  const [userAnswers, setUserAnswers] = useState({}); // Adjust to hold answers for each category
  const [inputPhaseClosed, setInputPhaseClosed] = useState(false);
  const { connect, disconnect, send, subscribeClient, unsubscribeClient } = useContext(WebSocketContext);
  const { setGameStateVariable, setGamePhase } = useContext(GameStateContext);



  useEffect(() => {
    connect(lobbyId).then(() => {
      const subscription = subscribeClient(`/topic/games/${lobbyId}/state`, (message) => {
        const gameState = JSON.parse(message.body);
        setGameStateVariable(gameState)
        if (gameState.gamePhase === "AWAITING_ANSWERS") {

          submitAllAnswers();
          console.log("submitted all answers")
          setInputPhaseClosed(true); // Set input phase as closed based on server message
        }
        if (gameState.gamePhase === "VOTING") {
          navigate(`/lobbies/${lobbyId}/voting`);
        }
        if (gameState.players) {
          // Update local state based on the latest game state
          const updatedAnswers = {};
          gameState.players.forEach(player => {
            updatedAnswers[player.id] = player.currentAnswers;
          });
          setUserAnswers(updatedAnswers); // This might need adjustments based on your data structure
        }
      });

      // The cleanup function needs to be inside the then() to ensure it has access to the subscription
      return () => {
        unsubscribeClient(subscription);
      };
    });

    // It's important to include an empty return statement here to handle cases where the component unmounts before the connection is established
    return () => {};

  }, [lobbyId, navigate, subscribeClient, unsubscribeClient, setInputPhaseClosed]);

  const handleInputChange = (category, value) => {
    const updatedAnswers = {...userAnswers, [category]: value};
    setUserAnswers(updatedAnswers);
    localStorage.setItem('userAnswers', JSON.stringify(updatedAnswers)); // Sync with local storage
  };

  useEffect(() => {
    // Load from local storage on component mount
    const savedAnswers = JSON.parse(localStorage.getItem('userAnswers'));
    if (savedAnswers) {
      setUserAnswers(savedAnswers);
    }
  }, []);

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
    send(`/app/games/${lobbyId}/setAnswers`, JSON.stringify(payload));
  };

  const handleDoneClick = async () => {
    console.log("Manually sending userAnswers:", userAnswers);
    formatAndSendAnswers(userAnswers);
  };

  const submitAllAnswers = async () => {
    console.log("Automatically sending all userAnswers from storage:", userAnswers);
    const storedAnswers = JSON.parse(localStorage.getItem('userAnswers')) || {};
    formatAndSendAnswers(storedAnswers);
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
        <TextField label="Country" onChange={(e) => handleInputChange('country', e.target.value)} />
        <TextField label="City" onChange={(e) => handleInputChange('city', e.target.value)} />
        <TextField label="Movie" onChange={(e) => handleInputChange('movie', e.target.value)} />
        <TextField label="Animal" onChange={(e) => handleInputChange('animal', e.target.value)} />
        <TextField label="Celebrity" onChange={(e) => handleInputChange('celebrity', e.target.value)} />
        <CustomButton onClick={handleDoneClick}>
            Done
        </CustomButton>
        <CustomButton onClick={() => navigate(`/lobbies/${lobbyId}/voting`)}>
            Voting
        </CustomButton>
      </Box>
    </BackgroundImageLobby>
  );
}

export default RoundInput;