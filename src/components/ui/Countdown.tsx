import React from "react";
import { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import { Typography } from "@mui/material";

const Countdown = (duration: number, description: string) => {
  const [counter, setCounter] = useState(duration)

  useEffect(() => {
    const timer = setInterval(() => {
      setCounter(prevCounter => prevCounter > 0 ? prevCounter -1 : 0)
    }, 1000);

    return () => clearInterval(timer)
  }, []);

  return (
    <Typography sx={{
      fontFamily: "Londrina Solid",
      textAlign: "center",
    }}>
      {description}{counter}
    </Typography>
  )
}

export default Countdown;