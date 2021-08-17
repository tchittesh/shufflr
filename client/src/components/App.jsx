import React, { Component } from 'react';
import {
  BrowserRouter as Router, // Switch, Route, Redirect,
} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';

// import Login from './Login';
// import CreateAccount from './CreateAccount';
// import Home from './Home';
// import VerifyEmail from './VerifyEmail';
// import ForgotPassword from './ForgotPassword';
// import ResetPassword from './ResetPassword';
import Header from './Header';
import Welcome from './Welcome';
import { accountService } from '../services';

import './base.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { cookieChecked: false, email: accountService.emailAddress };
  }

  componentDidMount() {
    accountService.checkCookie()
      .then(() => this.setState({ cookieChecked: true }))
      .catch(() => this.setState({ cookieChecked: true }));
    this.subscription = accountService.emailObservable.subscribe((email) => {
      this.setState({ email });
    });
  }

  componentWillUnmount() {
    this.subscription.unsubscribe();
  }

  render() {
    const { cookieChecked, email } = this.state;

    if (cookieChecked) {
      return (
        <div className="App">
          <link rel="stylesheet" type="text/css" href="//fonts.googleapis.com/css?family=Amaranth" />
          <link rel="stylesheet" type="text/css" href="https://use.typekit.net/oov2wcw.css" />
          <Router>
            <Header className="vh-15" email={email} />
            <Container className="main-content min-vh-85 App">
              <Row className="min-vh-85 justify-content-center align-items-center">
                <Welcome />
                {/* <Switch>
                  <Route exact path="/">
                    {email ? <Redirect to="/home" /> : <Welcome />}
                  </Route>
                  <Route path="/login">
                    {email ? <Redirect to="/home" /> : <Login />}
                  </Route>
                  <Route path="/home">
                    {email ? <Home email={email} /> : <Redirect to="/" />}
                  </Route>
                  <Route path="/create-account" component={CreateAccount} />
                  <Route path="/forgot-password" component={ForgotPassword} />
                  <Route path="/reset-password/:token" component={ResetPassword} />
                  <Route path="/verify-email/:token" component={VerifyEmail} />
                </Switch> */}
              </Row>
            </Container>
          </Router>
        </div>
      );
    }
    return <div />;
  }
}

export default App;
