import BackgroundImageLobby from "styles/views/BackgroundImageLobby";
import React, { useState, useEffect, useContext } from "react";
import CloseIcon from "@mui/icons-material/Close"; // Import close icon for the button

import CustomButton from "components/ui/CustomButton";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  TextField,
  Typography,
  List,
  ListItem,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  DialogContentText,
} from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import IconButton from "@mui/material/IconButton";
import WebSocketContext from "../../contexts/WebSocketContext";
import { Message } from "@stomp/stompjs";

interface GameSettings {
  //categories: string[];
  maxRounds: number;
  votingDuration: number;
  inputDuration: number;
  scoreboardDuration: number;
  maxPlayers: number;
}

interface GameSettingsProps {
  isHost: boolean;
  settings: GameSettings;
  onSettingsChange: (newSettings: GameSettings) => void;
}

const Lobby = () => {
  const [players, setPlayers] = useState([]);
  const [lobbyDetails, setLobbyDetails] = useState(null);
  const navigate = useNavigate();
  const [openLeaveDialog, setOpenLeaveDialog] = useState(false);
  const [openGameSettings, setOpenGameSettings] = useState(false);
  const handleOpenGameSettings = () => setOpenGameSettings(true);
  const handleCloseGameSettings = () => setOpenGameSettings(false);
  const [isHost, setIsHost] = useState(false);
  const { lobbyId } = useParams();
  const [settings, setSettings] = useState<GameSettings>({
    //categories: [],
    maxRounds: 10,
    votingDuration: 60,
    inputDuration: 120,
    scoreboardDuration: 30,
    maxPlayers: 5,
  });

  /** Consuming Websocket Context
   * Context provides functions: connect, disconnect, subscribeClient, unsubscribeClient **/
  const { connect, disconnect, send, subscribeClient, unsubscribeClient } = useContext(WebSocketContext);
  /** On component Mount/Unmount**/
  useEffect(() => {
    handleIsHost();
    if (lobbyId) {
      connect(lobbyId).then(() => {
        subscribeClient(
          `/topic/lobbies/${lobbyId}/settings`,
          (message: Message) => {
            console.log("Received settings update:", message.body);
            const receivedSettings = JSON.parse(message.body);
            setSettings(receivedSettings);
          },
        );
        subscribeClient(
          `/topic/lobbies/${lobbyId}/players`,
          (message: Message) => {
            console.log(`Received Playerlist update: ${message.body}`)
            const receivedPlayers = JSON.parse(message.body);
            setPlayers(receivedPlayers);
          },
        );
        const token = localStorage.getItem("token");
        send(`/app/lobbies/${lobbyId}/join`, JSON.stringify({ token }));
      });
    }

    return () => {
      if (lobbyId) {
        const token = localStorage.getItem("token");
        send(`/app/lobbies/${lobbyId}/leave`, JSON.stringify({ token }));
        unsubscribeClient(`/topic/lobbies/${lobbyId}/settings`);
        unsubscribeClient(`/topic/lobbies/${lobbyId}/players`);
        disconnect();
      }
    };
  }, []);


  const handleIsHost = () => {
    // isHost will be set to true if true
    setIsHost(localStorage.getItem("isHost") === "true");
    console.log(isHost);
  };

  const onSettingsChange = (newSettings) => {
    setSettings(newSettings);
  };

  const handleOpenDialog = () => {
    setOpenLeaveDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenLeaveDialog(false);
  };

  const handleStartGame = async () => {
    try {
      // Assuming you have a function to send WebSocket messages
      // Replace `lobbyId` with your actual lobby ID variable
      send(`/app/lobbies/${lobbyId}/startGame`, {});
    } catch (error) {
      console.error("Failed to start the game:", error);
    }
  };

  const handleLeaveGame = () => {
    navigate("/homepage")
  };

  const handleCopyLobbyCode = () => {
    navigator.clipboard.writeText(localStorage.getItem("lobbyCode"))
      .then(() => {
        console.log("Lobby code copied to clipboard");
      })
      .catch((error) => {
        console.error("Failed to copy lobby code to clipboard:", error);
      });
  };
  const kickPlayer = (usernameToKick) => {
    const token = localStorage.getItem("token");
    if (token && isHost) { // Make sure only the host can kick players
      send(`/app/lobbies/${lobbyId}/kick/${usernameToKick}`, JSON.stringify({ token }));
    }
  };

  const defaultSettings: GameSettings = {
    maxRounds: 10,
    votingDuration: 60,
    inputDuration: 120,
    scoreboardDuration: 30,
    maxPlayers: 8,
  };

  const GameSettings: React.FC<GameSettingsProps> = ({ isHost, settings, onSettingsChange }) => {
    // Create a local state for each TextField
    //const [maxRounds, setMaxRounds] = useState(settings.maxRounds);
    //const [votingDuration, setVotingDuration] = useState(settings.votingDuration);
    //const [inputDuration, setInputDuration] = useState(settings.inputDuration);
    //const [scoreboardDuration, setScoreboardDuration] = useState(settings.scoreboardDuration);
    // const [maxPlayers, setMaxPlayers] = useState(settings.maxPlayers);
    // Needed to temporarily store the changes before the player clicks 'Save'
    const [tempSettings, setTempSettings] = useState(settings);

    const handleInputChange = (e, settingKey) => {
      const inputValue = e.target.value;
      if (!isNaN(Number(inputValue))) {
        setTempSettings({ ...tempSettings, [settingKey]: inputValue === "" ? "" : parseInt(inputValue) });
      }
    };

    const handleSaveSettings = async () => {
      try {
        // Update the local state
        onSettingsChange(tempSettings);

        // Send the updated settings to the server
        const requestBody = JSON.stringify(tempSettings);
        // Send a Websocket message to update the gamesettings
        send(`/app/lobbies/${lobbyId}/settings`, requestBody);

        handleCloseGameSettings();
      } catch (error) {
        console.error("Failed to update game settings:", error);
      }
    };

    const handleCloseSettings = () => {
      // Discard the temporary state
      setTempSettings(settings);

      handleCloseGameSettings();
    };


    return (
      <>
        {isHost ? (
          <>
            {/*Render editable fields for the host*/}
            {/*<TextField
              label="Categories"
              defaultValue={settings.categories.join(", ")}
              onChange={(e) => onSettingsChange({ ...settings, categories: e.target.value.split(", ") })}
            />*/}
            <TextField
              label="Max Rounds"
              value={tempSettings.maxRounds}
              onChange={(e) => handleInputChange(e, "maxRounds")}
            //onBlur={(e) => handleInputBlur(e, 'maxRounds', tempSettings.maxRounds)}
            />
            <TextField
              label="Voting Duration (seconds)"
              value={tempSettings.votingDuration}
              onChange={(e) => handleInputChange(e, "votingDuration")}
            //onBlur={(e) => handleInputBlur(e, 'votingDuration', tempSettings.votingDuration)}
            />
            <TextField
              label="Duration of a round (seconds)"
              value={tempSettings.inputDuration}
              onChange={(e) => handleInputChange(e, "inputDuration")}
            //onBlur={(e) => handleInputBlur(e, 'inputDuration', tempSettings.inputDuration)}
            />
            <TextField
              label="Duration to view scoreboard (seconds)"
              value={tempSettings.scoreboardDuration}
              onChange={(e) => handleInputChange(e, "scoreboardDuration")}
            //onBlur={(e) => handleInputBlur(e, 'scoreboardDuration', tempSettings.scoreboardDuration)}
            />
            <TextField
              label="Max number of players"
              value={tempSettings.maxPlayers}
              onChange={(e) => handleInputChange(e, "maxPlayers")}
            //onBlur={(e) => handleInputBlur(e, 'maxPlayers', tempSettings.maxPlayers)}
            />
            <CustomButton onClick={handleSaveSettings}>Save</CustomButton>
          </>
        ) : (
          <>
            {/* Render read-only info for other players*/}
            {/*<Typography>Categories: {settings.categories.join(", ")}</Typography> */}
            <Typography>Max Rounds: {settings.maxRounds}</Typography>
            <Typography>Voting Duration (seconds): {settings.votingDuration}</Typography>
            <Typography>Duration of a round (seconds): {settings.inputDuration}</Typography>
            <Typography>Duration to view scoreboard (seconds): {settings.scoreboardDuration}</Typography>
            <Typography>Max number of players (seconds): {settings.maxPlayers}</Typography>
          </>
        )}
        <CustomButton onClick={handleCloseSettings}>Close</CustomButton>
      </>
    );
  };

  return (
    <BackgroundImageLobby>
      <Box sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        //height: "50vh", // Use viewport height to fill the screen
        padding: "20px",
        //display: "flex",
        //flexDirection: "column",
        //alignItems: "center",
        //justifyContent: "space-between",
        backgroundColor: "rgba(224, 224, 224, 0.9)", // Semi-transparent grey
        borderColor: "black",
        borderWidth: "2px",
        borderStyle: "solid",
        borderRadius: "27px",
        boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
        width: "90%",
        //maxWidth: "800px",
        height: "5%",
        margin: "auto",
        position: "relative",
        //paddingTop: "20px",
        //paddingBottom: "10px",
        top: 30,
        marginBottom: "30px",
      }}>
        <img src="/images/logo.png" alt="Descriptive Text"
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
          <DialogTitle>Leave the lobby?</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to leave the lobby?
              You will be returned to your profile page but you can still return as long as the
              game hasn&apos;t started yet. If the host leaves the lobby,
              the lobby will be closed for all players.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <CustomButton onClick={handleLeaveGame}>Leave</CustomButton>
            <CustomButton onClick={handleCloseDialog}>Stay</CustomButton>
          </DialogActions>
        </Dialog>
      </Box>
      {/* Outer box */}
      <Box sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "rgba(224, 224, 224, 0.9)", // Semi-transparent grey
        borderColor: "black",
        borderWidth: "2px",
        borderStyle: "solid",
        padding: "20px",
        borderRadius: "27px",
        boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
        width: "35%",
        maxWidth: "500px",
        height: "77%",
        margin: "auto",
        position: "relative",
        paddingTop: "30px",
        paddingBottom: "10px",
      }}>
        <Box sx={{
          display: "flex",
          position: "absolute",
          top: "2%",
          left: "85%",
        }}>
          <CustomButton onClick={handleOpenGameSettings}>
            <SettingsIcon />
          </CustomButton>
          <Dialog open={openGameSettings} onClose={handleCloseGameSettings}>
            <DialogTitle>Game Settings</DialogTitle>
            <DialogContent>
              {/* Conditionally render settings based on user role (host or not) */}
              <GameSettings isHost={isHost} settings={settings} onSettingsChange={setSettings} />
            </DialogContent>
          </Dialog>
        </Box>
        {/*
        <CustomButton onClick={() => navigate(`/lobbies/${response.data.id}`)}>
            Instructions </CustomButton> */}
        {/* Inner box for player list*/}
        <Box sx={{
          backgroundColor: "#e0e0e0",
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
          top: isHost ? "-3%" : "10px",
        }}>
          <Typography variant="h4" gutterBottom sx={{
            fontFamily: "Londrina Solid",
            textAlign: "center",
          }}>
            Players
          </Typography>
          <List sx={{ width: "100%" }}>
            {players.map((player, index) => (
              <ListItem key={index} sx={{ padding: "10px", borderBottom: "1px solid #ccc", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                {player.username}
                {isHost && player.username !== localStorage.getItem("username") && ( // Assuming the current user's username is stored
                  <IconButton onClick={() => kickPlayer(player.username)} size="small">
                    <CloseIcon />
                  </IconButton>
                )}
              </ListItem>
            ))}
          </List>
        </Box>

        {/* Inner box for Lobby Code if isHost is true*/}
        {isHost && (
          <Box sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#e0e0e0",
            borderColor: "black",
            borderWidth: "2px",
            borderStyle: "solid",
            width: "60%",
            height: "5%",
            margin: "10 px auto",
            padding: "20px",
            borderRadius: "40px",
            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
            position: "relative",
            top: "-5%",
          }}>
            {/* Lobby Code */}
            <Typography variant="h6" gutterBottom
              sx={{
                fontFamily: "Londrina Solid",
                textAlign: "center",
                position: "relative",
                top: "30%",
              }}>
              INVITE A FRIEND!
            </Typography>
            <Box sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
            }}>
              <Typography variant="body1" gutterBottom
                sx={{
                  fontFamily: "Courier New",
                  textAlign: "center",
                  position: "relative",
                  top: "-10%",
                }}>
              </Typography>
              <Box sx={{
                position: "relative",
                top: "-20%",
              }}>
                <IconButton onClick={handleCopyLobbyCode} size="large">
                  <ContentCopyIcon />
                </IconButton>
              </Box>
            </Box>
          </Box>
        )}
        <Box sx={{
          display: "flex",
          position: "relative",
          bottom: "1%",
        }}>
          {isHost && <CustomButton onClick={handleStartGame} disabled={players.length < 2}>Start Game</CustomButton>}
        </Box>
      </Box>
    </BackgroundImageLobby>
  );
};


export default Lobby;