import React from "react";
import { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";

const Timer = (duration: number, description: string) => {
  const [counter, setCounter] = useState(duration)

  useEffect(() => {
    const timer = setInterval(() => {
      setCounter(prevCounter => prevCounter > 0 ? prevCounter -1 : 0)
    }, 1000);

    return () => clearInterval(timer)
  }, []);

  return (
    <TextField>
      {description}{counter}
    </TextField>
  )
}

export default Timer;