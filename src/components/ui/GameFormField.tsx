import * as React from "react";
import TextField from "@mui/material/TextField";
import PropTypes from "prop-types";
import { InputAdornment, IconButton } from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

const GameFormField = (props) => {
  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <div>
      <TextField
        id="outlined-basic"
        label={props.label}
        type={props.type === "password" && !showPassword ? "password" : "text"}
        inputProps={{maxLength: props.maxLength}}
        variant="outlined"
        defaultValue={props.value}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => props.onChange(event.target.value)}
        sx={{
          "& label": {
            fontFamily: "Londrina Solid, cursive",
          },
          "& input": {
            fontFamily: "Londrina Solid, cursive"
          },
          width: "100%", // Ensures that the input field takes the full width of its container
        }}
        InputProps={{
          endAdornment: props.type === "password" ? (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}
                edge="end"
                sx={{ width: "48px" }} // Ensures the icon button has a consistent width
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ) : null
        }}
      />
    </div>
  );
};

GameFormField.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  maxLength: PropTypes.number,
  onChange: PropTypes.func,
  type: PropTypes.string
};

export default GameFormField;