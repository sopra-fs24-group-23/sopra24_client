import React, { useState, ReactNode } from "react";
import GameStateModel from "../../models/GameState";
import { GameState } from "../../types";
import GameStateContext from "../../contexts/GameStateContext";
import PropTypes from "prop-types";
import { isProduction } from "../../helpers/isProduction";

interface GamePhaseProviderProps {
  children: ReactNode;
}
const GameStateProvider: React.FC<GamePhaseProviderProps> = ({ children }) => {
  const [gameState, setGameState] = useState<GameState>(new GameStateModel());
  const [gamePhase, setGamePhase] = useState<string>(null);
  const [players, setPlayers] = useState<any[]>([]);

  const setGameStateVariable = ( gameStateData: any ) => {
    if (!isProduction()) {
      console.log(`DEBUG setting gameState in context to: ${JSON.stringify(gameStateData)}`)
    }
    setGameState(new GameStateModel(gameStateData))
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