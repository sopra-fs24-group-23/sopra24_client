import React from "react";
import {Navigate, Route, Routes} from "react-router-dom";
import Game from "../../views/Game";
import PropTypes from "prop-types";
import Instructions from "../../views/Instructions";
import GlobalLeaderboard from "../../views/GlobalLeaderboard";

const GameRouter = () => {
  return (
    <div style={{display: "flex", flexDirection: "column"}}>
      <Routes>

        <Route path="" element={<Game />} />

        <Route path="dashboard" element={<Game />} />

        <Route path="*" element={<Navigate to="dashboard" replace />} />

        <Route path="instructions" element={<Instructions />} />

        <Route path="leaderboards" element={<GlobalLeaderboard />} />
        
      </Routes>
   
    </div>
  );
};

GameRouter.propTypes = {
  base: PropTypes.string
}

export default GameRouter;
