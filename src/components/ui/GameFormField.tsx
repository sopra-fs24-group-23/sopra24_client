import * as React from 'react';
//import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import PropTypes from "prop-types";
import FormField from "./FormField";

const GameFormField = (props) => {
  return (
    <div>
      <TextField id="outlined-basic" label={props.label} variant="outlined" defaultValue={props.value} onChange={(event: React.ChangeEvent<HTMLInputElement>) => props.onChange(event.target.value)} />
    </div>
  );
};

GameFormField.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
};

export default GameFormField;