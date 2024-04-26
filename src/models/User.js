/**
 * User model
 */
class User {
  constructor(data = {}) {
    this.id = null;
    this.username = null;
    this.totalScore = null;
    this.gamesPlayed = null;
    this.gamesWon = null;
    Object.assign(this, data);
  }
}

export default User;
