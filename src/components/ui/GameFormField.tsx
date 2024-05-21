import * as React from "react";
import TextField from "@mui/material/TextField";
import PropTypes from "prop-types";

const GameFormField = (props) => {
  return (
    <div>
      <TextField
        id="outlined-basic"
        label={props.label}
        type={props.type}
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
        }} />
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