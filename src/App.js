import React, {useState} from 'react';
import { BrowserRouter as Router, Switch, Link } from 'react-router-dom';
import { GuardProvider, GuardedRoute } from 'react-router-guards';
import { ToastContainer } from "react-toastify";

import Map from './HomeScreen';
import Login from "./Login";
import Register from "./Register";
import SettingScreen from "./Settings";
import NavBar from "./NavigationBar";

import './App.css';

let token = null;

const requireLogin = (to, from, next) => {
  if (to.meta.auth) {
    if (token != null) {
      next();
    }
    next.redirect('/login');
  } else {
    next();
  }
};

function App() {
  const rerender = useState(0)[1];

  function setToken(newToken) {
    token = newToken;
    rerender(Math.random());
  }

  return (
    <Router>
      <GuardProvider guards={[requireLogin]}>
        <Switch>
          <GuardedRoute path="/login">
            <Login setToken={setToken} logout={false}/>
          </GuardedRoute> 
          <GuardedRoute path="/register">
            <Register setToken={setToken}/>
          </GuardedRoute>
          <GuardedRoute path="/" exact component={Map} />
          <GuardedRoute path="/settings" exact component={SettingScreen}/>
          <GuardedRoute path="/logout" exact component={Login}/>
        </Switch>
      </GuardProvider>
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={true}
      />
      {/* Navigation bar */}
      <NavBar />
    </Router>
  );
}

export default App;