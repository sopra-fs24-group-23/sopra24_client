import React, { useState } from "react";
import GamePhaseContext from "../../contexts/GamePhaseContext";
import PropTypes from "prop-types";

const GamePhaseProvider = ( { children } ) => {
  const [gamePhase, setGamePhase] = useState(null);

  return(
    <GamePhaseContext.Provider value={{ gamePhase, setGamePhase }}>
  {children}
  </GamePhaseContext.Provider>
)
}

GamePhaseProvider.propTypes = {
  children: PropTypes.node,
};

export default GamePhaseProvider;