import React, {useState} from 'react';
import { BrowserRouter as Router, Switch, Link } from 'react-router-dom';
import { GuardProvider, GuardedRoute } from 'react-router-guards';
import { ToastContainer } from "react-toastify";

import Map from './HomeScreen';
import Login from "./Login";
import Register from "./Register";

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
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/login">Login</Link></li>
        <li><Link to="/register">Register</Link></li>
      </ul>
      <GuardProvider guards={[requireLogin]}>
        <Switch>
          <GuardedRoute path="/" exact component={Map} />
          <GuardedRoute path="/login" exact component={Login}/>
          <GuardedRoute path="/register" exact component={Register}/>
        </Switch>
      </GuardProvider>
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={true}
      />
    </Router>
  );
}

export default App;