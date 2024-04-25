import React from "react";
import BaseContainer from "components/ui/BaseContainer";
import { useNavigate } from "react-router-dom";
//import { Button } from "components/ui/Button";
import Button from "@mui/material/Button";
import CustomButton from "components/ui/CustomButton";
import HomepageBackgroundImage from "styles/views/HomepageBackgroundImage";
import { Box, Typography, List, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
/* Icons import */
import CircleIcon from "@mui/icons-material/Circle";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import LooksOneOutlinedIcon from "@mui/icons-material/LooksOneOutlined";
import ContentCopyOutlinedIcon from "@mui/icons-material/ContentCopyOutlined";

const Instructions = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      navigate(`/homepage/${userId}`);
    } else {
      console.error("User ID not found.");
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
        backgroundColor: "rgba(224, 224, 224, 0.9)", // Semi-transparent grey
        borderColor: "black",
        borderWidth: "2px",
        borderStyle: "solid",
        borderRadius: "27px",
        boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
        width: "90%",
        height: "5%",
        margin: "auto",
        position: "relative",
        //paddingTop: "20px",
        //paddingBottom: "10px",
        top: 30,
        marginBottom: "30px",
      }}>
        <img src="/Images/logo.png" alt="Descriptive Text" style={{ width: "auto", height: "200px", marginTop: "100px" }} />
        <CustomButton onClick={handleBack}>
          Back
        </CustomButton>
      </Box>
      {/* Outer box */}
      <Box sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "left",
        //height: "50vh", // Use viewport height to fill the screen
        width: "80vw",
        padding: "30px",
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
        //paddingTop: "20px",
        //paddingBottom: "10px",
        top: 30,
      }}>
        <Typography variant="h4" gutterBottom
          sx={{
            fontFamily: "Londrina Solid",
            textAlign: "center",
          }}>
          Instructions
        </Typography>
        <Typography variant="h6" gutterBottom
          sx={{
            fontFamily: "Londrina Solid",
            textAlign: "left",
          }}>
          GlobalGuess is the online version of the all-time favorite game Categories.<br />
          Over with debates about whether countries, animals or rivers exist or not!
          With our automatic answer-checking feature, you can focus on the gameplay and not the tedious tasks of
          checking answers.<br />
          <br />
          Create a lobby, customize the game settings and send the lobby code to your friends so they can join.<br />

          Once a game is started, a cycle of several rounds begins.<br />
          During each round, a random letter is chosen and your goal is to think of words
          belonging to each categories, all starting with the imposed letter.<br />
          If you are unsure of a word, you can use the Joker button to sneak wrong answers (these won&apos;t be checked
          unless somebody, doubts your answer) but you will only be able to do this once per round.<br />
          After a round, everyone sees each others answers and can press X to doubt answers, which will trigger an
          automatic answer-check
          for the doubted answer.<br />

          You will then be directed to to an overview screen to see which answer was a joker, doubted, wrong, correct,
          unique or a duplicate. <br />
          <br />

          Here is an overview of the icons used: <br />
          <br />
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <AutoAwesomeIcon sx={{ color: "yellow" }} />
            <Typography variant="body1">This is a joker icon.</Typography>
            <CancelOutlinedIcon sx={{ color: "blue" }} />
            <Typography variant="body1">This icon is to doubt an answer.</Typography>
            <CircleIcon sx={{ color: "green" }} />
            <Typography variant="body1">This marks an answer as correct.</Typography>
            <CircleIcon sx={{ color: "red" }} />
            <Typography variant="body1">This marks an answer as incorrect.</Typography>
            <LooksOneOutlinedIcon sx={{ color: "purple" }} />
            <Typography variant="body1">This marks an answer as unique.</Typography>
            <ContentCopyOutlinedIcon sx={{ color: "purple" }} />
            <Typography variant="body1">This answer has been given twice.</Typography>
          </Box>
          <br />

          The game ends when the number of rounds set by the host are completed and the person with the most points
          wins.<br />
          <br />

          Once a game is over, your statistics are saved in your profile and you can check the leaderboard to see how
          you rank compared to your friends.<br />
          <br />

          Good luck and have fun!
        </Typography>
      </Box>
    </HomepageBackgroundImage>
  );
};

export default Instructions;