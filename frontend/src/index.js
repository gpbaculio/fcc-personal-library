import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { installRelayDevTools } from 'relay-devtools';

import App from './App'

import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';


import * as serviceWorker from './serviceWorker';

// Useful for debugging, but remember to remove for a production deploy.
installRelayDevTools();



ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
  , document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
