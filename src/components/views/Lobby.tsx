import BackgroundImageLobby from "styles/views/BackgroundImageLobby";
import React from "react";
import { Spinner } from "../ui/Spinner";

const Lobby = () => {


  let content = <Spinner />;

  return (
    <BackgroundImageLobby>
      {content}
    </BackgroundImageLobby>
  );
};

export default Lobby;