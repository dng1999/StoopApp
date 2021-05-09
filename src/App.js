import React, {useEffect, useState} from 'react';
import { BrowserRouter as Router, Switch, Link } from 'react-router-dom';
import { GuardProvider, GuardedRoute } from 'react-router-guards';
import { toast, ToastContainer } from "react-toastify";
import io from 'socket.io-client';

import Map from './HomeScreen';
import Login from "./Login";
import Register from "./Register";
import SettingScreen from "./Settings";
import NavBar from "./NavigationBar";

import './App.css';

let token = null;

const socket = io();

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
  const [initialized, setInitialized] = useState(false);
  const rerender = useState(0)[1];

  const subscribeToListingAlerts = () => {
    socket.on('echo', function(data){
      toast.info(data.echo);
    });
  };

  function testClick(){
    socket.emit("set_taken", "test");
  };

  function setToken(newToken) {
    token = newToken;
    rerender(Math.random());
  }

  useEffect(() => {
   if (!initialized) {
      subscribeToListingAlerts();
    }
  });

  return (
    <Router>
      <ul>
        <li><button onClick = {testClick}>Test Alert</button></li>
      </ul>
      <GuardProvider guards={[requireLogin]}>
        <Switch>
          <GuardedRoute path="/login">
            <Login setToken={setToken} logout={false}/>
          </GuardedRoute>
          <GuardedRoute path="/register">
            <Register setToken={setToken}/>
          </GuardedRoute>
          <GuardedRoute path="/" exact component={Map} meta={{ auth: true }} />
          <GuardedRoute path="/settings" exact component={SettingScreen} meta={{ auth: true }} />
          <GuardedRoute path="/logout" meta={{ auth: true }}>
            <Login setToken={setToken} logout={true}/>
          </GuardedRoute>
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