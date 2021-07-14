import React, { Component } from 'react';

import Login from './Login';
import CreateAccount from './CreateAccount';

class LoginOrCreateAccount extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoginOpen: true,
      isCreateAccountOpen: false,
    };

    this.showLogin = this.showLogin.bind(this);
    this.showCreateAccount = this.showCreateAccount.bind(this);
  }

  showLogin() {
    this.setState({ isLoginOpen: true, isCreateAccountOpen: false });
  }

  showCreateAccount() {
    this.setState({ isLoginOpen: false, isCreateAccountOpen: true });
  }

  render() {
    const { isLoginOpen, isCreateAccountOpen } = this.state;

    return (
      <div>
        <button type="button" onClick={this.showLogin}>Login</button>
        <button type="button" onClick={this.showCreateAccount}>Register</button>
        <div>
          {isLoginOpen && <Login />}
          {isCreateAccountOpen && <CreateAccount />}
        </div>
      </div>
    );
  }
}

export default LoginOrCreateAccount;
