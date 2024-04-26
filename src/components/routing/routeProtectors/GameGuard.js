import React, { useContext, useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import PropTypes from "prop-types";
import { api } from "../../../helpers/api";
import UserContext from "../../../contexts/UserContext";
import User from "../../../models/User";
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from "@mui/material";
import CustomButton from "components/ui/CustomButton";

/**
 * routeProtectors interfaces can tell the router whether or not it should allow navigation to a requested route.
 * They are functional components. Based on the props passed, a route gets rendered.
 * In this case, if the user is authenticated (i.e., a token is stored in the local storage)
 * <Outlet /> is rendered --> The content inside the <GameGuard> in the App.js file, i.e. the user is able to access the main app.
 * If the user isn't authenticated, the components redirects to the /login screen
 * @Guard
 */
export const GameGuard = () => {
  const { user, setUser } = useContext(UserContext)
  const token = localStorage.getItem("token")
  const id = localStorage.getItem("id")
  const [open, setOpen] = React.useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    if (token && id && user === null) {
      const fetchUser = async () => {
        try {
          const response = await api.get("/users/" + id);
          setUser(new User(response.data))
        } catch (e) {
          console.error("There was an error fetching the user: ", e);
          setOpen(true);
        }
      }
      fetchUser();
    }
  }, [token, id]);

  if (token && id) {
    return (
      <>
        <Outlet />
        <Dialog
          open={open}
          onClose={handleClose}
        >
          <DialogTitle>{"Error"}</DialogTitle>
          <DialogContent>
            <DialogContentText>
              There was an error fetching the user, you might need to log-in or register again.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <CustomButton onClick={handleClose}>
              Close
            </CustomButton>
          </DialogActions>
        </Dialog>
      </>
    );
  }
  else {
    return <Navigate to="/login" replace />;
  }
};

GameGuard.propTypes = {
  children: PropTypes.node
};