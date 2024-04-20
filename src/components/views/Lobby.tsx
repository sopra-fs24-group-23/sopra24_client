import BackgroundImageLobby from "styles/views/BackgroundImageLobby";
import React, { useState, useEffect, useContext } from "react";
import CloseIcon from "@mui/icons-material/Close"; // Import close icon for the button
import StarsIcon from '@mui/icons-material/Stars';
import CustomButton from "components/ui/CustomButton";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../../helpers/api"
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
  Select,
  MenuItem,
  SelectChangeEvent,
  FormControl,
  InputLabel,
  Grid,
} from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import IconButton from "@mui/material/IconButton";
import WebSocketContext from "../../contexts/WebSocketContext";
import { Message } from "@stomp/stompjs";
import UserContext from "../../contexts/UserContext";
import User from "../../models/User";
import PlayerList from "../ui/PlayerList";

interface GameSettings {
  categories: string[];
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
  const { user } = useContext(UserContext);
  const [settings, setSettings] = useState<GameSettings>({
    categories: ["Country", "City", "Movie"],
    maxRounds: 5,
    votingDuration: 30,
    inputDuration: 60,
    scoreboardDuration: 30,
    maxPlayers: 4,
  });
  /** Consuming Websocket Context
   * Context provides functions: connect, disconnect, subscribeClient, unsubscribeClient **/
  const { connect, disconnect, send, subscribeClient, unsubscribeClient } = useContext(WebSocketContext);
  /** On component Mount/Unmount**/
  useEffect(() => {
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
        if (user) {
          subscribeClient(
            `/queue/lobbies/${lobbyId}/kick/${user.username}`,
            (message: Message) => {
              console.log(`Received kick message: ${message.body}`)
              alert("You were kicked from the lobby.")
              navigate("/homepage")
            },
          );
        }
        subscribeClient(
          `/topic/lobbies/${lobbyId}/close`,
          () => {
            alert("Sorry, the host has left the lobby! Returning you to the homepage.")
            navigate("/homepage")
          }
        )
        subscribeClient(
          `/topic/games/${lobbyId}/state`,
          (message: Message) => {
            console.log(`Received GameState update: ${message.body}`);
            const receivedGameState = JSON.parse(message.body);
            if (receivedGameState.gamePhase === "SCOREBOARD") {
              // Redirect to RoundScoreboard page/component
              navigate(`/lobbies/${lobbyId}/scoreboard`);
            }
          }
        )
        const token = localStorage.getItem("token");
        send(`/app/lobbies/${lobbyId}/join`, JSON.stringify({ token }));
      });
    }

    if (lobbyId && user) {
      const fetchHost = async () => {
        try {
          const response = await api.get(`/lobbies/${lobbyId}/host`);
          const host = new User(response.data);
          console.log(`MYDEBUG ${user.username} equals ${host.username}?`)
          if (user.username === host.username) {
            console.log("MYDEBUG SETTING ISHOST TRUE")
            setIsHost(true)
          }
          else {
            console.log("MYDEBUG SETTING ISHOST FALSE")
            setIsHost(false)
          }
        }
        catch (e) {
          alert("Could not fetch lobby-host, returning to homepage.")
          navigate("/homepage")
        }
      }
      fetchHost()
    }
  }, [user]);

  useEffect(() => {
    return () => {
      if (lobbyId) {
        const token = localStorage.getItem("token");
        send(`/app/lobbies/${lobbyId}/leave`, JSON.stringify({ token }));
        unsubscribeClient(`/topic/lobbies/${lobbyId}/settings`);
        unsubscribeClient(`/topic/lobbies/${lobbyId}/players`);
        unsubscribeClient(`/topic/games/${lobbyId}/state`);
        disconnect();
      }
    }
  }, []);
/*
  useEffect(() => {
    subscribeClient(`/topic/games/${lobbyId}/state`, (message: Message) => {
      const gameState = JSON.parse(message.body);
      if (gameState.gamePhase === "SCOREBOARD") {
        // Redirect to RoundScoreboard page/component
        navigate(`/game/${lobbyId}/scoreboard`);
      }
    });
  }, [lobbyId]);
*/

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
      send(`/app/games/${lobbyId}/start`, {});
    } catch (error) {
      console.error("Failed to start the game:", error);
    }
  };
  const handleLeaveGame = () => {
    if (isHost) {
      send(`/app/lobbies/${lobbyId}/delete`)
    }
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
  const kickPlayer = (usernameToKick: String) => {
    const token = localStorage.getItem("token");
    if (token) {
      send(`/app/lobbies/${lobbyId}/kick/${usernameToKick}`, JSON.stringify({ token }));
    }
  };
  const GameSettings: React.FC<GameSettingsProps> = ({ isHost, settings, onSettingsChange }) => {
    // Needed to temporarily store changes. So changes are only saved when user clicks 'Save'
    const [tempSettings, setTempSettings] = useState(settings);
    const initialCategories = settings.categories && settings.categories.length > 0 ? settings.categories : ["Country", "City"];
    const [tempCategories, setTempCategories] = useState<string[]>(initialCategories);
    const [errors, setErrors] = useState({
      maxRounds: false,
      votingDuration: false,
      inputDuration: false,
      scoreboardDuration: false,
      maxPlayers: false,
    });
    const handleInputChange = (e, settingKey) => {
      const inputValue = e.target.value;
      if (!isNaN(Number(inputValue))) {
          setTempSettings({ ...tempSettings, [settingKey]: inputValue === "" ? "" : parseInt(inputValue) });
        }
    };
    const handleCategoryChange = (event: SelectChangeEvent<string[]>) => {
      let newCategories = event.target.value as string[];
      // If new category is empty, set it to the default categories
      if (newCategories.length === 0) {
        newCategories = ["Country", "City", "Movie"];
      }
      setTempCategories(newCategories);
    };
    const handleSaveSettings = async () => {
      try {
        // Perform validation
        const newErrors = {
          maxRounds: tempSettings.maxRounds.toString() === "" || tempSettings.maxRounds === 0,
          votingDuration: tempSettings.votingDuration.toString() === "" || tempSettings.votingDuration === 0,
          inputDuration: tempSettings.inputDuration.toString() === "" || tempSettings.inputDuration === 0,
          scoreboardDuration: tempSettings.scoreboardDuration.toString() === "" || tempSettings.scoreboardDuration === 0,
          maxPlayers: tempSettings.maxPlayers.toString() === "" || tempSettings.maxPlayers === 0,
        };
        setErrors(newErrors);
        // If there are no errors, save the settings
        if (!Object.values(newErrors).includes(true)) {
          // Update the local state
          const newSettings = { ...tempSettings, categories: tempCategories };
          onSettingsChange(newSettings);
          setSettings(newSettings);
          // Send the updated settings to the server
          const requestBody = JSON.stringify(newSettings);
          // Send a Websocket message to update the gamesettings
          send(`/app/lobbies/${lobbyId}/settings`, requestBody);
          handleCloseGameSettings();
        }
      } catch (error) {
        console.error("Failed to update game settings:", error);
      }
    };
    const handleCloseSettings = () => {
      // Discard the temporary state
      setTempSettings(settings);
      setTempCategories(settings.categories);
      handleCloseGameSettings();
    };
    return (
      <>
        {isHost ? (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              {/*Render editable fields for the host*/}
              {/*Categories Dropdown*/}
              <FormControl sx={{ minWidth: 300 }}>
                <InputLabel>Categories</InputLabel>
                <Select
                  multiple
                  value={tempCategories || []}
                  onChange={handleCategoryChange}
                  renderValue={(selected) => (selected as string[]).join(", ")}
                >
                  <MenuItem value={"City"}>City</MenuItem>
                  <MenuItem value={"Country"}>Country</MenuItem>
                  <MenuItem value={"Movie"}>Movie</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Max Rounds"
                value={tempSettings.maxRounds}
                onChange={(e) => handleInputChange(e, "maxRounds")}
                error={errors.maxRounds}
                helperText={errors.maxRounds ? "Can't be 0 or empty" : ""}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Voting Duration (seconds)"
                value={tempSettings.votingDuration}
                onChange={(e) => handleInputChange(e, "votingDuration")}
                error={errors.votingDuration}
                helperText={errors.votingDuration ? "Can't be 0 or empty" : ""}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Duration of a round (seconds)"
                value={tempSettings.inputDuration}
                onChange={(e) => handleInputChange(e, "inputDuration")}
                error={errors.inputDuration}
                helperText={errors.inputDuration ? "Can't be 0 or empty" : ""}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Duration to view scoreboard (seconds)"
                value={tempSettings.scoreboardDuration}
                onChange={(e) => handleInputChange(e, "scoreboardDuration")}
                error={errors.scoreboardDuration}
                helperText={errors.scoreboardDuration ? "Can't be 0 or empty" : ""}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Max number of players"
                value={tempSettings.maxPlayers}
                onChange={(e) => handleInputChange(e, "maxPlayers")}
                error={errors.maxPlayers}
                helperText={errors.maxPlayers ? "Can't be 0 or empty" : ""}
              />
            </Grid>
            <Grid item xs={12}>
              <CustomButton onClick={handleSaveSettings}>Save</CustomButton>
            </Grid>
          </Grid>
        ) : (
          <>
            {/* Render read-only info for other players*/}
            <Typography>Categories: {settings.categories.join(", ")}</Typography>
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
          <Dialog open={openGameSettings} onClose={handleCloseGameSettings}
            PaperProps={{
              sx: {
                width: "60%",
                maxWidth: "none",
                height: "60%",
                maxHeight: "none",
              }
            }}
          >
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

        <PlayerList players={players} hostView={isHost} kickPlayer={kickPlayer} />

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