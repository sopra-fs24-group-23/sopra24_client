import React, { useState, ReactNode } from "react";
import GameState from "../../models/GameState";
import GameStateContext from "../../contexts/GameStateContext";
import PropTypes from "prop-types";
import { isProduction } from "../../helpers/isProduction";

interface GamePhaseProviderProps {
  children: ReactNode;
}
const GameStateProvider: React.FC<GamePhaseProviderProps> = ({ children }) => {
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
    <GameStateContext.Provider value={{ gameState, setGameStateVariable, gamePhase, setGamePhase, players, setPlayers }}>
      {children}
    </GameStateContext.Provider>
  );
};

GameStateProvider.propTypes = {
  children: PropTypes.node
}

export default GameStateProvider;