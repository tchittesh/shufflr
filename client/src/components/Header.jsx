import React, { PureComponent } from 'react';
import Navbar from 'react-bootstrap/Navbar';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import logo from '../assets/logo.png';

import './Header.css';

class Header extends PureComponent {
  render() {
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
      </Navbar>
    );
  }
}

export default Header;
