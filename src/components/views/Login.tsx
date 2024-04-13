import React, { useContext, useState } from "react";
import { api, handleError } from "helpers/api";
import User from "models/User";
import { useNavigate } from "react-router-dom";
import BackgroundImageLayout from "styles/views/BackgroundImageLayout";
import GameFormField from "components/ui/GameFormField";
import CustomButton from "components/ui/CustomButton";
import Box from "@mui/material/Box";
import UserContext from "../../contexts/UserContext";
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from "@mui/material";

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState<string>(null);
  const [password, setPassword] = useState<string>(null);
  const { setUser } = useContext(UserContext);
  const [loginError, setLoginError] = useState("");
  const [isErrorDialogOpen, setIsErrorDialogOpen] = useState(false);

  const doLogin = async () => {
    try {
      const requestBody = JSON.stringify({ username, password });
      const response = await api.post("/login", requestBody);

      // Get the returned user and update a new object.
      const user = new User(response.data);
      localStorage.setItem("token", user.token)

      // Store user to the context.
      setUser(user);

      // Login successfully worked --> navigate to Homepage
      navigate("/homepage");
    } catch (error) {
      let errorMessage = `Something went wrong during the login: \n${handleError(error)}`;
      if (error.response) {
        // Check for specific error for incorrect credentials
        if (error.response.status === 400 && error.response.data.error === "Bad Request") {
          errorMessage = "Your login credentials are incorrect. Please try again.";
        } else {
          errorMessage = error.response.data.message || errorMessage;
        }
      }
      setLoginError(errorMessage);
      setIsErrorDialogOpen(true);
    }
  };

  const getToRegister = () => {
    navigate("/register");
  }

  return (
    <BackgroundImageLayout>
      <Box sx={{
        position: "absolute",
        top: "50%",
        left: "25%",
        transform: "translate(-50%, -50%)",
        width: "clamp(300px, 50%, 500px)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}>
        <div className="login form">
          <img src="/Images/logo.png" alt="Logo" style={{ maxWidth: "400px" }} />
          <div style={{ display: "flex", flexDirection: "column", width: "100%", alignItems: "center" }}>
            <GameFormField
              label="Username"
              value={username}
              onChange={(un: string) => setUsername(un)}
            />
            <div style={{ margin: "10px 0" }}></div>
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
        </div>
      </Box>
      <Dialog
        open={isErrorDialogOpen}
        onClose={() => setIsErrorDialogOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"We can't log you in."}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {loginError}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <CustomButton onClick={() => setIsErrorDialogOpen(false)}>
            Close
          </CustomButton>
        </DialogActions>
      </Dialog>
    </BackgroundImageLayout>
  );
};

/**
 * You can get access to the history object's properties via the useLocation, useNavigate, useParams, ... hooks.
 */
export default Login;
