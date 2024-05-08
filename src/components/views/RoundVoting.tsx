import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import BackgroundImageLobby from "components/ui/BackgroundImageLobby";
import GameSettingsContext from "../../contexts/GameSettingsContext";
import GameStateContext from "../../contexts/GameStateContext";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import WebSocketContext from "../../contexts/WebSocketContext";
import UserContext from "../../contexts/UserContext";
import Countdown from "../ui/Countdown";
import { isProduction } from "../../helpers/isProduction";
import CustomButton from "../ui/CustomButton";
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Typography, Box, IconButton} from "@mui/material";

const RoundVoting = () => {
  const { lobbyId } = useParams();
  const navigate = useNavigate();
  const [allPlayersAnswers, setAllPlayersAnswers] = useState([]);
  const [doubts, setDoubts] = useState([]);
  const [doubtedAnswers, setDoubtedAnswers] = useState([]);
  const [openLeaveDialog, setOpenLeaveDialog] = useState(false);

  /* Context variables */
  const { gameSettings } = useContext(GameSettingsContext);
  const { gameState } = useContext(GameStateContext);
  const { user } = useContext(UserContext);
  const { disconnect, send, unsubscribeAll } = useContext(WebSocketContext);


  useEffect(() => {
    if(!isProduction) console.log("Test");
    // Log the categories
    if(!isProduction) console.log("Categories: ", gameSettings.categories);

    // Access the current answers of all players
    const answers = gameState.players.map(player => player.currentAnswers);
    setAllPlayersAnswers(answers);

    if (gameState.gamePhase === "VOTING_RESULTS") {
      navigate(`/lobbies/${lobbyId}/voting-results`);
    }
  }, [gameState.gamePhase]);

  useEffect(() => {
    if (gameState.gamePhase === "AWAITING_VOTES") {
      if(!isProduction) console.log("Sending doubts to backend:", JSON.stringify(doubts));

      send(`/app/games/${lobbyId}/doubt/${user.username}`, JSON.stringify(doubts));
      setDoubts([]); // Clear doubts after sending
    }
  }, [gameState]);

  // Function to handle the doubt of a player's answer


  const handleDoubt = (playerId, category) => {
    const newDoubt = {
      username: playerId,
      category: category,
    };

    // Check if the answer is already doubted
    const isAlreadyDoubted = doubtedAnswers.some(
      (doubt) => doubt.username === newDoubt.username && doubt.category === newDoubt.category
    );

    if (isAlreadyDoubted) {
      // If the answer is already doubted, remove it from the state
      setDoubtedAnswers(doubtedAnswers.filter(
        (doubt) => !(doubt.username === newDoubt.username && doubt.category === newDoubt.category)
      ));
      setDoubts(doubts.filter(
        (doubt) => !(doubt.username === newDoubt.username && doubt.category === newDoubt.category)
      ));
    } else {
      // If the answer is not doubted, add it to the state
      setDoubtedAnswers([...doubtedAnswers, newDoubt]);
      setDoubts([...doubts, newDoubt]);
    }
  };

  // Render the players and their answers
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
        {/* Iterate over the player's currentAnswers */}
        {player.currentAnswers.map((answer, index) => {
          const isCurrentUser = user.username === player.username;
          const isDoubted = doubtedAnswers.some(
            (doubt) => doubt.username === player.username && doubt.category === answer.category
          );

          return (
            <Box key={index} sx={{ display: "flex", justifyContent: "space-between", margin: "5px 0" }}>
              {/* Set a fixed width for the category label */}
              <Typography sx={{ width: "150px", flexShrink: 0 }}>{answer.category}</Typography>
              <Typography sx={{ textAlign: "left", flexGrow: 1}}>{answer.answer ? answer.answer : "NO ANSWER"}</Typography>
              {!isCurrentUser && (
                <IconButton onClick={() => handleDoubt(player.username, answer.category)} sx={{ color: isDoubted ? "blue" : "grey" }}>
                  <CancelOutlinedIcon />
                </IconButton>
              )}
            </Box>
          );
        })}
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
          Did somebody use a joker here ?!
        </Typography>
        <Countdown duration={gameSettings.votingDuration} />
        {/* Iterate over all players to render their answers */}
        {gameState.players.map((player) => (
          <React.Fragment key={player.id}>
            {renderPlayerAnswers(player)}
          </React.Fragment>
        ))}
      </Box>
    </BackgroundImageLobby>
  );
};

export default RoundVoting;