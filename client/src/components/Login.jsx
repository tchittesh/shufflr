import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { accountService } from '../services';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = { email: '', password: '', message: '' };

    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleEmailChange(event) {
    this.setState({ email: event.target.value });
  }

  handlePasswordChange(event) {
    this.setState({ password: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();
    const { email, password } = this.state;
    const { history } = this.props;
    accountService.login({ email, password })
      .then((response) => {
        console.log(response);
        history.push('/chat');
      })
      .catch(() => {
        this.setState({ message: 'Login failed.' });
      });
  }

  render() {
    const { email, password, message } = this.state;
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Email Address:
          <input type="text" value={email} onChange={this.handleEmailChange} />
        </label>
        <br />
        <label>
          Password:
          <input type="text" value={password} onChange={this.handlePasswordChange} />
        </label>
        <br />
        <input type="submit" value="Log In" />
        <div>
          {message}
        </div>
      </form>
    );
  }
}
Login.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  history: PropTypes.object.isRequired,
};

export default withRouter(Login);
