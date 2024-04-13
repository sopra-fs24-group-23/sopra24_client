import React from "react";
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import {GameGuard} from "../routeProtectors/GameGuard";
import GameRouter from "./GameRouter";
import {LoginGuard} from "../routeProtectors/LoginGuard";
import Login from "../../views/Login";
import Register from "../../views/Register";
import Homepage from "../../views/Homepage";
import Instructions from "../../views/Instructions";
import Lobby from "../../views/Lobby";
import GlobalLeaderboard from "../../views/GlobalLeaderboard";

/**
 * Main router of your application.
 * In the following class, different routes are rendered. In our case, there is a Login Route with matches the path "/login"
 * and another Router that matches the route "/game".
 * The main difference between these two routes is the following:
 * /login renders another component without any sub-route
 * /game renders a Router that contains other sub-routes that render in turn other react components
 * Documentation about routing in React: https://reactrouter.com/en/main/start/tutorial 
 */
const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>

        {/* Only clients without a token can access this. */}
        <Route element={<LoginGuard/>}>
          <Route path="/login" element={<Login/>} />
          <Route path="/register" element={<Register/>} />
        </Route>

        {/* Only clients with a token can access this. */}
        <Route element={<GameGuard/>}>
          <Route path="/homepage" element={<Homepage/>} />
          <Route path="/instructions" element={<Instructions/>} />
          <Route path="/leaderboards" element={<GlobalLeaderboard/>} />
          <Route path="/lobbies/:lobbyId" element={<Lobby/>} />
          <Route path="/game/*" element={<GameRouter/>} />
        </Route>

        {/* Requesting the Base-URL redirects to login. */}
        <Route path="/" element={
          <Navigate to="/login" replace />
        }/>

      </Routes>
    </BrowserRouter>
  );
};

/*
* Don't forget to export your component!
 */
export default AppRouter;
