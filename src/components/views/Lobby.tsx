import BackgroundImageLobby from "styles/views/BackgroundImageLobby";
import React, { useState, useEffect, useContext } from "react";
import { Spinner } from "../ui/Spinner";
import CustomButton from "components/ui/CustomButton";
import { useNavigate, useParams } from "react-router-dom";
import { Box, TextField, Typography, List, ListItem, Dialog, DialogActions, DialogContent, DialogTitle, DialogContentText } from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import IconButton from "@mui/material/IconButton";
import WebSocketContext from "../../contexts/WebSocketContext";
import { Message } from "@stomp/stompjs"

interface GameSettingsProps {
  isHost: boolean;
  settings: {
    setting1: string;
  };
  onSettingsChange: (newSettings: { setting1: string }) => void;
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
  const [lobbyCode, setLobbyCode] = useState("testCode");
  const { lobbyId } = useParams();
  const [settings, setSettings] = useState({
    setting1: "Example setting value",
  });

  /** Consuming Websocket Context
   * Context provides functions: connect, disconnect, subscribeClient, unsubscribeClient **/
  const { connect, disconnect, send, subscribeClient, unsubscribeClient } = useContext(WebSocketContext)

  /** On component Mount/Unmount**/
  useEffect(() => {
    // logic executed on mount
    handleIsHost();

    // logic executed on unmount
    return () => {
      disconnect()
    }
  }, []);

  /** WEBSOCKET STUFF **/
  // This useEffect is triggered as soon as the lobbyId param is set (or if it changes)
  // It checks that the lobbyId is not null, then calls functions from above (see line40)
  useEffect(() => {
    console.log("LOBBY ID CHANGED: " + lobbyId)
    if (lobbyId) {
      connect(lobbyId).then(() => {
        subscribeClient(
          `/topic/lobbies/${lobbyId}/players`,
          (message: Message) => {console.log("Received message: " + message.body)}
        )
      })
    }
  }, [lobbyId, connect, subscribeClient])

  const sendMessage = () => {
    const token = localStorage.getItem("token")
    send(`/app/lobbies/${lobbyId}/players/add`, JSON.stringify({ token }))
  }

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

  const handleLeaveGame = () => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      navigate(`/homepage/${userId}`);
    } else {
      console.error("User ID not found.");
      navigate("/login");
    }
  }

  const handleCopyLobbyCode = () => {
    sendMessage()
    navigator.clipboard.writeText(lobbyCode)
      .then(() => {
        console.log("Lobby code copied to clipboard");
      })
      .catch((error) => {
        console.error("Failed to copy lobby code to clipboard:", error);
      });
  };

  const GameSettings: React.FC<GameSettingsProps> = ({ isHost, settings, onSettingsChange }) => {
    return (
      <>
        {isHost ? (
          // Render editable fields for the host
          <TextField
            label="Setting 1"
            defaultValue={settings.setting1}
            onChange={(e) => onSettingsChange({ ...settings, setting1: e.target.value })}
          />
        ) : (
          // Render read-only info for other players
          <Typography>Setting 1: {settings.setting1}</Typography>
        )}
        {/* Repeat for other settings */}
      </>
    );
  };

  let content = <Spinner />;

  return (
    <BackgroundImageLobby>
      <Box sx={{
        display: "flex",
        position: "absolute",
        top: "2%",
        left: "85%",  
      }}>
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
              <GameSettings isHost={isHost} settings={settings} onSettingsChange={onSettingsChange} />
            </DialogContent>
            <DialogActions>
              <CustomButton onClick={handleCloseGameSettings}>Close</CustomButton>
            </DialogActions>
          </Dialog>
        </Box>
        {/*
        <CustomButton onClick={() => navigate(`/lobbies/${response.data.id}`)}>
            Instructions
    </CustomButton> */}
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
          <Typography variant="h4" gutterBottom
            sx={{
              fontFamily: "Londrina Solid",
              textAlign: "center",
            }}>
            Players
          </Typography>
          <List sx={{
            width: "100%",
          }}>
            {/* TODO: Add players */}
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
                {lobbyCode}
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
      </Box>
    </BackgroundImageLobby>
  );
};

export default Lobby;