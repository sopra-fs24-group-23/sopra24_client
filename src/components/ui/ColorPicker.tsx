import React from "react";
import { Select, MenuItem, InputLabel } from "@mui/material";
import PropTypes from "prop-types";

const ColorPicker = ({ score, color, setColor }) => {
  const colorRequirements = {
    "#000000": 0, // black
    "#008000": 200, // green
    "#0000FF": 500, // blue
    "#FFA500": 1000, // orange
    "#FF0000": 2000, // red
    "#A020F0": 5000 // purple
  };

  const availableColors = Object.keys(colorRequirements).filter(
    color => score >= colorRequirements[color]
  );

  const handleChange = (event) => {
    setColor(event.target.value);
  };

  return (
    <div>
      <InputLabel id="color-picker-label" sx={{ fontFamily: "Londrina Solid, cursive", fontSize: "0.8rem" }}>
        Choose color
      </InputLabel>
      <Select labelId="color-picker-label" value={color} onChange={handleChange}>
        {availableColors.map((color) => (
          <MenuItem key={color} value={color}>
            <div style={{ backgroundColor: color, width: "100%", height: "20px" }} />
          </MenuItem>
        ))}
      </Select>
    </div>
  );
};

ColorPicker.propTypes = {
  score: PropTypes.number,
  color: PropTypes.string,
  setColor: PropTypes.func
}

export default ColorPicker;