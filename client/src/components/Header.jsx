import React, { PureComponent } from 'react';
import { BrowserRouter as Redirect } from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

class Header extends PureComponent {
  render() {
    return (
    // <Col>
      <Navbar bg="primary" variant="primary" fixed="top">
        <Container>
          <Navbar.Brand href="#home">
            <img
              alt=""
              src="/logo.png"
              // width="30"
              height="50"
            />
          </Navbar.Brand>
        </Container>
      </Navbar>
    // </Col>
    );
  }
}

export default Header;
