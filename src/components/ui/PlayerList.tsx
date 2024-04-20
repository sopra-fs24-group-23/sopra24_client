import { Box, List, ListItem, Typography } from "@mui/material";
import React from "react";
import PropTypes from "prop-types";
import StarsIcon from "@mui/icons-material/Stars";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

const PlayerList = ({ players, hostView, kickPlayer } ) => {

  const determineIcon = ( hostView, player ) => {
    // if player is host --> host icon
    if (player.isHost) {
      return (
        <StarsIcon sx={{ color: "black" }} />
      )
    }
    // if player is not host, display cross if it is host view
    else if (hostView) {
      return (
        <IconButton onClick={() => kickPlayer(player.username)} size="small">
          <CloseIcon />
        </IconButton>
      )
    }
    else {
      return (<div/>)
    }
  }


  return (
    <Box sx={{
      backgroundColor: "#e0e0e0",
      borderColor: "black",
      borderWidth: "2px",
      borderStyle: "solid",
      width: "60%",
      height: "60%",
      margin: "auto",
      padding: "20px",
      borderRadius: "10px",
      boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
      position: "relative",
      top: hostView ? "-3%" : "10px",
    }}>

      {/* label */}
      <Typography variant="h4" gutterBottom sx={{
        fontFamily: "Londrina Solid",
        textAlign: "center",
      }}>
        Players
      </Typography>

      {/* player list */}
      <List sx={{ width: "100%" }}>
        {players.map((player, index) => (
          <ListItem key={index} sx={{ padding: "10px", borderBottom: "1px solid #ccc", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1, justifyContent: "space-between" }}>
              {player.username}
            </Box>
            {determineIcon(hostView, player)}
          </ListItem>
        ))}
      </List>

    </Box>
  )
}

PlayerList.propTypes = {
  players: PropTypes.array,
  hostView: PropTypes.bool,
  kickPlayer: PropTypes.func
}

export default PlayerList