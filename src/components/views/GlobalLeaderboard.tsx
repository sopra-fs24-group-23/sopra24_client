import React, { useEffect, useState } from "react";
import { api, handleError } from "helpers/api";
//import { Button } from "components/ui/Button";
import { useNavigate, useParams } from "react-router-dom";
//import BaseContainer from "components/ui/BaseContainer";
import "styles/views/Game.scss";
//import { User } from "types";
import CustomButton from "components/ui/CustomButton";
import HomepageBackgroundImage from "styles/views/HomepageBackgroundImage";
import { Box, Typography } from "@mui/material";

const GlobalLeaderboard = () => {
  const navigate = useNavigate();
  const [leaderboardData, setLeaderboardData] = useState([]);

  const handleBack = () => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      navigate(`/homepage/${userId}`);
    } else {
      console.error("User ID not found.");
      navigate("/login");
    }
  }

  useEffect(() => {
    const fetchLeaderboardData = async () => {
      try {
        const response = await api.get("/leaderboard/global");
        setLeaderboardData(response.data);
      } catch (error) {
        console.error("Failed to fetch leaderboard data:", error);
      }
    };

    fetchLeaderboardData();
  }, []);

  return (
    <HomepageBackgroundImage>
    <Box sx={{
      display: "flex",
      position: "absolute",
      top: "2%",
      left: "85%",  
    }}>
      <CustomButton
        onClick={handleBack}
        sx={{
          backgroundColor: "#e0e0e0",
          "&:hover": {
            backgroundColor: "red",
          },
        }}
      >
        Back
      </CustomButton>
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
        <Typography variant="h4" gutterBottom
          sx={{
            fontFamily: "Londrina Solid",
            textAlign: "center",
          }}>
          Leaderboards
        </Typography>
        <Box sx={{
                  backgroundColor: "#e0e0e0",
                  borderColor: "black",
                  borderWidth: "2px",
                  borderStyle: "solid",
                  width: "60%",
                  height: "10%",
                  margin: "auto",
                  padding: "20px",
                  borderRadius: "10px",
                  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
                  position: "relative",
                }}>
                <Typography variant="h4" gutterBottom
                    sx={{
                    fontFamily: "Londrina Solid",
                    textAlign: "center",
                    }}>
                    Games Won
                </Typography>
              </Box>
              <Box sx={{
                  backgroundColor: "#e0e0e0",
                  borderColor: "black",
                  borderWidth: "2px",
                  borderStyle: "solid",
                  width: "60%",
                  height: "10%",
                  margin: "auto",
                  padding: "20px",
                  borderRadius: "10px",
                  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
                  position: "relative",
                }}>
                <Typography variant="h4" gutterBottom
                    sx={{
                    fontFamily: "Londrina Solid",
                    textAlign: "center",
                    }}>
                    Average Score
                </Typography>
              </Box>
              <Box sx={{
                  backgroundColor: "#e0e0e0",
                  borderColor: "black",
                  borderWidth: "2px",
                  borderStyle: "solid",
                  width: "60%",
                  height: "10%",
                  margin: "auto",
                  padding: "20px",
                  borderRadius: "10px",
                  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
                  position: "relative",
                }}>
                 <Typography variant="h4" gutterBottom
                    sx={{
                    fontFamily: "Londrina Solid",
                    textAlign: "center",
                    }}>
                    Win/loss Ratio
                </Typography>
              </Box>
      </Box>
    </HomepageBackgroundImage>
  );
};

export default GlobalLeaderboard;