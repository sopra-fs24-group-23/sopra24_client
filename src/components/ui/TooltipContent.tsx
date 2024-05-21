import React from "react";
import { Box, Typography } from "@mui/material";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import CircleIcon from "@mui/icons-material/Circle";
import LooksOneOutlinedIcon from "@mui/icons-material/LooksOneOutlined";
import ContentCopyOutlinedIcon from "@mui/icons-material/ContentCopyOutlined";

const TooltipContent = () => {
    return (
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "start" }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <AutoAwesomeIcon sx={{ color: "yellow" }} />
          <Typography variant="body1">This is a joker icon.</Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <CancelOutlinedIcon sx={{ color: "blue" }} />
          <Typography variant="body1">This icon is to doubt an answer.</Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <CircleIcon sx={{ color: "green" }} />
          <Typography variant="body1">This marks an answer as correct.</Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <CircleIcon sx={{ color: "red" }} />
          <Typography variant="body1">This marks an answer as incorrect.</Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <LooksOneOutlinedIcon sx={{ color: "purple" }} />
          <Typography variant="body1">This marks an answer as unique.</Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <ContentCopyOutlinedIcon sx={{ color: "purple" }} />
          <Typography variant="body1">This answer has been given twice.</Typography>
        </Box>
      </Box>
    );
  };

export default TooltipContent;

