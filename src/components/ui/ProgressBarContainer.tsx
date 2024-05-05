import React from "react";
import PropTypes from "prop-types";
import "styles/ui/ProgressBar.scss";

const ProgressBar = ({ currentPoints, totalPoints }) => {
  const width = (currentPoints / totalPoints) * 100;

  return (
    <div className="progressBarContainer">
      <div className="progressBar" style={{ width: `${width}%` }} />
    </div>
  );
};

ProgressBar.propTypes = {
  currentPoints: PropTypes.number.isRequired,
  totalPoints: PropTypes.number.isRequired,
};

export default ProgressBar;

