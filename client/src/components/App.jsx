import React, { PureComponent } from 'react';
import {
  BrowserRouter as Router, Switch, Route, Redirect,
} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import Login from './Login';
import CreateAccount from './CreateAccount';
import Chat from './Chat';
import VerifyEmail from './VerifyEmail';
import ForgotPassword from './ForgotPassword';
import ResetPassword from './ResetPassword';

class App extends PureComponent {
  render() {
    return (
      <div className="App">
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css"
          integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC"
          crossOrigin="anonymous"
        />
        <link rel="stylesheet" type="text/css" href="//fonts.googleapis.com/css?family=Amaranth" />
        <Router>
          <Switch>
            <Route exact path="/" render={() => (<Redirect to="/login" />)} />
            <Route path="/login" component={Login} />
            <Route path="/create-account" component={CreateAccount} />
            <Route path="/chat" component={Chat} />
            <Route path="/forgot-password" component={ForgotPassword} />
            <Route path="/reset-password/:token" component={ResetPassword} />
            <Route path="/verify-email/:token" component={VerifyEmail} />
          </Switch>
        </Router>
      </div>
    );
  }
}

export default App;
