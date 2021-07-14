import React, { Component } from 'react';
import * as Yup from 'yup';
import { withRouter } from 'react-router-dom';

import { accountService } from '../services';

class CreateAccount extends Component {
  constructor(props) {
    super(props);
    this.state = { email: '', password: '', status: '' };

    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.validationSchema = Yup.object().shape({
      email: Yup.string()
        .email('Email is invalid')
        .required('Email is required'),
      password: Yup.string()
        .min(8, 'Password must be at least 8 characters')
        .required('Password is required'),
    });
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
    const form = { email, password };
    this.validationSchema.validate(form)
      .then(() => {
        accountService.createAccount(form)
          .then((response) => {
            console.log(response);
            this.setState({ status: 'Registration successful, please check your email for verification instructions' });
          })
          .catch((error) => {
            this.setState({ status: `Backend error, ${error}` });
          });
      })
      .catch((err) => {
        this.setState({ status: err.errors });
      });
  }

  render() {
    const { email, password, status } = this.state;
    return (
      <div>
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
          <input type="submit" value="Create Account" />
        </form>
        <div>
          {status}
        </div>
      </div>
    );
  }
}

export default withRouter(CreateAccount);
