import React, { useEffect, useState } from "react";
import { api, handleError } from "helpers/api";
//import { Button } from "components/ui/Button";
import { useNavigate, useParams } from "react-router-dom";
//import BaseContainer from "components/ui/BaseContainer";
import "styles/views/Game.scss";
//import { User } from "types";
import HomepageBackgroundImage from "styles/views/HomepageBackgroundImage";
import CustomButton from "components/ui/CustomButton";
import { Box, TextField, IconButton, Typography } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";

const Homepage = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const { id } = useParams();
  const [username, setUsername] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isHost, setIsHost] = useState(false);

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
      await api.put("/users/" + id, { username: username });
      setProfile({ ...profile, username: username }); // Update local profile state
      alert("Username updated successfully!");
    } catch (error) {
      console.error(`Failed to update username: ${error}`);
      alert("Failed to update username. Please try again.");
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
      const lobbyId = await response.json;
      localStorage.setItem("isHost", "true");

      // Navigate to the game room using the game ID from the response
      navigate(`/lobbies/${response.data.id}`);
    } catch (error) {
      console.error(`Creating game failed: ${error}`);
      alert("Failed to create game. Please try again.");
    }
  };

  const joinLobby = async () => {
    try {
      const lobbyId = prompt("Enter lobby ID: ");
      // API call to join a lobby by ID
      const response = await api.post(`/lobbies/join/${lobbyId}`);
      localStorage.setItem("isHost", "false");

      // Navigate to the lobby
      navigate(`/lobby/${lobbyId}`);
    } catch (error) {
      console.error(`Joining lobby failed: ${error}`);
      alert("Failed to join lobby. Please check the lobby ID and try again.");
    }
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await api.get("/users/" + id);

        setProfile(response.data);
      } catch (error) {
        console.error(`Something went wrong while fetching the user: \n${handleError(error)}`);
        console.error("Details:", error);
        alert("Something went wrong while fetching the user! See the console for details.");
      }
    }

    fetchData();
  }, []);

  return (
    <HomepageBackgroundImage>
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
          <CustomButton onClick={() => navigate("/game/instructions")}>Instructions</CustomButton>
          <CustomButton onClick={logout}>Logout</CustomButton>
        </Box>
        {/* User statistics */}
        {profile && (
          <div className="user-stats">
            <div>
              {isEditing ? (
                <>
                  <TextField
                    value={username || ""}
                    onChange={(e) => setUsername(e.target.value)}
                    style={{ marginLeft: "10px" }}
                  />
                  <IconButton onClick={handleSaveClick}>
                    <SaveIcon />
                  </IconButton>
                </>
              ) : (
                <>{profile.username} <EditIcon onClick={handleEditClick} /></>
              )}
            </div>
            <CustomButton onClick={goToLeaderboards}>Leaderboards</CustomButton>
            <Box sx={{
              backgroundColor: "#e0e0e0",
              borderColor: "black",
              borderWidth: "2px",
              borderStyle: "solid",
              width: "60%",
              height: "20%",
              margin: "auto",
              padding: "20px",
              borderRadius: "10px",
              boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
              position: "relative",
            }}>
              <div>{profile.gamesPlayed}</div>
              <Typography variant="h4" gutterBottom
                sx={{
                  fontFamily: "Londrina Solid",
                  textAlign: "center",
                }}>
                Games Played
              </Typography>
            </Box>
            <Box sx={{
              backgroundColor: "#e0e0e0",
              borderColor: "black",
              borderWidth: "2px",
              borderStyle: "solid",
              width: "60%",
              height: "20%",
              margin: "auto",
              padding: "20px",
              borderRadius: "10px",
              boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
              position: "relative",
            }}>
              <div>{profile.pointsScored}</div>
              <Typography variant="h4" gutterBottom
                sx={{
                  fontFamily: "Londrina Solid",
                  textAlign: "center",
                }}>
                Points Scored
              </Typography>
            </Box>
            <Box sx={{
              backgroundColor: "#e0e0e0",
              borderColor: "black",
              borderWidth: "2px",
              borderStyle: "solid",
              width: "60%",
              height: "20%",
              margin: "auto",
              padding: "20px",
              borderRadius: "10px",
              boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
              position: "relative",
            }}>
              <div>{profile.gamesWon}</div>
              <Typography variant="h4" gutterBottom
                sx={{
                  fontFamily: "Londrina Solid",
                  textAlign: "center",
                }}>
                Games Won
              </Typography>
            </Box>
          </div>
        )}

        {/* Action buttons */}
        <CustomButton onClick={createLobby}>Create Lobby</CustomButton>
        <CustomButton onClick={joinLobby}>Join Lobby</CustomButton>
      </Box>
    </HomepageBackgroundImage>
  );
};

export default Homepage;