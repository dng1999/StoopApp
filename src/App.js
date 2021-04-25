import React, {useState} from 'react';

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";

import './App.css';

let token = null;

const requireLogin = (to, from, next) => {
  if (to.meta.auth) {
    if (token != null) {
      next();
    }
    next.redirect('/Login');
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
        <li><Link to="/Login">Login</Link></li>
        <li><Link to="/Register">Register</Link></li>
      </ul>
      <GuardProvider guards={[requireLogin]}>
        <Switch>
          <GuardedRoute path="/" exact component={Home} meta={{ auth: true }} />
          <GuardedRoute path="/Login" exact component={Login}/>
          <GuardedRoute path="/Register" exact component={Register}/>
        </Switch>
      </GuardProvider>
    </Router>
  );
}

export default App;