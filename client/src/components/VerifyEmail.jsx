import React, { Component } from 'react';
import { BrowserRouter as Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';

import { accountService } from '../services';

class VerifyEmail extends Component {
  constructor(props) {
    super(props);
    this.state = { verified: false, message: 'Verifying your email...' };

    const { match } = this.props;
    accountService.verifyEmail(match.params.token)
      .then((response) => {
        console.log(response);
        this.setState({ message: response.statusText });
      }).catch(() => {
        this.setState({ message: 'Authentication Failed' });
      });
  }

  render() {
    const { verified, message } = this.state;
    if (verified) {
      return <Redirect to="/chat" />;
    }
    return (
      <div>
        {message}
      </div>
    );
  }
}
VerifyEmail.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  match: PropTypes.object.isRequired,
};

export default VerifyEmail;
