import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
//import App from './App';
//import Map from './HomeScreen';
//import HSControl from './HomeScreenControl';
import Settings from './Settings';
import reportWebVitals from './reportWebVitals';

function testFunction() {
  console.log("Hello world")
}

ReactDOM.render(
  <React.StrictMode>
    <Settings />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
