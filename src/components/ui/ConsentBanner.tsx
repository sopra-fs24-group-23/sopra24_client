import React, { useState, useEffect } from "react";
import { Box, Button, Typography } from "@mui/material";
import PropTypes from "prop-types";

const ConsentBanner = ({ onConsent, onDecline }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const consentGiven = localStorage.getItem("fontsConsent") === "true";
    setIsVisible(!consentGiven);
  }, []);

  const handleConsent = () => {
    onConsent();
    localStorage.setItem("fontsConsent", "true");
    const link = document.createElement("link");
    link.rel = "stylesheet";
  
    link.onload = () => {
      window.location.href = "/login";
    };
  
    link.href = "https://fonts.googleapis.com/css2?family=Londrina+Solid:wght@100;300;400;900&display=swap";
    document.head.appendChild(link);
    setIsVisible(false);
  };

  const handleDecline = () => {
    onDecline();
    localStorage.setItem("fontsConsent", "false");
    setIsVisible(false);
    window.location.href = "/fallback";
  };

  if (!isVisible) return null;

  return (
    <Box sx={{
      position: "fixed", 
      bottom: "10px", 
      left: "50%", 
      transform: "translateX(-50%)", 
      width: "80%", 
      maxWidth: "1000px", 
      backgroundColor: "rgba(255, 255, 255, 0.8)", 
      padding: "20px", 
      textAlign: "center", 
      border: "1px solid black",
      borderRadius: "10px"
    }}>
      <Typography variant="body1">We use cookies to personalize content and to analyze our traffic. Please consent to our cookies if you continue to use our website.</Typography>
      <Button sx={{ fontWeight: "bold", backgroundColor: "#FFC0CB", color: "black", border: "1px solid black", borderRadius: "10px", margin: "10px" }} onClick={handleDecline}>Decline</Button>
      <Button sx={{ fontWeight: "bold", backgroundColor: "#B2F0E8", color: "black", border: "1px solid black", borderRadius: "10px" }} onClick={handleConsent}>Consent</Button>
    </Box>
  );
};

ConsentBanner.propTypes = {
  onConsent: PropTypes.func.isRequired,
  onDecline: PropTypes.func.isRequired,
};

export default ConsentBanner;