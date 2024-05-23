import React, { useEffect, useState } from "react";
import { api } from "helpers/api";
import { useNavigate } from "react-router-dom";
import "styles/views/Game.scss";
import CustomButton from "components/ui/CustomButton";
import HomepageBackgroundImage from "components/ui/HomepageBackgroundImage";
import { Box, Typography, List, ListItem } from "@mui/material";
import { isProduction } from "../../helpers/isProduction";


const GlobalLeaderboard = () => {
  const navigate = useNavigate();
  const [leaderboardData, setLeaderboardData] = useState([{ username: "", totalScore: 0, gamesPlayed: 0, gamesWon: 0, color: "" }]);

  const fetchLeaderboardData = async () => {
    try {
      const response = await api.get("/leaderboards/total-score");
      //console.log(response);
      setLeaderboardData(response.data);
      //console.log(leaderboardData);
    } catch (error) {
      if(!isProduction) console.error("Failed to fetch leaderboard data:", error);
    }
  };

  useEffect(() => {
    fetchLeaderboardData();
    const interval = setInterval(fetchLeaderboardData, 5000); // Fetch every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const handleBack = () => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      navigate(`/homepage/${userId}`);
    } else {
      if(!isProduction) console.error("User ID not found.");
      navigate("/login");
    }
  }

  return (
    <HomepageBackgroundImage>
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
        <img src="/Images/logo.png" alt="Descriptive Text" style={{ width: "auto", height: "200px"}} />
        <CustomButton onClick={handleBack}>
          Back
        </CustomButton>
      </Box>
      {/* Outer box */}
      <Box sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        backgroundColor: "rgba(224, 224, 224, 0.9)", // Semi-transparent grey
        borderColor: "black",
        borderWidth: "2px",
        borderStyle: "solid",
        padding: "20px",
        borderRadius: "27px",
        boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
        width: "90%",
        //maxWidth: "70%",
        maxWidth: "800px",
        height: "70%",
        marginTop: "80px",
        marginBottom: "30px",
        marginLeft: "auto",
        marginRight: "auto",
        position: "relative",
        paddingTop: "30px",
        paddingBottom: "10px",
      }}>
        <Typography variant="h4" gutterBottom
          sx={{
            fontFamily: "Londrina Solid",
            textAlign: "center",
          }}>
          Leaderboards
        </Typography>
        <div style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
        }}>
          <Box sx={{
            backgroundColor: "#e0e0e0",
            borderColor: "black",
            borderWidth: "2px",
            borderStyle: "solid",
            height: "90%",
            margin: "auto",
            padding: "20px",
            borderRadius: "10px",
            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
            position: "relative",
          }}>
            <Typography variant="h5" gutterBottom
              sx={{
                fontFamily: "Londrina Solid",
                textAlign: "center",
              }}>
              Player Username
            </Typography>
            <List>
              {leaderboardData.sort((a, b) => (b.totalScore / b.gamesPlayed) - (a.totalScore / a.gamesPlayed)).map((player, index) => (
                <ListItem key={index}>
                  <Typography style={{ color: player.color }}>
                    {player.username}
                  </Typography>
                </ListItem>
              ))}
            </List>
          </Box>
          <Box sx={{
            backgroundColor: "#e0e0e0",
            borderColor: "black",
            borderWidth: "2px",
            borderStyle: "solid",
            height: "90%",
            margin: "auto",
            padding: "20px",
            marginLeft: "10px",
            borderRadius: "10px",
            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
            position: "relative",
          }}>
            <Typography variant="h5" gutterBottom
              sx={{
                fontFamily: "Londrina Solid",
                textAlign: "center",
              }}>
              Games Won
            </Typography>
            <List>
              {leaderboardData.sort((a, b) => (b.totalScore / b.gamesPlayed) - (a.totalScore / a.gamesPlayed)).map((player, index) => (
                <ListItem key={index}>
                  <Typography>
                    {player.gamesWon}
                  </Typography>
                </ListItem>
              ))}
            </List>
          </Box>
          <Box sx={{
            backgroundColor: "#e0e0e0",
            borderColor: "black",
            borderWidth: "2px",
            borderStyle: "solid",
            height: "90%",
            margin: "auto",
            marginLeft: "10px",
            padding: "20px",
            borderRadius: "10px",
            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
            position: "relative",
          }}>
            <Typography variant="h5" gutterBottom
              sx={{
                fontFamily: "Londrina Solid",
                textAlign: "center",
              }}>
              Average Score
            </Typography>
            <List>
              {leaderboardData.sort((a, b) => (b.totalScore / b.gamesPlayed) - (a.totalScore / a.gamesPlayed)).map((player, index) => (
                <ListItem key={index}>
                  <Typography>
                    {player.gamesPlayed === 0 ? "No games played" : player.totalScore / player.gamesPlayed}
                  </Typography>
                </ListItem>
              ))}
            </List>
          </Box>
          <Box sx={{
            backgroundColor: "#e0e0e0",
            borderColor: "black",
            borderWidth: "2px",
            borderStyle: "solid",
            height: "90%",
            margin: "auto",
            marginLeft: "10px",
            padding: "20px",
            borderRadius: "10px",
            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
            position: "relative",
          }}>
            <Typography variant="h5" gutterBottom
              sx={{
                fontFamily: "Londrina Solid",
                textAlign: "center",
              }}>
              Win/loss Ratio
            </Typography>
            <List>
              {leaderboardData.sort((a, b) => (b.totalScore / b.gamesPlayed) - (a.totalScore / a.gamesPlayed)).map((player, index) => (
                <ListItem key={index}>
                  <Typography>
                    {player.gamesPlayed - player.gamesWon === 0 ? "No losses" : player.gamesWon / (player.gamesPlayed - player.gamesWon)}
                  </Typography>
                </ListItem>
              ))}
            </List>
          </Box>
        </div>
      </Box>
    </HomepageBackgroundImage>
  );
};

export default GlobalLeaderboard;