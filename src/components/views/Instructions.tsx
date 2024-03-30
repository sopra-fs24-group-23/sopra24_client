import React from "react";
import BaseContainer from "components/ui/BaseContainer";
import { useNavigate } from "react-router-dom";
//import { Button } from "components/ui/Button";
import Button from '@mui/material/Button';

const Instructions = () => {
  const navigate = useNavigate();

  return (
    <BaseContainer>
      <h2>Instructions</h2>
      <p>This is how to play GlobalGuess</p>
      <Button onClick={() => navigate("/game")}>Back</Button>
    </BaseContainer>
  );
};

export default Instructions;