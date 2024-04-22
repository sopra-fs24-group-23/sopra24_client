import React, { useState, ReactNode } from "react";
import GameState from "../../models/GameState";
import GamePhaseContext from "../../contexts/GamePhaseContext";
import PropTypes from "prop-types";
import { isProduction } from "../../helpers/isProduction";

interface GamePhaseProviderProps {
  children: ReactNode;
}
const GamePhaseProvider: React.FC<GamePhaseProviderProps> = ({ children }) => {
  const [gameState, setGameState] = useState(new GameState());
  const [gamePhase, setGamePhase] = useState<any>(null);
  const [players, setPlayers] = useState<any[]>([]);

  const setGameStateVariable = ( gameStateData ) => {
    if (!isProduction()) {
      console.log(`DEBUG setting gameState in context to: ${gameStateData}`)
    }
    setGameState(new GameState(gameStateData))
  }

  return (
    <GamePhaseContext.Provider value={{ gameState, setGameStateVariable, gamePhase, setGamePhase, players, setPlayers }}>
      {children}
    </GamePhaseContext.Provider>
  );
};

GamePhaseProvider.propTypes = {
  children: PropTypes.node
}

export default GamePhaseProvider;