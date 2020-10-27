import "./App.css";

import React, { useContext } from "react";
import { Route, BrowserRouter as Router, Switch } from "react-router-dom";

import { Context as AuthContext } from "./context/AuthContext";
import Dashboard from "./components/Dashboard"
import Login from "./components/Login";
import PrivateRoute from "./components/PrivateRoute";
import firebase from "./config/firebase";

function App() {
  const {
    state:{isLoading},
    setLoggedIn,
  } = useContext(AuthContext);
 
  React.useEffect(() => {

    const listener = firebase.auth().onAuthStateChanged((user) => {
      console.log("onauth");
      if (user) {
        setLoggedIn(true);

      } else {
        setLoggedIn(false);
      }
    });
    
    return () => listener;
  }, []);


  return (
    (!isLoading &&
    <Router>
      <Switch>
      <Route  exact path="/login" name="Login Page"> 
          <Login  />
        </Route>
        <PrivateRoute name="Home" path="/">
          <Dashboard/>
        </PrivateRoute>
      </Switch>
    </Router>
    )
  );
}

export default App;
