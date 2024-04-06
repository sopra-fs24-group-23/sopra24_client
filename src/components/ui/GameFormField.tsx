import * as React from "react";
import TextField from "@mui/material/TextField";
import PropTypes from "prop-types";

const GameFormField = (props) => {
  return (
    <div>
      <TextField id="outlined-basic" label={props.label} variant="outlined" defaultValue={props.value} onChange={(event: React.ChangeEvent<HTMLInputElement>) => props.onChange(event.target.value)}
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
  onChange: PropTypes.func,
};

export default GameFormField;