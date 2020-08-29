import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import {Auth0Provider} from '@auth0/auth0-react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'hover.css/css/hover-min.css';

ReactDOM.render(
  <Auth0Provider
    domain="rifan-dev.au.auth0.com"
    clientId="3KIs0enh1PZGPb3SHQEyjXvZUkwQav9K"
    redirectUri={process.env.REACT_APP_BASE_URL}
    scope="read:current_user update:current_user_metadata"
  >
    <App />
  </Auth0Provider>,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
