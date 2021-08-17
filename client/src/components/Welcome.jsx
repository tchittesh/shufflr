import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';

import './Welcome.css';

class Welcome extends PureComponent {
  render() {
    return (
      <div className="dflex-flex row">
        <div>
          <h1 className="intro">Chat with</h1>
          <h1 className="intro">your peers,</h1>
          <h1 className="intro">make new</h1>
          <h1 className="intro">friends</h1>
          <Col className="text-left">
            <Link to="login">
              <Button className="button-link" variant="light">Log In</Button>
            </Link>
            <Link to="create-account">
              <Button className="button-link" variant="light">Create Account</Button>
            </Link>
          </Col>
        </div>
      </div>

    );
  }
}

export default Welcome;
