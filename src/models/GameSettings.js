/**
 * GameSettings model
 */

class GameSettings {
  constructor(data = {}) {
    this.categories = null;
    this.maxRounds = null;
    this.votingDuration = null;
    this.inputDuration = null;
    this.scoreboardDuration = null;
    this.maxPlayers = null;
    Object.assign(this, data);
  }
}

export default GameSettings;