import React from "react";
import AppRouter from "./components/routing/routers/AppRouter";
import WebSocketProvider from "./components/providers/WebSocketProvider";


const App = () => {
  return (
    <WebSocketProvider>
      <div>
        <AppRouter/>
      </div>
    </WebSocketProvider>
  );
};

export default App;
