import GameFormField from "./GameFormField";
import React from "react";
import PropTypes from "prop-types";

const CredentialInputs = (props) => {
  return (
    <div>
      <GameFormField
        label="Username"
        value={props.username}
        onChange={(un: string) => props.setUsername(un)}
      />
      <div style={{ margin: "10px 0" }}></div>
      <GameFormField
        label="Password"
        type="password"
        value={props.password}
        onChange={(n) => props.setPassword(n)}
      />
    </div>
  )
}

CredentialInputs.propTypes = {
  username: PropTypes.string,
  password: PropTypes.string,
  setPassword: PropTypes.func,
  setUsername: PropTypes.func
}

export default CredentialInputs;