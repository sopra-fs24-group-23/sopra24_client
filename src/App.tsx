import React from "react";
import AppRouter from "./components/routing/routers/AppRouter";
import WebSocketProvider from "./components/providers/WebSocketProvider";
import UserProvider from "./components/providers/UserProvider";
import GameStateProvider from "./components/providers/GameStateProvider";
import GameSettingsProvider from "./components/providers/GameSettingsProvider";
import ChatProvider from "./components/providers/ChatProvider";

const App = () => {
  return (
    <WebSocketProvider>
      <UserProvider>
        <ChatProvider>
          <GameStateProvider>
            <GameSettingsProvider>
              <div>
                <AppRouter />
              </div>
            </GameSettingsProvider>
          </GameStateProvider>
        </ChatProvider>
      </UserProvider>
    </WebSocketProvider>
  );
};

export default App;
