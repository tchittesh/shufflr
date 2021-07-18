import React, { PureComponent } from 'react';
import {
  BrowserRouter as Router, Switch, Route,
} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';

import Login from './Login';
import CreateAccount from './CreateAccount';
import Chat from './Chat';
import VerifyEmail from './VerifyEmail';
import ForgotPassword from './ForgotPassword';
import ResetPassword from './ResetPassword';
import Header from './Header';
import Home from './Home';

import './App.css';

class App extends PureComponent {
  render() {
    return (
      <div className="App">
        <link rel="stylesheet" type="text/css" href="//fonts.googleapis.com/css?family=Amaranth" />
        <Router>
          <Header />
          <Container className="main-content min-vh-85 App">
            <Row className="min-vh-85 justify-content-center align-items-center">
              <Switch>
                <Route exact path="/" component={Home} />
                <Route path="/login" component={Login} />
                <Route path="/create-account" component={CreateAccount} />
                <Route path="/chat" component={Chat} />
                <Route path="/forgot-password" component={ForgotPassword} />
                <Route path="/reset-password/:token" component={ResetPassword} />
                <Route path="/verify-email/:token" component={VerifyEmail} />
              </Switch>
            </Row>
          </Container>
        </Router>
      </div>
    );
  }
}

export default App;
