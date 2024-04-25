/**
 * GameState model
 */

class GameState {
  constructor(data = {}) {
    this.gamePhase = null;
    this.players = null;
    this.currentLetter = null;
    this.currentRoundNumber = null;
    Object.assign(this, data);
  }
}

export default GameState;
