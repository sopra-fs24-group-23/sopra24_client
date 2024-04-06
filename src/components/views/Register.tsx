import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameFormField from "components/ui/GameFormField";
import { api, handleError } from "helpers/api";
import User from "models/User";
import BaseContainer from "components/ui/BaseContainer";
//import { Button } from "components/ui/Button";
import BackgroundImageLayout from "styles/views/BackgroundImageLayout";
import CustomButton from "components/ui/CustomButton";
import Box from "@mui/material/Box";

const Register = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState<string>(null);
  const [password, setPassword] = useState<string>(null);

  const doRegister = async () => {
    try {
      const requestBody = JSON.stringify({ username, password });
      const response = await api.post("/users", requestBody);

      // Get the returned user and update a new object.
      const user = new User(response.data);

      // Store the token into the local storage.
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("userId", response.data.id);
      console.log(response.data);

      navigate("/homepage/" + response.data.id);
    } catch (error) {
      alert(`Something went wrong during the login: \n${handleError(error)}`);
    }
  };

  const getToLogin = () => {
    navigate("/login");
  };

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
              disabled={!username || !password}
              sx={{ width: "100%" }}
              onClick={() => doRegister()}
            >
              Register
            </CustomButton>
          </div>
          <div style={{ margin: "10px 0" }}></div>
          <div className="login button-container">
            <CustomButton
              sx={{ width: "100%" }}
              onClick={() => getToLogin()}
            >
              Back to login
            </CustomButton>
          </div>
        </div>
      </Box>
    </BackgroundImageLayout>
  );
};

export default Register;