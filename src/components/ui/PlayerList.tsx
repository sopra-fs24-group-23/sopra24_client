import { List, ListItem, Typography } from "@mui/material";
import React from "react";
import PropTypes from "prop-types";

const PlayerList = ({ players } ) => {

  return (
    <List sx={{ width: "100%" }}>
      {players.length > 0 ? (
        players.map((player, index) => (
          <ListItem key={index} sx={{ padding: "10px", borderBottom: "1px solid #ccc" }}>
            {player.username} {/* Adjust if your player object structure is different */}
          </ListItem>
        ))
      ) : (
        <Typography sx={{ textAlign: "center", marginTop: "20px" }}>No players yet</Typography>
      )}
    </List>
  )
}

PlayerList.propTypes = {
  players: PropTypes.array
}

export default PlayerList