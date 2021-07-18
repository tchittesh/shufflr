import React, { PureComponent } from 'react';
import Navbar from 'react-bootstrap/Navbar';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';

import './Header.css';

class Header extends PureComponent {
  render() {
    return (
      <Navbar bg="primary" variant="primary" fixed="top" className="justify-content-center">
        <Navbar.Brand className="mx-auto">
          <Link to="/">
            <img
              alt="Shufflr"
              src={logo}
              className="img-fluid-vertical mx-auto d-block"
              height="75"
            />
          </Link>
        </Navbar.Brand>
      </Navbar>
    );
  }
}

export default Header;
