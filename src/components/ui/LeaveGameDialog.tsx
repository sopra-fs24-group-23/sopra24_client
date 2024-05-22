import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from "@mui/material";
import CustomButton from "./CustomButton";

interface LeaveGameDialogProps {
  open: boolean;
  onClose: () => void;
  onLeave: () => void;
}

const LeaveGameDialog: React.FC<LeaveGameDialogProps> = ({ open, onClose, onLeave }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Leave the game?</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to leave the game?
          You will be returned to your profile page and all your progress in the current game will be lost.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <CustomButton onClick={onLeave}>Leave</CustomButton>
        <CustomButton onClick={onClose}>Stay</CustomButton>
      </DialogActions>
    </Dialog>
  );
};

export default LeaveGameDialog;