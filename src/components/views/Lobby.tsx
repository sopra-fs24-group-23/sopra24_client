import BackgroundImageLobby from "components/ui/BackgroundImageLobby";
import React, { useState, useEffect, useContext, useRef } from "react";
import CustomButton from "components/ui/CustomButton";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../../helpers/api";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import TooltipContent from "components/ui/TooltipContent";
import {
  Box,
  TextField,
  Typography,
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
  Tooltip,
  IconButton,
  ToggleButton,
} from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import WebSocketContext from "../../contexts/WebSocketContext";
import { Message } from "@stomp/stompjs";
import UserContext from "../../contexts/UserContext";
import User from "../../models/User";
import PlayerList from "../ui/PlayerList";
import GameStateContext from "../../contexts/GameStateContext";
import GameSettingsContext from "../../contexts/GameSettingsContext";
import { isProduction } from "../../helpers/isProduction";
import ChatComponent from "./ChatComponent";
import ChatContext from "../../contexts/ChatContext";

interface GameSettings {
  categories: string[];
  isRandom: boolean;
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
  const navigate = useNavigate();
  const [openLeaveDialog, setOpenLeaveDialog] = useState(false);
  const [openGameSettings, setOpenGameSettings] = useState(false);
  const handleOpenGameSettings = () => setOpenGameSettings(true);
  const handleCloseGameSettings = () => setOpenGameSettings(false);
  const [isHost, setIsHost] = useState(false);
  const { lobbyId } = useParams();
  const [settings, setSettings] = useState<GameSettings>({
    categories: ["Country", "City", "Movie/Series", "Food", "Car"],
    isRandom: false,
    maxRounds: 5,
    votingDuration: 30,
    inputDuration: 60,
    scoreboardDuration: 30,
    maxPlayers: 4,
  });
  const [openHostLeftDialog, setOpenHostLeftDialog] = useState(false);
  const [openKickDialog, setOpenKickDialog] = useState(false);

  const gameStarting = useRef(false);
  const lobbyClosing = useRef(false);

  const { user } = useContext(UserContext);
  const { setGameStateVariable } = useContext(GameStateContext);
  const { connect, disconnect, send, subscribeClient, unsubscribeClient } = useContext(WebSocketContext);
  const { setGameSettingsVariable } = useContext(GameSettingsContext);
  const { connectChat } = useContext(ChatContext);

  const MAX_ROUNDS_LIMIT = 10;
  const MAX_VOTING_DURATION_LIMIT = 90;
  const MAX_INPUT_DURATION_LIMIT = 90;
  const MAX_SCOREBOARD_DURATION_LIMIT = 60;
  const MAX_PLAYERS_LIMIT = 10;


  useEffect(() => {
    if (lobbyId) {
      connect(lobbyId).then(() => {
        connectChat(lobbyId)
        subscribeClient(
          `/topic/lobbies/${lobbyId}/settings`,
          (message: Message) => {
            if (!isProduction) console.log("Received settings update:", message.body);
            const receivedSettings = JSON.parse(message.body);
            setSettings(receivedSettings);
            setGameSettingsVariable(receivedSettings);
          },
        );
        subscribeClient(
          `/topic/lobbies/${lobbyId}/players`,
          (message: Message) => {
            if (!isProduction) console.log(`Received PlayerList update: ${message.body}`);
            const receivedPlayers = JSON.parse(message.body);
            setPlayers(receivedPlayers);
          },
        );
        subscribeClient(
          `/topic/lobbies/${lobbyId}/errors`,
          (message: Message) => {
            alert(message.body);
          },
        );
        if (user) {
          subscribeClient(
            `/queue/lobbies/${lobbyId}/kick/${user.username}`,
            (message: Message) => {
              if (!isProduction) console.log(`Received kick message: ${message.body}`);
              setOpenKickDialog(true);
              //navigate("/homepage");
            },
          );
        }
        subscribeClient(
          `/topic/lobbies/${lobbyId}/close`,
          () => {
            lobbyClosing.current = true;
            //if (!isHost) alert("Sorry, the host has left the game! Returning you to the homepage.");
            //navigate("/homepage");
            alert("Sorry, the host has left or you are the only remaining player! Returning you to the homepage.")
            navigate("/homepage")
          },
        );
        subscribeClient(
          `/topic/games/${lobbyId}/state`,
          (message: Message) => {
            if (!isProduction) console.log(`Received GameState update: ${message.body}`);
            const receivedGameState = JSON.parse(message.body);
            setGameStateVariable(receivedGameState);
            if (receivedGameState.gamePhase === "SCOREBOARD") {
              gameStarting.current = true;
              navigate(`/lobbies/${lobbyId}/scoreboard`);
            }
          },
        );
        send(`/app/lobbies/${lobbyId}/update`);
      });
    }

    if (lobbyId && user) {
      const fetchHost = async () => {
        try {
          const response = await api.get(`/lobbies/${lobbyId}/host`);
          const host = new User(response.data);
          if (!isProduction) console.log(`MYDEBUG ${user.username} equals ${host.username}?`);
          if (user.username === host.username) {
            if (!isProduction) console.log("MYDEBUG SETTING ISHOST TRUE");
            setIsHost(true);
          } else {
            if (!isProduction) console.log("MYDEBUG SETTING ISHOST FALSE");
            setIsHost(false);
          }
        } catch (e) {
          alert("Could not fetch lobby-host, returning to homepage.");
          navigate("/homepage");
        }
      };
      fetchHost();
    }
  }, [user]);

  useEffect(() => {
    return () => {
      if (!gameStarting.current) {
        const token = localStorage.getItem("token");
        if (!lobbyClosing.current) send(`/app/lobbies/${lobbyId}/leave`, JSON.stringify({ token }));
        unsubscribeClient(`/topic/lobbies/${lobbyId}/players`);
        unsubscribeClient(`/topic/games/${lobbyId}/state`);
        disconnect();
      }
    };
  }, []);

  const handleOpenHostLeftDialog = () => {
    setOpenHostLeftDialog(true);
  }

  const handleCloseHostLeftDialog = () => {
    setOpenHostLeftDialog(false);
    navigate("/homepage");
  }

  const handleOpenDialog = () => {
    setOpenLeaveDialog(true);
  };
  const handleCloseDialog = () => {
    setOpenLeaveDialog(false);
  };
  const handleStartGame = async () => {
    try {
      gameStarting.current = true;
      send(`/app/games/${lobbyId}/start`, {});
    } catch (error) {
      if (!isProduction) console.error("Failed to start the game:", error);
    }
  };
  const handleLeaveGame = () => {
    if (isHost) {
      send(`/app/lobbies/${lobbyId}/delete`);
    }
    navigate("/homepage");
  };
  const handleCopyLobbyCode = () => {
    navigator.clipboard.writeText(localStorage.getItem("lobbyCode"))
      .then(() => {
        if (!isProduction) console.log("Lobby code copied to clipboard");
      })
      .catch((error) => {
        if (!isProduction) console.error("Failed to copy lobby code to clipboard:", error);
      });
  };

  const kickPlayer = (usernameToKick: string) => {
    const token = localStorage.getItem("token");
    if (token) {
      send(`/app/lobbies/${lobbyId}/kick/${usernameToKick}`, JSON.stringify({ token }));
    }
  };

  const [scroll, setScroll] = useState<"paper" | "body">("paper");

  const GameSettings: React.FC<GameSettingsProps> = ({ isHost, settings, onSettingsChange }) => {
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
    const handleToggle = () => {
      setTempSettings({ ...tempSettings, isRandom: !tempSettings.isRandom });
    };
    const handleCategoryChange = (event: SelectChangeEvent<string[]>) => {
      let newCategories = event.target.value as string[];
      if (newCategories.length === 0) {
        newCategories = ["Country", "City", "Movie/Series"];
      }
      setTempCategories(newCategories);
    };
    const handleSaveSettings = async () => {
      try {
        const newErrors = {
          maxRounds: tempSettings.maxRounds.toString() === "" || tempSettings.maxRounds === 0 || tempSettings.maxRounds > MAX_ROUNDS_LIMIT,
          votingDuration: tempSettings.votingDuration.toString() === "" || tempSettings.votingDuration === 0 || tempSettings.votingDuration > MAX_VOTING_DURATION_LIMIT,
          inputDuration: tempSettings.inputDuration.toString() === "" || tempSettings.inputDuration === 0 || tempSettings.inputDuration > MAX_INPUT_DURATION_LIMIT,
          scoreboardDuration: tempSettings.scoreboardDuration.toString() === "" || tempSettings.scoreboardDuration === 0 || tempSettings.scoreboardDuration > MAX_SCOREBOARD_DURATION_LIMIT,
          maxPlayers: tempSettings.maxPlayers.toString() === "" || tempSettings.maxPlayers < 2 || tempSettings.maxPlayers > MAX_PLAYERS_LIMIT,
        };
        setErrors(newErrors);
        if (!Object.values(newErrors).includes(true)) {
          const newSettings = { ...tempSettings, categories: tempCategories };
          onSettingsChange(newSettings);
          setSettings(newSettings);
          const requestBody = JSON.stringify(newSettings);
          send(`/app/lobbies/${lobbyId}/settings`, requestBody);
          handleCloseGameSettings();
        } else {
          alert("Some settings exceed allowed limits. Please adjust them.");
        }
      } catch (error) {
        if (!isProduction) console.error("Failed to update game settings:", error);
      }
    };
    const handleCloseSettings = () => {
      setTempSettings(settings);
      setTempCategories(settings.categories);
      handleCloseGameSettings();
    };

    return (
      <>
        {isHost ? (
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={6}>
              <Typography variant="body1" sx={{ color: "text.secondary", fontSize: "0.775rem" }}>Categories</Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                <FormControl fullWidth sx={{ minWidth: 300 }}>
                  <Select
                    multiple
                    value={tempCategories || []}
                    onChange={handleCategoryChange}
                    disabled={tempSettings.isRandom}
                    renderValue={(selected) => (selected as string[]).join(", ")}
                  >
                    <MenuItem value={"City"}>City</MenuItem>
                    <MenuItem value={"Country"}>Country</MenuItem>
                    <MenuItem value={"Movie/Series"}>Movie/Series</MenuItem>
                    <MenuItem value={"Animal"}>Animal</MenuItem>
                    <MenuItem value={"Celebrity"}>Celebrity</MenuItem>
                    <MenuItem value={"Food"}>Food</MenuItem>
                    <MenuItem value={"Car"}>Car</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Grid>
            <Grid item xs={6} sx={{ display: "flex", alignItems: "center", justifyContent: "flex-start" }}>
              <Tooltip title={"Random categories each round!"}>
                <ToggleButton
                  value="randomize"
                  selected={tempSettings.isRandom}
                  onChange={() => {
                    handleToggle();
                  }}
                  sx={{ height: "fit-content", whiteSpace: "nowrap" }}
                >
                  Randomize
                </ToggleButton>
              </Tooltip>
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Max Rounds"
                value={tempSettings.maxRounds}
                inputProps={{ maxLength: 20 }}
                onChange={(e) => handleInputChange(e, "maxRounds")}
                error={errors.maxRounds}
                helperText={errors.maxRounds ? "Can't be 0, empty or exceed " + MAX_ROUNDS_LIMIT : ""}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Time-limit for voting (seconds)"
                value={tempSettings.votingDuration}
                inputProps={{ maxLength: 20 }}
                onChange={(e) => handleInputChange(e, "votingDuration")}
                error={errors.votingDuration}
                helperText={errors.votingDuration ? "Can't be 0, empty or exceed " + MAX_VOTING_DURATION_LIMIT : ""}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Time-limit for answering (seconds)"
                value={tempSettings.inputDuration}
                inputProps={{ maxLength: 20 }}
                onChange={(e) => handleInputChange(e, "inputDuration")}
                error={errors.inputDuration}
                helperText={errors.inputDuration ? "Can't be 0, empty or exceed " + MAX_INPUT_DURATION_LIMIT : ""}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Duration to view scoreboard (seconds)"
                value={tempSettings.scoreboardDuration}
                inputProps={{ maxLength: 20 }}
                onChange={(e) => handleInputChange(e, "scoreboardDuration")}
                error={errors.scoreboardDuration}
                helperText={errors.scoreboardDuration ? "Can't be 0, empty or exceed " + MAX_SCOREBOARD_DURATION_LIMIT : ""}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Max number of players"
                value={tempSettings.maxPlayers}
                inputProps={{ maxLength: 20 }}
                onChange={(e) => handleInputChange(e, "maxPlayers")}
                error={errors.maxPlayers}
                helperText={errors.maxPlayers ? "Can't be less than 2, empty or exceed " + MAX_PLAYERS_LIMIT : ""}
              />
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <CustomButton onClick={handleSaveSettings}>Save</CustomButton>
                <CustomButton onClick={handleCloseSettings}>Close</CustomButton>
              </Box>
            </Grid>
          </Grid>
        ) : (
          <>
            <Typography>The host has set the following game settings:</Typography>
            <br />
            <Typography>Categories: {settings.isRandom ? "Randomized" : settings.categories.join(", ")}</Typography>
            <Typography>Max Rounds: {settings.maxRounds}</Typography>
            <Typography>Time-limit to vote (seconds): {settings.votingDuration}</Typography>
            <Typography>Time-limit to answer (seconds): {settings.inputDuration}</Typography>
            <Typography>Duration to view scoreboard (seconds): {settings.scoreboardDuration}</Typography>
            <Typography>Max number of players: {settings.maxPlayers}</Typography>
            <br />
            <Box sx={{ display: "flex", justifyContent: "flex-start", gap: "10px", marginRight: "20px" }}>
              <CustomButton onClick={handleCloseSettings}>Close</CustomButton>
            </Box>
          </>
        )}
      </>
    );
  };

  return (
    <BackgroundImageLobby>
      <Box sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "20px",
        backgroundColor: "rgba(224, 224, 224, 0.9)",
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
          style={{ width: "auto", height: "200px", marginTop: "-10px" }} />
        <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <Tooltip title={<TooltipContent />} placement="bottom" arrow>
            <IconButton
              sx={{
                fontFamily: "Londrina Solid",
                backgroundColor: "#f8f8f8", // button color
                color: "black", // text color
                borderColor: "black",
                borderWidth: "1px",
                borderStyle: "solid",
                fontSize: "16px",
                fontWeight: "bold",
                textTransform: "uppercase",
                boxShadow: "0px 4px 3px -2px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12)", // This is the Material-UI default, adjust to match mockup
                //boxShadow: '2px 2px 10px rgba(0,0,0,0.1)',
                borderRadius: "20px",
                padding: "6px 16px"
              }}
            >
              <HelpOutlineIcon />
            </IconButton>
          </Tooltip>
          <CustomButton
            onClick={handleOpenDialog}
            sx={{
              backgroundColor: "#ffffff",
              "&:hover": {
                backgroundColor: "red",
              },
            }}
          >
            Leave Game
          </CustomButton>
        </Box>
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

      <Box sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        width: "90%",
        height: "77%",
        margin: "auto",
      }}>
        {/* Main box */}
        <Box sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: "rgba(224, 224, 224, 0.9)",
          borderColor: "black",
          borderWidth: "2px",
          borderStyle: "solid",
          padding: "20px",
          borderRadius: "27px",
          boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
          width: "35%",
          maxWidth: "500px",
          height: "90%",
          //margin: "auto",
          position: "relative",
          paddingTop: "15px",
          paddingBottom: "10px",
          marginRight: "20px",
        }}>
          <Box sx={{
            display: "flex",
            justifyContent: "flex-end",
            width: "100%",
            position: "relative",
            marginBottom: "10px",
          }}>
            <CustomButton onClick={handleOpenGameSettings}>
              <SettingsIcon />
            </CustomButton>
            <Dialog open={openGameSettings} onClose={handleCloseGameSettings} scroll={scroll} fullWidth={false}
              fullScreen={false}
              PaperProps={{
                sx: {
                  width: isHost ? "800px" : "auto",
                  maxWidth: isHost ? "none" : "400px",
                  minWidth: isHost ? "80%" : "none",
                  height: isHost ? "60%" : "auto",
                  maxHeight: "none",
                  overflow: isHost ? "hidden" : "none",
                }
              }}
            >
              <DialogTitle>Game Settings</DialogTitle>
              <DialogContent dividers={scroll === "paper"}>
                <Box sx={{ minWidth: "600px", height: isHost ? "500px" : "auto", overflowY: "auto", overflowX: "auto" }}>
                  <GameSettings isHost={isHost} settings={settings} onSettingsChange={setSettings} />
                </Box>
              </DialogContent>
            </Dialog>
          </Box>

          <PlayerList players={players} hostView={isHost} kickPlayer={kickPlayer} />

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
              margin: "10px auto",
              padding: "20px",
              borderRadius: "40px",
              boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
              position: "relative",
              top: "-5%",
            }}>
              <Typography variant="h6" gutterBottom
                sx={{
                  fontFamily: "Londrina Solid",
                  textAlign: "center",
                  position: "relative",
                  top: "30%",
                }}
              >
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
                  }}
                >
                  {lobbyId}
                </Typography>
                <IconButton onClick={handleCopyLobbyCode} size="large">
                  <ContentCopyIcon />
                </IconButton>
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
        <Box>
          <ChatComponent lobbyId={lobbyId} />
        </Box>
      </Box>
      <Dialog open={openHostLeftDialog} onClose={handleCloseHostLeftDialog}>
        <DialogTitle>Lobby closed</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Sorry, either the host left or you are the only remaining player! Redirecting to homepage.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <CustomButton onClick={handleCloseHostLeftDialog}>OK</CustomButton>
        </DialogActions>
      </Dialog>
      <Dialog open={openKickDialog} onClose={() => setOpenKickDialog(false)}>
        <DialogTitle>Ups, this is awkward...</DialogTitle>
        <DialogContent>
          <DialogContentText>You were kicked from the lobby. Returning you to the homepage.</DialogContentText>
        </DialogContent>
        <DialogActions>
          <CustomButton onClick={() => {
            setOpenKickDialog(false);
            navigate("/homepage");
          }}>OK</CustomButton>
        </DialogActions>
      </Dialog>
    </BackgroundImageLobby>
  );
};

export default Lobby;
