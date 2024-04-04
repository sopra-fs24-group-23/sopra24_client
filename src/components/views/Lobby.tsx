import BackgroundImageLobby from "styles/views/BackgroundImageLobby";
import React, { useState, useEffect } from "react";
import { Spinner } from "../ui/Spinner";
import CustomButton from "components/ui/CustomButton";
import { useNavigate, useParams } from "react-router-dom";
import { Box, TextField, Typography, List, ListItem, Dialog, DialogActions, DialogContent, DialogTitle, DialogContentText } from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";

interface GameSettingsProps {
  isHost: boolean;
  settings: {
    setting1: string;
  };
  onSettingsChange: (newSettings: { setting1: string }) => void;
}

const Lobby = () => {
  const { lobbyId } = useParams();
  const [players, setPlayers] = useState([]);
  const [lobbyDetails, setLobbyDetails] = useState(null);
  const navigate = useNavigate();
  const [openLeaveDialog, setOpenLeaveDialog] = useState(false);
  const [openGameSettings, setOpenGameSettings] = useState(false);
  const handleOpenGameSettings = () => setOpenGameSettings(true);
  const handleCloseGameSettings = () => setOpenGameSettings(false);
  const [isHost, setIsHost] = useState(false);

  const [settings, setSettings] = useState({
    setting1: 'Example setting value',
  });

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

  const GameSettings: React.FC<GameSettingsProps> = ({ isHost, settings, onSettingsChange }) => {
    return (
      <>
      {isHost ? (
        // Render editable fields for the host
        <TextField
          label="Setting 1"
          defaultValue={settings.setting1}
          onChange={(e) => onSettingsChange({...settings, setting1: e.target.value})}
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

  useEffect(() => {
    handleIsHost();
  }, []);


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
        justifyContent: "center",
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
      }}>
        <CustomButton onClick={handleOpenGameSettings}>
          <SettingsIcon/>
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
          top: "-8%",
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
          </List>
        </Box>
      </Box>
    </BackgroundImageLobby>
  );
};

export default Lobby;