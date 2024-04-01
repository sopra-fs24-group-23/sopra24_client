import * as React from "react";
import Box from "@mui/material/Box";
import PropTypes from "prop-types";

const BackgroundImageLobby = ( {children}) => {
  return (
    <Box
      sx={{
        backgroundImage: "url('/BackgroundImages/Lobby.png')",
        backgroundPosition: "center",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        width: "100vw", // 100% of the viewport width
        height: "100vh", // 100% of the viewport height
        position: "relative", // Changed to relative for stacking content
      }}
    >
      {children}
      {/* Content goes here. It will be placed on top of the background image */}
    </Box>
  );
};

// Define PropTypes for BackgroundImageLayout
BackgroundImageLobby.propTypes = {
  children: PropTypes.node.isRequired,
};

export default BackgroundImageLobby;