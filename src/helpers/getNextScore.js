export const getNextScore = (currentScore) => {
  if (currentScore < 200) {
    return 200;
  } else if (currentScore < 500) {
    return 500;
  } else if (currentScore < 1000) {
    return 1000;
  } else if (currentScore < 2000) {
    return 2000;
  } else if (currentScore < 5000) {
    return 5000;
  } else if (currentScore > 5000) {
    return 100000;
  }
}