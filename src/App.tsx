import React from "react";
import AppRouter from "./components/routing/routers/AppRouter";
import WebSocketProvider from "./components/providers/WebSocketProvider";
import UserProvider from "./components/providers/UserProvider";
import GameStateProvider from "./components/providers/GameStateProvider";


const App = () => {
  return (
    <WebSocketProvider>
      <UserProvider>
        <GameStateProvider>
          <div>
            <AppRouter />
          </div>
        </GameStateProvider>
      </UserProvider>
    </WebSocketProvider>
  );
};

export default App;
