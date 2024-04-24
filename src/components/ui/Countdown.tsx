import React, { useEffect, useState } from "react";
import { Typography } from "@mui/material";
import PropTypes from "prop-types";

const Countdown = ({ duration, description}) => {
  const [counter, setCounter] = useState(duration)

  useEffect(() => {
    const timer = setInterval(() => {
      const currentCount = counter;
      setCounter(currentCount > 0 ? currentCount-1 : 0)
    }, 1000);

    return () => clearInterval(timer)
  }, [counter]);

  return (
    <Typography variant="h5" sx={{
      fontFamily: "Londrina Solid",
      textAlign: "center",
      color: counter < 6 ? counter === 0 ? "black" : "red" : "black",
    }}>
      {description}{counter > 0 ? counter : "Loading..."}
    </Typography>
  )
}

Countdown.propTypes = {
  duration: PropTypes.number,
  description: PropTypes.string
}

export default Countdown;