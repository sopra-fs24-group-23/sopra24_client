import React, { useContext, useEffect, useState } from "react";
import GameSettingsContext from "../../contexts/GameSettingsContext";
import GameSettings from "../../models/GameSettings";
import PropTypes from "prop-types";
import { isProduction } from "../../helpers/isProduction";

const GameSettingsProvider = ({ children }) => {
  const [gameSettings, setGameSettings] = useState(new GameSettings());

  const setGameSettingsVariable = (gameSettingsData) => {
    if (!isProduction()) {
      console.log(`DEBUG setting gameSettings in context to: ${JSON.stringify(gameSettingsData)}`)
    }
    setGameSettings(new GameSettings(gameSettingsData))
  }

  return (
    <GameSettingsContext.Provider value={{ gameSettings, setGameSettings, setGameSettingsVariable }}>
      {children}
    </GameSettingsContext.Provider>
  );
};

GameSettingsProvider.propTypes = {
  children: PropTypes.node,
};

export default GameSettingsProvider;