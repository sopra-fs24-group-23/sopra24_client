import React from "react";
import {Navigate, Route, Routes} from "react-router-dom";
import Game from "../../views/Game";
import PropTypes from "prop-types";
import Instructions from "../../views/Instructions";

const GameRouter = () => {
  return (
    <div style={{display: "flex", flexDirection: "column"}}>
      <Routes>

        <Route path="" element={<Game />} />

        <Route path="dashboard" element={<Game />} />

        <Route path="*" element={<Navigate to="dashboard" replace />} />

        <Route path="instructions" element={<Instructions />} />
        
      </Routes>
   
    </div>
  );
};

GameRouter.propTypes = {
  base: PropTypes.string
}

export default GameRouter;
