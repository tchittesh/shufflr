import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import './Welcome.css';
import exampleChat from '../assets/example_chat.png';

class Welcome extends PureComponent {
  render() {
    return (
      <Row>
        <Col className="welcome-col">
          <div className="welcome-section">
            <h1 className="intro">Chat with</h1>
            <h1 className="intro">your peers.</h1>
            <h1 className="intro">Make new</h1>
            <h1 className="intro">friends.</h1>
          </div>
          <div className="welcome-section">
            <p className="intro-small">
              Shufflr connects college communities across the nation.
              <br />
              Currently deployed at Carnegie Mellon University and Princeton University.
            </p>
          </div>
          <span className="section">
            <Link to="login">
              <Button className="button-link" variant="light" size="lg">Log In</Button>
            </Link>
            <Link to="create-account">
              <Button className="button-link" variant="light" size="lg">Create Account</Button>
            </Link>
          </span>
        </Col>
        <Col className="welcome-col">
          <img
            alt="Example Chat"
            src={exampleChat}
            className="example-chat mx-auto d-block"
          />
        </Col>
      </Row>
    );
  }
}

export default Welcome;
