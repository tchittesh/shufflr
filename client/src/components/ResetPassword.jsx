import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { accountService } from '../services';

class ResetPassword extends Component {
  constructor(props) {
    super(props);
    const { match } = this.props;
    this.state = { password: '', message: '', token: match.params.token };

    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.validationSchema = Yup.object().shape({
      token: Yup.string(),
      password: Yup.string()
        .min(8, 'Password must be at least 8 characters')
        .required('Password is required'),
    });
  }

  handlePasswordChange(event) {
    this.setState({ password: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();
    const { password, token } = this.state;
    const form = { password, token };
    this.validationSchema.validate(form)
      .then(() => {
        accountService.resetPassword(form)
          .then((response) => {
            console.log(response);
            this.setState({ message: 'Password changed.' });
          })
          .catch(() => {
            this.setState({ message: 'Failed to change password.' });
          });
      })
      .catch((err) => {
        this.setState({ message: err.errors });
      });
  }

  render() {
    const { password, message } = this.state;
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          New Password:
          <input type="text" value={password} onChange={this.handlePasswordChange} />
        </label>
        <br />
        <input type="submit" value="Set New Password" />
        <div>
          {message}
        </div>
      </form>
    );
  }
}
ResetPassword.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  match: PropTypes.object.isRequired,
};

export default withRouter(ResetPassword);
