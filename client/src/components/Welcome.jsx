import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';

import './Welcome.css';

class Welcome extends PureComponent {
  render() {
    return (
      <div>
        <h1 className="title">Welcome to Shufflr!</h1>
        <h5 className="intro">Shufflr is an app that allows students to have text conversations</h5>
        <h5 className="intro">with random peers (similar to Omegle), restricted to a college environment.</h5>
        <h5 className="intro">We want to help better connect our college community during times where we cannot</h5>
        <h5 className="intro">meet in person, either due to COVID, or during holiday seasons.</h5>
        <Col className="text-center">
          <Link to="login">
            <Button className="button-link" variant="purple">Log In</Button>
            {' '}
          </Link>
          <Link to="create-account">
            <Button className="button-link" variant="purple">Create Account</Button>
          </Link>
        </Col>
      </div>
    );
  }
}

export default Welcome;
