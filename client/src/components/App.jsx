import React, { PureComponent } from 'react';
import {
  BrowserRouter as Router, Switch, Route, Redirect,
} from 'react-router-dom';

import LoginOrCreateAccount from './LoginOrCreateAccount';
import Chat from './Chat';
import VerifyEmail from './VerifyEmail';

class App extends PureComponent {
  render() {
    return (
      <div className="App">
        <Router>
          <Switch>
            <Route exact path="/" render={() => (<Redirect to="/login" />)} />
            <Route path="/login" component={LoginOrCreateAccount} />
            <Route path="/chat" component={Chat} />
            <Route path="/verify-email/:token" component={VerifyEmail} />
          </Switch>
        </Router>
      </div>
    );
  }
}

export default App;
