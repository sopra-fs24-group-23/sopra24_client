import React, { useState } from "react";
import { api, handleError } from "helpers/api";
import User from "models/User";
import { useNavigate } from "react-router-dom";
import BackgroundImageLayout from "styles/views/BackgroundImageLayout";
import GameFormField from "components/ui/GameFormField";
import CustomButton from "components/ui/CustomButton";
import Box from "@mui/material/Box";

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState<string>(null);
  const [password, setPassword] = useState<string>(null);

  const doLogin = async () => {
    try {
      const requestBody = JSON.stringify({ username, password });
      const response = await api.post("/login", requestBody);

      // Get the returned user and update a new object.
      const user = new User(response.data);

      // Store the token into the local storage.
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("userId", response.data.id);
      console.log(response.data.token);
      console.log(user);
      console.log(response.data.id);

      // Login successfully worked --> navigate to Homepage
      navigate("/homepage/" + response.data.id);
    } catch (error) {
      alert(
        `Something went wrong during the login: \n${handleError(error)}`
      );
    }
    console.log(password);

  };

  const getToRegister = () => {
    navigate("/register");
  }

  return (
    <BackgroundImageLayout>
      <Box sx={{
        position: "absolute",
        top: "60%",
        left: "20%",
        transform: "translate(-50%, -50%)",
        width: "clamp(300px, 50%, 500px)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}>
        <div className="login form">
          <GameFormField
            label="Username"
            value={username}
            onChange={(un: string) => setUsername(un)}
          />
          <div style={{ margin: "15px 0" }}></div>
          <GameFormField
            label="Password"
            value={password}
            onChange={(n) => setPassword(n)}
          />
          <div style={{ margin: "10px 0" }}></div>
          <div className="login button-container">
            <CustomButton
              disabled={!username || !username}
              sx={{ width: "100%" }}
              onClick={() => doLogin()}
            >
              Login
            </CustomButton>
          </div>
          <div style={{ margin: "10px 0" }}></div>
          <div className="login button-container">
            <CustomButton
              sx={{ width: "100%" }}
              onClick={() => getToRegister()}
            >
              Create new account
            </CustomButton>
          </div>
        </div>
      </Box>
    </BackgroundImageLayout>
  );
};

/**
 * You can get access to the history object's properties via the useLocation, useNavigate, useParams, ... hooks.
 */
export default Login;
