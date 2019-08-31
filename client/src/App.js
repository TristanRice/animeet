import React, { Component } from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import logo from './logo.svg';
import Api from './utils/api';
import './App.css';

/*
import placeholder components
*/

import About from './components/placeholder/about';
import Login from './components/placeholder/login';

/*
Profile components
*/

import Slider from './components/slider';

/*
Auth components
*/

import Register from './components/auth/Register';

class Index extends Component {
  constructor(props) {
    super(props);

    this.validateToken = this.validateToken.bind(this);
  }

  validateToken(token) {
    return true;
  }

  render() {
    const token = localStorage.getItem("token");
    const isTokenValid = this.validateToken(token);
    return (
      <div>
        {!isTokenValid ? ( 
          <Redirect to="/login" />
        ) : (
          <Redirect to="/about" />
        )}
      </div>
    );
  }
}

class App extends Component {
  render( ) {
    return (
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={Index} />

          /*Routes for the placeholder pages*/
          <Route path="/about" component={About} />
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />

          /*Routes for the actual app*/
          <Route path="/app" component={Slider} />
        </Switch>
      </BrowserRouter>
    );
  }
}

export default App;
