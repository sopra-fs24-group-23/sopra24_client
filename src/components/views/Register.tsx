import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import FormField from "components/ui/FormField";
import { api, handleError } from "helpers/api";
import User from "models/User";
import BaseContainer from "components/ui/BaseContainer";
//import { Button } from "components/ui/Button";
import Button from '@mui/material/Button';
import BackgroundImageLayout from 'styles/views/BackgroundImageLayout';

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
      <div className="login container">
        <div className="login form">
          <FormField
            label="Username"
            value={username}
            onChange={(un: string) => setUsername(un)}
          />
          <FormField
            label="Password"
            value={password}
            onChange={(n) => setPassword(n)}
          />
          <div className="login button-container">
            <Button
              disabled={!username || !password}
              sx={{ width: '100%' }}
              onClick={() => doRegister()}
            >
              Register
            </Button>
          </div>
          <div className="login button-container">
            <Button
              sx={{ width: '100%' }}
              onClick={() => getToLogin()}
            >
              Back to login
            </Button>
          </div>
        </div>
      </div>
    </BackgroundImageLayout>
  );
};

export default Register;