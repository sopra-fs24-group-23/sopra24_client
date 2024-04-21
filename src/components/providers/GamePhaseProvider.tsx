import React, { useState, ReactNode } from "react";
import GamePhaseContext from "../../contexts/GamePhaseContext";

interface GamePhaseProviderProps {
  children: ReactNode;
}
const GamePhaseProvider: React.FC<GamePhaseProviderProps> = ({ children }) => {
  const [gamePhase, setGamePhase] = useState<any>(null);
  const [players, setPlayers] = useState<any[]>([]);

  return (
    <GamePhaseContext.Provider value={{ gamePhase, setGamePhase, players, setPlayers }}>
      {children}
    </GamePhaseContext.Provider>
  );
};

export default GamePhaseProvider;