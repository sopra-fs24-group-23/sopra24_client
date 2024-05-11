export type Answer = {
  answer: string;
  category: string;
  isDoubted: boolean;
  isCorrect: boolean;
  isJoker: boolean;
  isUnique: boolean;
};

export type User = {
  username: string;
  id: string;
  totalScore: number;
  gamesPlayed: number;
  gamesWon: number;
  color: string;
};

export type GameSettings = {
  categories: string[];
  maxRounds: number;
  maxPlayers: number;
  votingDuration: number;
  scoreboardDuration: number;
  inputDuration: number;
}

export type GameState = {
  gamePhase: string;
  players: Object[];
  currentLetter: string;
  currentRoundNumber: number;
}
