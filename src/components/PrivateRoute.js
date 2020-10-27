import "antd/dist/antd.css";

import React, { useContext } from "react";
import { Redirect, Route } from "react-router-dom";

import { Context as AuthContext } from "../context/AuthContext";

function PrivateRoute({ children, ...rest }) {

  const {
    state: { isLoggedIn },
  } = useContext(AuthContext);
  
    return (
      <Route
        {...rest}
        render={({ location }) =>
        isLoggedIn ? (
            children
          ) : (
            <Redirect
              to={{
                pathname: "/login",
                state: { from: location }
              }}
            />
          )
        }
      />
    );
  }

export default PrivateRoute;