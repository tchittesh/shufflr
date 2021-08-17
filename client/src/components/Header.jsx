import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Navbar from 'react-bootstrap/Navbar';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';

import logo from '../assets/logo.png';
import { accountService } from '../services';
import './Header.css';

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = { loggingOut: false };

    this.logOut = this.logOut.bind(this);
  }

  logOut() {
    const { loggingOut } = this.state;
    if (loggingOut) {
      return;
    }
    this.setState({ loggingOut: true });
    accountService.logout()
      .then(() => {
        this.setState({ loggingOut: false });
      })
      .catch(() => {
        // TODO: should we "log out" on the frontend even if the backend fails?
        this.setState({ loggingOut: false });
      });
  }

  render() {
    const { loggingOut } = this.state;
    const { email } = this.props;

    return (
      <Navbar className="d-flex justify-content-between" bg="primary" variant="primary" fixed="top" style={{ paddingTop: 10, paddingBottom: 10 }}>
        <div style={{ width: 100, marginLeft: 20 }} />
        <Link to="/">
          <img
            alt="Shufflr"
            src={logo}
            className="img-fluid-vertical mx-auto d-block"
            height="75"
          />
        </Link>
        {email
          ? (
            <Button
              variant="outline-light"
              type="button"
              className="topPadded"
              style={{
                width: 100, float: 'right', marginRight: 20,
              }}
              onClick={this.logOut}
              disabled={loggingOut}
            >
              Log Out
            </Button>
          ) : <div style={{ width: 100, marginRight: 20 }} />}
      </Navbar>
    );
  }
}
Header.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  email: PropTypes.string,
};
Header.defaultProps = {
  email: null,
};

export default Header;
