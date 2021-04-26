import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'jquery/dist/jquery.js';
import 'bootstrap/dist/js/bootstrap.bundle.js';
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import Map from './HomeScreen'
//import Map from './HomeScreen';
//import HSControl from './HomeScreenControl';
//import Settings from './Settings';
import reportWebVitals from './reportWebVitals';
import axios from 'axios';
import { Config } from './config';
axios.defaults.baseURL = Config.apiUrl;
// document.documentElement.requestFullscreen();
ReactDOM.render(
  <React.StrictMode>
    <Map />
    {/* <HSControl onClick={testFunction} /> */}
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
