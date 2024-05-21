import React, { useMemo, useState } from "react";
import GameSettingsContext from "../../contexts/GameSettingsContext";
import GameSettingsModel from "../../models/GameSettings";
import { GameSettings } from "../../types"
import PropTypes from "prop-types";
import { isProduction } from "../../helpers/isProduction";

const GameSettingsProvider = ({ children }) => {
  const [gameSettings, setGameSettings] = useState<GameSettings>(new GameSettingsModel());

  const setGameSettingsVariable = (gameSettingsData: any) => {
    if (!isProduction()) {
      console.log(`DEBUG setting gameSettings in context to: ${JSON.stringify(gameSettingsData)}`)
    }
    setGameSettings(new GameSettingsModel(gameSettingsData))
  }

  const contextValue = useMemo(() => ({
    gameSettings,
    setGameSettingsVariable
  }), [gameSettings, setGameSettingsVariable])

  return (
    <GameSettingsContext.Provider value={contextValue}>
      {children}
    </GameSettingsContext.Provider>
  );
};

GameSettingsProvider.propTypes = {
  children: PropTypes.node,
};

export default GameSettingsProvider;