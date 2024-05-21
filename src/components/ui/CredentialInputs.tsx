import GameFormField from "./GameFormField";
import React from "react";
import PropTypes from "prop-types";
import "../../helpers/limitInput.js"
import { limitInput } from "../../helpers/limitInput";


const CredentialInputs = (props) => {

  return (
    <div>
      <GameFormField
        label="Username"
        maxLength={30}
        value={props.username}
        onChange={(un: string) => props.setUsername(un)}
      />
      <div style={{ margin: "10px 0" }}></div>
      <GameFormField
        label="Password"
        type="password"
        maxLength={30}
        value={props.password}
        onChange={(p) => props.setPassword(p)}
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