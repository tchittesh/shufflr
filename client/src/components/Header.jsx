import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Navbar from 'react-bootstrap/Navbar';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import logo from '../assets/logo.png';

import './Header.css';

class Header extends PureComponent {
  render() {
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
              variant="primary"
              type="button"
              className="topPadded"
              style={{
                width: 100, float: 'right', marginRight: 20, backgroundColor: 'purple',
              }}
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
