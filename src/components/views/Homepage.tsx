import React, { useEffect, useState } from "react";
import { api, handleError } from "helpers/api";
import { Button } from "components/ui/Button";
import { useNavigate, useParams } from "react-router-dom";
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import "styles/views/Game.scss";
import { User } from "types";

const Homepage = () => {
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const { id } = useParams();


    const logout = async () => {
        const token = localStorage.getItem("token");
        console.log(token);
        await api.post("/logout", { token: token });

        localStorage.removeItem("token");
        navigate("login");
    }

    const goToLeaderboards = () => {
        navigate('/leaderboards');
    };

    const createLobby = async () => {
        try {
            const response = await api.post('/lobbies/create');
            // Navigate to the game room using the game ID from the response
            navigate(`/lobby/${response.data.lobbyId}`);
        } catch (error) {
            console.error(`Creating game failed: ${error}`);
            alert('Failed to create game. Please try again.');
        }
    };

    const joinLobby = async () => {
        try {
            const lobbyId = prompt('Enter lobby ID: ');
            // API call to join a lobby by ID
            const response = await api.post(`/lobbies/join/${lobbyId}`);
            // Navigate to the lobby
            navigate(`/lobby/${lobbyId}`);
        } catch (error) {
            console.error(`Joining lobby failed: ${error}`);
            alert('Failed to join lobby. Please check the lobby ID and try again.');
        }
    }

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await api.get("/users/" + id);

                setProfile(response.data);
            }
            catch (error) {
                console.error(`Something went wrong while fetching the user: \n${handleError(error)}`);
                console.error("Details:", error);
                alert("Something went wrong while fetching the user! See the console for details.");
            }
        }

        fetchData();
    }, []);

    return (
        <BaseContainer>
            {/* User statistics */}
            {profile && (
                <div className="user-stats">
                    <div>{profile.username}</div>
                    <div>{profile.gamesPlayed} Games Played</div>
                    <div>{profile.pointsScored} Points Scored</div>
                    <div>{profile.gamesWon} Games Won</div>
                </div>
            )}

            {/* Action buttons */}
            <Button onClick={createLobby}>Create Lobby</Button>
            <Button onClick={joinLobby}>Join Lobby</Button>
            <Button onClick={goToLeaderboards}>Leaderboards</Button>
            <Button onClick={logout}>Logout</Button>
        </BaseContainer>
    );
};


export default Homepage;