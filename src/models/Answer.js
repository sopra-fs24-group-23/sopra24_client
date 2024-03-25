/**
 * Answer model
 */
class Answer {
  constructor(data = {}) {
    this.category = null;
    this.answer = null;
    this.isDoubted = null;
    this.isJoker = null;
    this.isUnique = null;
    this.isCorrect = null;
    Object.assign(this, data);
  }
}

export default Answer;
