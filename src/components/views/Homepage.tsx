import React, { useContext, useEffect, useState } from "react";
import { api, handleError } from "helpers/api";
import { isProduction } from "../../helpers/isProduction";
import { getNextScore, getNextScoreString } from "../../helpers/getNextScore";
import { useNavigate } from "react-router-dom";
import "styles/views/Game.scss";
import HomepageBackgroundImage from "components/ui/HomepageBackgroundImage";
import CustomButton from "components/ui/CustomButton";
import {
  Box,
  TextField,
  IconButton,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Tooltip,
  Grid
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import UserContext from "../../contexts/UserContext";
import ProgressBarContainer from "../ui/ProgressBarContainer";
import ColorPicker from "../ui/ColorPicker";
import ChatContext from "../../contexts/ChatContext";

const Homepage = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [username, setUsername] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { user } = useContext(UserContext);
  const { resetChat } = useContext(ChatContext);
  const [inputLobbyId, setInputLobbyId] = useState("");
  const [color, setColor] = useState("#000000");

  /* Dialogs */
  const [openJoinLobbyDialog, setOpenJoinLobbyDialog] = useState(false);
  const [isUsernameUpdateDialogOpen, setIsUsernameUpdateDialogOpen] = useState(false);
  const [isFailedCreateGameDialogOpen, setIsFailedCreateGameDialogOpen] = useState(false);
  const [isErrorDialogOpen, setIsErrorDialogOpen] = useState(false);
  const [openJoinLobbyErrorDialog, setOpenJoinLobbyErrorDialog] = useState(false);
  const [openAlertDialog, setOpenAlertDialog] = useState(false);
  const [openLobbyFullOrRunning, setOpenLobbyFullOrRunning] = useState(false);

  useEffect(() => {
    resetChat()
  }, []);

  const logout = async () => {
      const token = localStorage.getItem("token");
      //console.log(token);
      await api.post("/logout", { token: token });

      localStorage.removeItem("token");
      navigate("/login");
      //console.log(localStorage.getItem("token"));
  };

  const handleEditClick = () => {
    setUsername(profile.username); // The current username is displayed in the textfield
    setIsEditing(true);
  };

  const saveUpdate = async () => {
    try {
      await api.put("/users/" + user.id, { username: username, color: color });
      user.username = username
      user.color = color
      setProfile({ ...profile, username: username, color: color }); // Update local profile state
      setIsUsernameUpdateDialogOpen(true);
    } catch (error) {
      if (!isProduction) console.error(`Failed to update username: ${error}`);
      // Default error message
      let message = "An unexpected error occured. Please try again.";

      // If the Backend sends a specific error message, use it --> DOESN'T WORK IN PRD!!!!!!!
      //if (error.response && error.response.data.message) {
      //  message = error.response.data.message;
      //}
      // If status code 400, username can't be empty
      if (error.response && error.response.status === 400) {
        message = "The username cannot be empty. Please try again.";
      } else if (error.response && error.response.status === 409) {
        message = "This username is already taken. Please choose a different username.";
      }
      setErrorMessage(message);
      setIsErrorDialogOpen(true);
    }
  };

  // Handle save after editing
  const handleSaveClick = () => {
    saveUpdate();
    setIsEditing(false);
  };

  // Let the user cancel the edit process if they don't wish to save the changes
  const handleCancelClick = () => {
    setUsername(profile.username);
    setIsEditing(false);
  };

  const goToLeaderboards = () => {
    navigate("/leaderboards");
  };

  const createLobby = async () => {
    try {
      // get token from localstorage
      const token = localStorage.getItem("token");
      // create lobby
      const requestBody = JSON.stringify({ token });
      const response = await api.post("/lobbies", requestBody);
      const lobbyId = await response.data.id;
      //console.log(lobbyId);
      //localStorage.setItem("isHost", "true");
      localStorage.setItem("lobbyCode", lobbyId);

      // Navigate to the game room using the game ID from the response
      navigate(`/lobbies/${response.data.id}`);
    } catch (error) {
      if (!isProduction) console.error(`Creating game failed: ${error}`);
      //alert("Failed to create game. Please try again.");
      setIsFailedCreateGameDialogOpen(true);
    }
  };

  const joinLobby = async () => {
    try {
      if (!inputLobbyId) {
        alert("Please enter lobby ID.");

        return;
      }

      // check that the lobby-id is valid, then navigate to lobby
      await api.get(`/lobbies/${inputLobbyId}`).then(async () => {
        try {
          const token = localStorage.getItem("token");
          const requestBody = JSON.stringify({ token });
          await api.post(`/lobbies/${inputLobbyId}/join`, requestBody);
          navigate(`/lobbies/${inputLobbyId}`);
        } catch (e) {
          if (e.response.status === 409) {
            setOpenLobbyFullOrRunning(true);
          } else {
            handleError(e);
          }
        }
      });

    } catch (error) {
      if (!isProduction) console.error(`Joining lobby failed: ${error}`);
      //alert("Failed to join lobby. Please check the lobby ID and try again.");
      setOpenJoinLobbyErrorDialog(true);
    }
  };

  useEffect(() => {
    async function fetchData() {
      try {
        let id = localStorage.getItem("id");
        let token = localStorage.getItem("token");
        if (!isProduction) console.log("THE ID IS" + id);
        const response = await api.get("/users/" + id, {
          headers: {
            "token": `${token}`
          }
        });
        setProfile(response.data);
        setColor(response.data.color);
      } catch (error) {
        if (!isProduction) console.error(`Something went wrong while fetching the user: \n${handleError(error)}`);
        if (!isProduction) console.error("Details:", error);
        //alert("Something went wrong while fetching the user! See the console for details.");
        setOpenAlertDialog(true);
      }
    }

    fetchData();
  }, [user]);

  return (
    <HomepageBackgroundImage>
      {/* Top bar */}
      <Box sx={{
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "center",
        padding: "20px",
        backgroundColor: "rgba(224, 224, 224, 0.9)",
        borderColor: "black",
        borderWidth: "2px",
        borderStyle: "solid",
        borderRadius: "27px",
        boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
        height: "50px",
        position: "fixed",
        top: 40,
        left: 40,
        right: 40,
        zIndex: 1000,
      }}>
        <img src="/Images/logo.png" alt="Descriptive Text"
          style={{ width: "auto", height: "200px"}} />
        <CustomButton sx={{ marginLeft: "auto" }} onClick={() => navigate("/instructions")}>Instructions</CustomButton>
        <CustomButton sx={{ marginLeft: "15px" }} onClick={logout}>Logout</CustomButton>
      </Box>
      {/*Outer box*/}
      <Box sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "left",
        //height: "50vh", // Use viewport height to fill the screen
        width: "80vw",
        padding: "20px",
        backgroundColor: "rgba(224, 224, 224, 0.9)", // Semi-transparent grey
        borderColor: "black",
        borderWidth: "2px",
        borderStyle: "solid",
        borderRadius: "27px",
        boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
        //width: "100%",
        maxWidth: "800px",
        // height: "70%",
        margin: "auto",
        position: "relative",
        top: 80,
        marginTop: "100px",
        zIndex: 1, // ensure grey box is below the top bar
      }}>
        {/* Player's Name */}
        {profile && (
          <Typography variant="h2" gutterBottom
            sx={{
              fontFamily: "Londrina Solid",
              textAlign: "center",
              fontSize: "3rem", // Increase font size
              marginTop: "1rem", // Add margin at the top
              color: color,
            }}>
            <Dialog
              open={isUsernameUpdateDialogOpen}
              onClose={() => setIsUsernameUpdateDialogOpen(false)}
            >
              <DialogTitle>{"Profile Update"}</DialogTitle>
              <DialogContent>
                <DialogContentText>Changes successfully saved!</DialogContentText>
              </DialogContent>
              <DialogActions>
                <CustomButton onClick={() => setIsUsernameUpdateDialogOpen(false)}>Close</CustomButton>
              </DialogActions>
            </Dialog>
            {isEditing ? (
              <Grid container alignItems="center" justifyContent="center">
                <Grid item>
                  {/*<Box sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>*/}
                  <TextField
                    label="Username"
                    value={username || ""}
                    onChange={(e) => setUsername(e.target.value)}
                    inputProps={{ maxLength: 15 }}
                    sx={{
                      "& label": {
                        fontFamily: "Londrina Solid, cursive",
                      },
                      "& input": {
                        fontFamily: "Londrina Solid, cursive"
                      },
                    }}
                  />
                </Grid>
                <Grid item>
                  <Box sx={{ display: "flex", flexDirection: "row", alignItems: "flex-start" }}>
                    <ColorPicker score={profile.totalScore} color={color} setColor={setColor} />
                    <Tooltip title="You can change the color of how your username is displayed
                      on the Leaderboard. Unlock the next color by continuing playing Global Guess!"
                    >
                      <InfoOutlinedIcon sx={{ marginLeft: "10px" }} />
                    </Tooltip>
                  </Box>
                </Grid>
                <Grid item>
                  <Tooltip title="Save">
                    <IconButton disabled={!username} onClick={handleSaveClick}>
                      <SaveIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Exit">
                    <IconButton onClick={handleCancelClick}>
                      <CloseIcon />
                    </IconButton>
                  </Tooltip>
                </Grid>
              </Grid>
            ) : (
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "left" }}>
                <Typography variant="h4" style={{ color: color, fontFamily: "Londrina Solid" }}>
                  {profile.username}
                </Typography>
                <Tooltip title="Edit">
                  <EditIcon onClick={handleEditClick} sx={{ marginLeft: "10px", cursor: "pointer" }} />
                </Tooltip>
              </Box>
            )}
          </Typography>
        )}
        {/* Progress bar*/}
        {profile && (
          <>
            <Typography variant="h6" gutterBottom
              sx={{
                fontFamily: "Londrina Solid",
                textAlign: "left",
                marginTop: "1rem", // Add margin at the top
              }}>
              {profile && `${getNextScoreString(profile.totalScore)}`}
              <Tooltip title="By entering the next level you receive a new color to display your username!">
                <InfoOutlinedIcon sx={{ marginLeft: "10px" }} />
              </Tooltip>
            </Typography>
            <Box sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%", // Ensure it spans the full width of its container
              marginBottom: "15px", // Adds a bottom margin
            }}>
              <ProgressBarContainer currentPoints={profile.totalScore} totalPoints={
                getNextScore(profile.totalScore) === null ? profile.totalScore : getNextScore(profile.totalScore)} />
              <CustomButton onClick={goToLeaderboards} sx={{ marginRight: "10px" }}>Leaderboards</CustomButton>
            </Box>
          </>
        )}
        {/* User statistics */}
        {profile && (
          <div className="user-stats">
            <Box sx={{
              display: "flex",
              justifyContent: "center",
              width: "100%",
            }}>
              <Box sx={statBoxStyle}>
                <Typography variant="h4" gutterBottom
                  sx={{
                    fontFamily: "Londrina Solid",
                    textAlign: "center",
                  }}>
                  Games Played
                </Typography>
                <Typography variant="h5" gutterBottom
                  sx={{
                    fontFamily: "Londrina Solid",
                    textAlign: "center",
                  }}>
                  {profile.gamesPlayed}</Typography>
              </Box>
              {/* Individual box for "Points Scored" */}
              <Box sx={statBoxStyle}>
                <Typography variant="h4" gutterBottom
                  sx={{
                    fontFamily: "Londrina Solid",
                    textAlign: "center",
                  }}>
                  Points Scored
                </Typography>
                <Typography variant="h5" gutterBottom
                  sx={{
                    fontFamily: "Londrina Solid",
                    textAlign: "center",
                  }}>
                  {profile.totalScore}</Typography>
              </Box>
              {/* Individual box for "Games Won" */}
              <Box sx={statBoxStyle}>
                <Typography variant="h4" gutterBottom
                  sx={{
                    fontFamily: "Londrina Solid",
                    textAlign: "center",
                  }}>
                  Games Won
                </Typography>
                <Typography variant="h5" gutterBottom
                  sx={{
                    fontFamily: "Londrina Solid",
                    textAlign: "center",
                  }}>
                  {profile.gamesWon}</Typography>
              </Box>
            </Box>
          </div>
        )}
        {/* Action buttons */}
        <Box sx={{
          display: "flex",
          width: "100%",
          justifyContent: "space-around",
          my: 2,
        }}>
          <CustomButton onClick={createLobby}>Create Lobby</CustomButton>
          <CustomButton onClick={() => setOpenJoinLobbyDialog(true)}>Join Lobby</CustomButton>
        </Box>
      </Box>
      {/* Dialog for error messages */}
      <Dialog
        open={isErrorDialogOpen}
        onClose={() => setIsErrorDialogOpen(false)}
      >
        <DialogTitle>{"Error updating username"}</DialogTitle>
        <DialogContent>
          <DialogContentText>{errorMessage}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <CustomButton onClick={() => setIsErrorDialogOpen(false)}> Okay</CustomButton>
        </DialogActions>
      </Dialog>
      <Dialog open={openJoinLobbyDialog} onClose={() => setOpenJoinLobbyDialog(false)}>
        <DialogTitle>Join a Lobby</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Enter the ID of the lobby you wish to join:
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="lobbyId"
            label="Lobby ID"
            type="text"
            fullWidth
            value={inputLobbyId}
            onChange={(e) => setInputLobbyId(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <CustomButton onClick={() => setOpenJoinLobbyDialog(false)}>Cancel</CustomButton>
          <CustomButton onClick={joinLobby}>Join</CustomButton>
        </DialogActions>
      </Dialog>
      <Dialog open={openLobbyFullOrRunning} onClose={() => setOpenLobbyFullOrRunning(false)}>
        <DialogTitle>Lobby Full or Running</DialogTitle>
        <DialogContent>
          <DialogContentText>The lobby is either full or the game has already started. Please try another lobby.</DialogContentText>
        </DialogContent>
        <DialogActions>
          <CustomButton onClick={() => setOpenLobbyFullOrRunning(false)}>OK</CustomButton>
        </DialogActions>
      </Dialog>
      {/* Dialog for 'Failed to create Game' */}
      <Dialog
        open={isFailedCreateGameDialogOpen}
        onClose={() => setIsFailedCreateGameDialogOpen(false)}
      >
        <DialogTitle>{"Failed to Create Game"}</DialogTitle>
        <DialogContent>
          <DialogContentText>Game creation failed. Please try again.</DialogContentText>
        </DialogContent>
        <DialogActions>
          <CustomButton onClick={() => setIsFailedCreateGameDialogOpen(false)}>Close</CustomButton>
        </DialogActions>
      </Dialog>
      <Dialog
        open={openJoinLobbyErrorDialog}
        onClose={() => setOpenJoinLobbyErrorDialog(false)}
      >
        <DialogTitle>{"Error"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Failed to join lobby. Please check the lobby ID and try again.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <CustomButton onClick={() => setOpenJoinLobbyErrorDialog(false)}>Close</CustomButton>
        </DialogActions>
      </Dialog>
      <Dialog
        open={openAlertDialog}
        onClose={() => setOpenAlertDialog(false)}
      >
        <DialogTitle>{"Error"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            There was an error fetching the user, you might need to log-in or register again.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <CustomButton onClick={() => setOpenAlertDialog(false)}>Close</CustomButton>
        </DialogActions>
      </Dialog>
    </HomepageBackgroundImage>
  );
};

const statBoxStyle = {
  backgroundColor: "#e0e0e0",
  borderColor: "black",
  borderWidth: "2px",
  borderStyle: "solid",
  width: "30%", // Adjust width for horizontal layout
  padding: "20px",
  borderRadius: "10px",
  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  //height: "20%",
  margin: "0 10px",
  //position: "relative",
};

export default Homepage;