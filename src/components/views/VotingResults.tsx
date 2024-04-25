import BackgroundImageLobby from "../../styles/views/BackgroundImageLobby";
import { Box, Typography } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import GameStateContext from "../../contexts/GameStateContext";
import { useNavigate, useParams } from "react-router-dom";
import Countdown from "../ui/Countdown";
import GameSettingsContext from "../../contexts/GameSettingsContext";
/* Icons import */
import CircleIcon from "@mui/icons-material/Circle";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import LooksOneOutlinedIcon from "@mui/icons-material/LooksOneOutlined";
import ContentCopyOutlinedIcon from "@mui/icons-material/ContentCopyOutlined";

const VotingResults = () => {
  const { lobbyId } = useParams();
  const navigate = useNavigate();
  const [allPlayersAnswers, setAllPlayersAnswers] = useState([]);

  /* Context variables */
  const { gameState } = useContext(GameStateContext);
  const { gameSettings } = useContext(GameSettingsContext);

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
      {answer.isCorrect && <CircleIcon sx={{ color: "green" }} />}
      {answer.joker && <AutoAwesomeIcon sx={{ color: "yellow" }} />}
      {answer.isDoubted && <CancelOutlinedIcon sx={{ color: "blue" }} />}
      {answer.isUnique && <LooksOneOutlinedIcon sx={{ color: "purple" }} />}
      {answer.answer && !answer.isCorrect && <CircleIcon sx={{ color: "red" }} />}
      {answer.answer && !answer.isUnique && <ContentCopyOutlinedIcon sx={{ color: "purple" }} />}
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
            <Typography>{answer.category}</Typography>
            <Typography>{answer.answer ? answer.answer : "NO ANSWER"}</Typography>
            {renderStatusIcons(answer)}
          </Box>
        ))}
      </Box>
    );
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
      </Box>
    </BackgroundImageLobby>
  );
}

export default VotingResults;