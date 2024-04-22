import BackgroundImageLobby from "styles/views/BackgroundImageLobby";
import React, { useContext, useEffect, useState } from "react";
import { List, ListItem, Typography, Box, } from "@mui/material";
import WebSocketContext from "../../contexts/WebSocketContext";
import { Message } from "@stomp/stompjs";
import { useNavigate, useParams } from "react-router-dom";
import CustomButton from "components/ui/CustomButton";
import TextField from "@mui/material/TextField";
import  Answer from "models/Answer.js"

const RoundInput = () => {
  const { lobbyId } = useParams();
  const navigate = useNavigate();
  const [hasReceivedInitialState, setHasReceivedInitialState] = useState(false);
  const [userAnswers, setUserAnswers] = useState({}); // Adjust to hold answers for each category
  const [inputPhaseClosed, setInputPhaseClosed] = useState(false);
  const { connect, disconnect, send, subscribeClient, unsubscribeClient } = useContext(WebSocketContext);


  useEffect(() => {
    connect(lobbyId).then(() => {
      const subscription = subscribeClient(`/topic/games/${lobbyId}/state`, (message) => {
        const gameState = JSON.parse(message.body);
        if (gameState.currentPhase === "AWAITING_ANSWERS") {
          submitAllAnswers();
          console.log("submitted all answers")
          setInputPhaseClosed(true); // Set input phase as closed based on server message
        }
        if (gameState.currentPhase === "VOTING") {
          navigate(`/lobbies/${lobbyId}/voting`);
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


  const handleDoneClick = async () => {
    console.log("Sending userAnswers:", userAnswers);

    if (Object.keys(userAnswers).length > 0) {
      const playerId = localStorage.getItem('id'); // Retrieve player ID from localStorage
      const answersList = Object.entries(userAnswers).map(([category, answer]) => ({
        category: category,
        answer: answer,
        isDoubted: false,
        isJoker: false,
        isUnique: true,
        isCorrect: null
      }));

      // Ensure the structure matches what backend expects: an object with 'answers' key containing an array of answer objects
      const payload = {
        answers: answersList
      };

      // Log the final payload for debugging
      console.log("Final payload being sent:", JSON.stringify(payload));

      // Send the payload to the server
      send(`/app/games/${lobbyId}/closeInputs`, JSON.stringify(payload));
    } else {
      console.error("No answers to send.");
    }
  };
  const submitAllAnswers = () => {
    console.log("Automatically sending all userAnswers:", userAnswers);

    if (Object.keys(userAnswers).length > 0) {
      const answersList = Object.entries(userAnswers).map(([category, answer]) => ({
        category,
        answer,
        isDoubted: false,
        isJoker: false,
        isUnique: true,
        isCorrect: null
      }));

      const payload = { answers: answersList };
      console.log("Final payload being sent:", JSON.stringify(payload));
      send(`/app/games/${lobbyId}/setAnswers`, JSON.stringify(payload));
    } else {
      console.error("No answers to send.");
    }
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
        <TextField label="Country" onChange={(e) => setUserAnswers({...userAnswers, country: e.target.value})} />
        <TextField label="City" onChange={(e) => setUserAnswers({...userAnswers, city: e.target.value})} />
        <TextField label="Movie" onChange={(e) => setUserAnswers({...userAnswers, movie: e.target.value})} />
        <TextField label="Animal" onChange={(e) => setUserAnswers({...userAnswers, animal: e.target.value})} />
        <TextField label="Celebrity" onChange={(e) => setUserAnswers({...userAnswers, celebrity: e.target.value})} />
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