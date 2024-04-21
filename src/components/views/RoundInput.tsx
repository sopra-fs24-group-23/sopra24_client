import BackgroundImageLobby from "styles/views/BackgroundImageLobby";
import React, { useContext, useEffect, useState } from "react";
import { List, ListItem, Typography, Box, } from "@mui/material";
import WebSocketContext from "../../contexts/WebSocketContext";
import { Message } from "@stomp/stompjs";
import { useNavigate, useParams } from "react-router-dom";
import CustomButton from "components/ui/CustomButton";
import TextField from "@mui/material/TextField";

const RoundInput = () => {
  const { lobbyId } = useParams();
  const navigate = useNavigate();
  const [hasReceivedInitialState, setHasReceivedInitialState] = useState(false);
  const [userAnswers, setUserAnswers] = useState({}); // Adjust to hold answers for each category
  const [inputPhaseClosed, setInputPhaseClosed] = useState(false);

  const { send } = useContext(WebSocketContext);
  const { subscribeClient, unsubscribeClient } = useContext(WebSocketContext);

  useEffect(() => {
    const subscription = subscribeClient(`/topic/games/${lobbyId}/state`, (message) => {
      const gameState = JSON.parse(message.body);
      if (gameState.currentPhase === "VOTING") {
        navigate(`/lobbies/${lobbyId}/voting`);
      } else if (gameState.currentPhase === "AWAITING_ANSWERS") {
        setInputPhaseClosed(true); // Set input phase as closed based on server message
      }
    });
    return () => {
      unsubscribeClient(subscription);
    };
  }, [lobbyId, navigate, subscribeClient, unsubscribeClient, setInputPhaseClosed]);

  const handleDoneClick = async () => {
    // Send a message to the server indicating the player has finished inputting answers
    send(`/app/games/${lobbyId}/closeInputs`, JSON.stringify({answers: userAnswers}));
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
        alignItems: 'center',
        justifyContent: 'center',
        display: 'flex',
        flexDirection: 'column',
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
        <TextField label="Fruit" onChange={(e) => setUserAnswers({...userAnswers, fruit: e.target.value})} />
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