import React from 'react';
import logo from './logo.svg';
import './App.css';
import LoginButton from './landing/login-button';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import Dashboard from './dashboard';

function App(){
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route path="/dashboard">
            <Dashboard />
          </Route>
          <Route path="/">
            <header className="App-header">
              <img src={logo} className="App-logo" alt="logo" />
              <LoginButton></LoginButton>
            </header>
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
