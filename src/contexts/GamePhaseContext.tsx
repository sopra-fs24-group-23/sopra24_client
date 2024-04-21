import { createContext, useState } from "react";

interface GamePhaseContextProps {
  gamePhase: any;
  setGamePhase: React.Dispatch<React.SetStateAction<any>>;
  players: any[];
  setPlayers: React.Dispatch<React.SetStateAction<any[]>>;
}

const GamePhaseContext = createContext<GamePhaseContextProps | null>(null);

export default GamePhaseContext;