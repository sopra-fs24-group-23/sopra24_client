import * as React from "react";
import Box from "@mui/material/Box";
import PropTypes from "prop-types";

const HomepageBackgroundImage = ( {children}) => {
  return (
    <Box
      sx={{
        backgroundImage: `url('/BackgroundImages/Homepage_mountains.png')`,
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
HomepageBackgroundImage.propTypes = {
  children: PropTypes.node.isRequired,
};
export default HomepageBackgroundImage;