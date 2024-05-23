import React from "react";
import { Box, IconButton, Tooltip } from "@mui/material";
import CustomButton from "./CustomButton";
import LeaveGameDialog from "./LeaveGameDialog";
import TooltipContent from "./TooltipContent";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import StyledBox from "./StyledBox";

interface HeaderProps {
  handleOpenDialog: () => void;
  openLeaveDialog: boolean;
  handleCloseDialog: () => void;
  handleLeaveGame: () => void;
}

const Header: React.FC<HeaderProps> = ({ handleOpenDialog, openLeaveDialog, handleCloseDialog, handleLeaveGame }) => {
  return (
    <StyledBox>
      <img src="/Images/logo.png" alt="Descriptive Text"
           style={{ width: "auto", height: "200px", marginTop: "100px" }} />
      <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <Tooltip title={<TooltipContent />} placement="bottom" arrow>
          <IconButton
            sx={{
              fontFamily: "Londrina Solid",
              backgroundColor: "#f8f8f8", // button color
              color: "black", // text color
              borderColor: "black",
              borderWidth: "1px",
              borderStyle: "solid",
              fontSize: "16px",
              fontWeight: "bold",
              textTransform: "uppercase",
              boxShadow: "0px 4px 3px -2px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12)", // This is the Material-UI default, adjust to match mockup
              borderRadius: "20px",
              padding: "6px 16px"
            }}
          >
            <HelpOutlineIcon />
          </IconButton>
        </Tooltip>
        <CustomButton
          onClick={handleOpenDialog}
          sx={{
            backgroundColor: "#ffffff",
            "&:hover": {
              backgroundColor: "red",
            },
          }}
        >
          Leave Game
        </CustomButton>
      </Box>
      <LeaveGameDialog open={openLeaveDialog} onClose={handleCloseDialog} onLeave={handleLeaveGame} />
    </StyledBox>
  );
};

export default Header;