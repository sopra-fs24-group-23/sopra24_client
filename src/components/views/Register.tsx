import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import GameFormField from "components/ui/GameFormField";
import { api, handleError } from "helpers/api";
import User from "models/User";
import BackgroundImageLayout from "styles/views/BackgroundImageLayout";
import CustomButton from "components/ui/CustomButton";
import Box from "@mui/material/Box";
import UserContext from "../../contexts/UserContext";
import { DialogContentText, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import CredentialInputs from "../ui/CredentialInputs"

const Register = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState<string>(null);
  const [password, setPassword] = useState<string>(null);
  const { setUser } = useContext(UserContext)
  const [registerError, setRegisterError] = useState("");
  const [isErrorDialogOpen, setIsErrorDialogOpen] = useState(false);

  const doRegister = async () => {
    try {
      const requestBody = JSON.stringify({ username, password });
      const response = await api.post("/users", requestBody);

      // Get the returned user and update a new object.
      const user = new User(response.data);
      // store user to context
      setUser(user)
      localStorage.setItem("token", user.token)
      localStorage.setItem("id", user.id)

      navigate("/homepage");
    } catch (error) {
      let errorMessage = `Something went wrong during the registration: \n${handleError(error)}`;
      if (error.response) {
        // Check for specific error for non-unique username
        if (error.response.status === 400 && error.response.data.error === "Bad Request") {
          errorMessage = "This username is already taken. Please choose a different username!";
        } else {
          errorMessage = error.response.data.message || errorMessage;
        }
      }
      setRegisterError(errorMessage);
      setIsErrorDialogOpen(true);
    }
  };

  const getToLogin = () => {
    navigate("/login");
  };

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
            <CredentialInputs setUsername={setUsername} setPassword={setPassword} username={username} password={password}/>
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
        </div>
        <Dialog
          open={isErrorDialogOpen}
          onClose={() => setIsErrorDialogOpen(false)}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{"Registration Failed"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {registerError}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <CustomButton onClick={() => setIsErrorDialogOpen(false)}>
              Close
            </CustomButton>
          </DialogActions>
        </Dialog>
      </Box>
    </BackgroundImageLayout>
  );
};

export default Register;