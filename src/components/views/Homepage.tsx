import React, { useEffect, useState } from "react";
import { api, handleError } from "helpers/api";
//import { Button } from "components/ui/Button";
import Button from "@mui/material/Button";
import { useNavigate, useParams } from "react-router-dom";
//import BaseContainer from "components/ui/BaseContainer";
import "styles/views/Game.scss";
//import { User } from "types";
import HomepageBackgroundImage from 'styles/views/HomepageBackgroundImage';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import TextField from "@mui/material/TextField";
import { IconButton } from "@mui/material";

const Homepage = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const { id } = useParams();
  const [username, setUsername] = useState("");
  const [isEditing, setIsEditing] = useState(false);

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
  }
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
  }

  const goToLeaderboards = () => {
    navigate("/leaderboards");
  };

  const createLobby = async () => {
    try {
      const response = await api.post("/lobbies/create");
      // Navigate to the game room using the game ID from the response
      navigate(`/lobby/${response.data.lobbyId}`);
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
      {/* User statistics */}
      {profile && (
        <div className="user-stats">
          <div>
            Username: {isEditing ? (
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
          <div>{profile.gamesPlayed} Games Played</div>
          <div>{profile.pointsScored} Points Scored</div>
          <div>{profile.gamesWon} Games Won</div>
          <Button style={{ width: "100%" }} onClick={() => navigate("/game/instructions")}>
            Instructions
          </Button>
        </div>
      )}

      {/* Action buttons */}
      <Button onClick={createLobby}>Create Lobby</Button>
      <Button onClick={joinLobby}>Join Lobby</Button>
      <Button onClick={goToLeaderboards}>Leaderboards</Button>
      <Button onClick={logout}>Logout</Button>
    </HomepageBackgroundImage>
  );
};

export default Homepage;