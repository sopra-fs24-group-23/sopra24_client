import React, { useMemo, useState } from "react";
import UserContext from "../../contexts/UserContext";
import PropTypes from "prop-types";

const UserProvider = ( { children } ) => {
  const [user, setUser] = useState(null);

  const contextValue = useMemo(() => ({
    user,
    setUser
  }), [user, setUser])

  return(
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
  )
}

UserProvider.propTypes = {
  children: PropTypes.node,
};

export default UserProvider;