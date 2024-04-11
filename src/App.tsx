import React from "react";
import AppRouter from "./components/routing/routers/AppRouter";
import WebSocketProvider from "./components/providers/WebSocketProvider";
import UserProvider from "./components/providers/UserProvider";


const App = () => {
  return (
    <WebSocketProvider>
      <UserProvider>
        <div>
          <AppRouter/>
        </div>
      </UserProvider>
    </WebSocketProvider>
  );
};

export default App;
