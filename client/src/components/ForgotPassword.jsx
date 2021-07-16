import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { accountService } from '../services';

class ForgotPassword extends Component {
  constructor(props) {
    super(props);
    this.state = { email: '', message: '' };

    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleEmailChange(event) {
    this.setState({ email: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();
    const { email } = this.state;
    accountService.forgotPassword(email)
      .then((response) => {
        console.log(response);
        this.setState({ message: 'Sent a reset password link to your email.' });
      })
      .catch(() => {
        this.setState({ message: 'Sent a reset password link to your email.' });
      });
  }

  render() {
    const { email, message } = this.state;
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Email Address:
          <input type="text" value={email} onChange={this.handleEmailChange} />
        </label>
        <br />
        <input type="submit" value="Reset Password" />
        <div>
          {message}
        </div>
      </form>
    );
  }
}

export default withRouter(ForgotPassword);
