import BackgroundImageLobby from "components/ui/BackgroundImageLobby";
import React, { useContext, useEffect, useRef, useState } from "react";
import { List, ListItem, Typography, Box, } from "@mui/material";
import WebSocketContext from "../../contexts/WebSocketContext";
import { useNavigate, useParams } from "react-router-dom";
import GameStateContext from "../../contexts/GameStateContext";
import CustomButton from "../ui/CustomButton";
import Confetti from "react-confetti"
import ChatComponent from "./ChatComponent";
interface Player {
  username: string;
  currentScore: number;
}
const FinalScoreboard = () => {
  const { lobbyId } = useParams();
  const navigate = useNavigate();
  const [players, setPlayers] = useState<Player[]>([]);
  const gameContinuing = useRef(false)
  let sortedPlayers = [];
  const [showConfetti, setShowConfetti] = useState(false);
  const [header, setHeader] = useState(<></>);

  /* Context Variables */
  const { gameState } = useContext(GameStateContext);
  const { disconnect, unsubscribeClient, send, unsubscribeAll } = useContext(WebSocketContext);

  useEffect(() => {
    if (gameState) {
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
    unsubscribeClient(`/topic/lobbies/${lobbyId}/close`)

    return () => {
      if (!gameContinuing.current) {
        const token = localStorage.getItem("token");
        send(`/app/lobbies/${lobbyId}/leave`, JSON.stringify({ token }));
        unsubscribeAll()
        disconnect()
      }
    }
  }, [])

  useEffect(() => {
    const highestScore = players[0]?.currentScore;
    const winners = players.filter(player => player.currentScore === highestScore);
    const isSingleWinner = winners.length === 1;
    setShowConfetti(isSingleWinner);

    let header = (
      <Typography variant="h4" gutterBottom sx={{
        fontFamily: "Londrina Solid",
        textAlign: "center",
      }}>
        {/* Check if there is a tie, else display the individual winner */}
        {isSingleWinner ? `${winners[0]?.username} has won!` : "There is a tie!"}
      </Typography>
    )
    setHeader(header);

    if (isSingleWinner) {
      const timer = setTimeout(() => {
        setShowConfetti(false);
      }, 5000); // Change confetti display after 5 seconds

      return () => clearTimeout(timer); // Clean-up timer on unmount
    }
  }, [players]);

  const handleLeaveGame = () => {
    navigate("/homepage");
  }

  return (
    <BackgroundImageLobby>
      {showConfetti && <Confetti />}
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
        minWidth: "60%",
        height: "60%",
        minHeight: "60%",
        margin: "auto",
        padding: "20px",
        borderRadius: "10px",
        boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
        position: "relative",
        top: "10px",
      }}>
        {header}
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
        <CustomButton onClick={handleLeaveGame}>Leave</CustomButton>
      </Box>
        {/* Chat Component */}
        <Box sx={{
          marginLeft: "20px"
        }}>
          <ChatComponent lobbyId={lobbyId} />
        </Box>
      </Box>
    </BackgroundImageLobby>
  );
};

export default FinalScoreboard;