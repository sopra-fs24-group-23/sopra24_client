import React, { useContext, useEffect, useState } from "react";
import { api, handleError } from "helpers/api";
//import { Button } from "components/ui/Button";
import { useNavigate, useParams } from "react-router-dom";
//import BaseContainer from "components/ui/BaseContainer";
import "styles/views/Game.scss";
//import { User } from "types";
import HomepageBackgroundImage from "styles/views/HomepageBackgroundImage";
import CustomButton from "components/ui/CustomButton";
import { Box, TextField, IconButton, Typography, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import UserContext from "../../contexts/UserContext";
import { styled } from "@mui/system";

const Homepage = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [username, setUsername] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isHost, setIsHost] = useState(false);
  const [isErrorDialogOpen, setIsErrorDialogOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { user } = useContext(UserContext)
  const [openJoinLobbyDialog, setOpenJoinLobbyDialog] = useState(false);
  const [inputLobbyId, setInputLobbyId] = useState("");

  // Currently not used because starts flickering when entering something in textfield
  const CustomDialog = styled(Dialog)(({ theme }) => ({
    "& .MuiDialogTitle-root": {
      fontFamily: "Londrina Solid",
    },
    /*"& .MuiDialogContent-root": {
      fontFamily: "Londrina Solid",
    },
    "& .MuiDialogContentText-root": {
      fontFamily: "Londrina Solid",
    },
    ".MuiDialog-root": {
      position: "fixed !important",
    },*/
  }));

  const logout = async () => {
    const token = localStorage.getItem("token");
    console.log(token);
    await api.post("/logout", { token: token });

    localStorage.removeItem("token");
    navigate("/login");
    console.log(localStorage.getItem("token"));
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };
  const saveUpdate = async () => {
    try {
      const response = await api.put("/users/" + user.id, { username: username });
      setProfile({ ...profile, username: username }); // Update local profile state
      alert("Username updated successfully!");
    } catch (error) {
      console.error(`Failed to update username: ${error}`);
      // Default error message
      let message = "An unexpected error occured. Please try again.";

      // If the Backend sends a specific error message, use it
      if (error.response && error.response.data && error.response.data.message) {
        message = error.response.data.message;
      }
      setErrorMessage(message);
      setIsErrorDialogOpen(true);
    }
  };

  // Handle save after editing
  const handleSaveClick = () => {
    saveUpdate();
    setIsEditing(false); // set editing to false to switch back to display mode
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
      console.log(lobbyId);
      localStorage.setItem("isHost", "true");
      localStorage.setItem("lobbyCode", lobbyId);

      // Navigate to the game room using the game ID from the response
      navigate(`/lobbies/${response.data.id}`);
    } catch (error) {
      console.error(`Creating game failed: ${error}`);
      alert("Failed to create game. Please try again.");
    }
  };

  const handleJoinLobbyOpenDialog = () => {
    setOpenJoinLobbyDialog(true);
  }

  const handleJoinLobbyCloseDialog = () => {
    setOpenJoinLobbyDialog(false);
  }

  const joinLobby = async () => {
    try {

      if (!inputLobbyId) {
        alert("Please enter lobby ID.");
        return
      }

      // check that the lobby-id is valid, then navigate to lobby
      await api.get(`/lobbies/${inputLobbyId}`).then(() => {
        navigate(`/lobbies/${inputLobbyId}`)
      })

    } catch (error) {
      console.error(`Joining lobby failed: ${error}`);
      alert("Failed to join lobby. Please check the lobby ID and try again.");
    }
  };

  useEffect(() => {
    async function fetchData() {
      try {
        let id = localStorage.getItem("id");
        console.log("THE ID IS")
        const response = await api.get("/users/" + id);
        setProfile(response.data);
      } catch (error) {
        console.error(`Something went wrong while fetching the user: \n${handleError(error)}`);
        console.error("Details:", error);
        alert("Something went wrong while fetching the user! See the console for details.");
      }
    }
    fetchData()
  }, [user]);

  return (
    <HomepageBackgroundImage>
      <Box sx={{
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "center",
        padding: "20px",
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
        top: 30,
        marginBottom: "30px",
      }}>
        <img src="/Images/logo.png" alt="Descriptive Text" style={{ width: "auto", height: "200px", marginTop: "100px" }} />
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
        top: 30,
      }}>
        {/* Player's Name */}
        {profile && (
          <Typography variant="h2" gutterBottom
            sx={{
              fontFamily: "Londrina Solid",
              textAlign: "center",
              fontSize: "3rem", // Increase font size
              marginTop: "1rem", // Add margin at the top
            }}>
            {isEditing ? (
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                <TextField
                  value={username || ""}
                  onChange={(e) => setUsername(e.target.value)}
                  style={{ fontSize: "2rem", marginRight: "10px" }} // Ensure the input font size is large as well
                />
                <IconButton onClick={handleSaveClick}>
                  <SaveIcon />
                </IconButton>
              </Box>
            ) : (
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "left" }}>
                {profile.username}
                <EditIcon onClick={handleEditClick} sx={{ marginLeft: "10px", cursor: "pointer" }} />
              </Box>
            )}
          </Typography>
        )}
        {/* User statistics */}
        {profile && (
          <div className="user-stats">
            <Box sx={{
              display: "flex",
              justifyContent: "right",
              width: "100%",
              my: 2,
              //position: "absolute",
              //top: "15%",
              //left: "85%",
            }}>
              <CustomButton onClick={goToLeaderboards}>Leaderboards</CustomButton>
            </Box>

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
                  {profile.pointsScored}</Typography>
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
    </HomepageBackgroundImage>
  );
};

const statBoxStyle = {
  backgroundColor: "#e0e0e0",
  borderColor: "black",
  borderWidth: "2px",
  borderStyle: "solid",
  //width: "60%", // Adjust width for horizontal layout
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