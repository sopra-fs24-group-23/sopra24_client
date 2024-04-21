import React, { useState } from "react";
import GameSettingsContext from "../../contexts/GameSettingsContext";
import PropTypes from "prop-types";

const GameSettingsProvider = ( { children } ) => {
  const [gameSettings, setGameSettings] = useState(null);

  return(
    <GameSettingsContext.Provider value={{ gameSettings, setGameSettings }}>
      {children}
    </GameSettingsContext.Provider>
  );
};
export default GameSettingsProvider;