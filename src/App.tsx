import React from "react";
import AppRouter from "./components/routing/routers/AppRouter";
import WebSocketProvider from "./components/providers/WebSocketProvider";
import UserProvider from "./components/providers/UserProvider";
import GamePhaseProvider from "./components/providers/GamePhaseProvider";


const App = () => {
  return (
    <WebSocketProvider>
      <UserProvider>
        <GamePhaseProvider>
        <div>
          <AppRouter/>
        </div>
        </GamePhaseProvider>
      </UserProvider>
    </WebSocketProvider>
  );
};

export default App;
