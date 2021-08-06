import React, { PureComponent } from 'react';
import Navbar from 'react-bootstrap/Navbar';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import logo from '../assets/logo.png';

import './Header.css';

class Header extends PureComponent {
  render() {
    return (
      <Navbar bg="primary" variant="primary" fixed="top" className="justify-content-center">
        <Navbar.Brand className="mx-auto">
          <div className="flex flex-row justify-between">
            <div style={{ width: 100 }}>
              Placeholder
            </div>
            <Link to="/">
              <img
                alt="Shufflr"
                src={logo}
                className="img-fluid-vertical mx-auto d-block"
                height="75"
              />
            </Link>
            <Button variant="primary" type="button" className="topPadded" style={{ width: 100 }}>
              Log Out
            </Button>
          </div>
        </Navbar.Brand>
      </Navbar>
    );
  }
}

export default Header;
