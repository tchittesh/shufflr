import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';

import { accountService } from '../services';
import './Login.css';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = { email: '', password: '', failed: false };

    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.resetFailed = this.resetFailed.bind(this);
  }

  handleEmailChange(event) {
    this.setState({ email: event.target.value });
  }

  handlePasswordChange(event) {
    this.setState({ password: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();
    const { email, password } = this.state;
    const { history } = this.props;
    accountService.login({ email, password })
      .then((response) => {
        console.log(response);
        history.push('/chat');
      })
      .catch(() => {
        this.setState({ failed: true });
      });
  }

  resetFailed() {
    this.setState({ failed: false });
  }

  render() {
    const { email, password, failed } = this.state;
    return (
      <Container className="min-vh-100">
        <Row className="min-vh-100 justify-content-center align-items-center">
          <Col md="5">
            <Card className="text-center">
              <Card.Header as="h5">Log In</Card.Header>
              <Card.Body>
                <Form onSubmit={this.handleSubmit}>
                  <Form.Floating className="mb-3">
                    <Form.Control
                      id="floatingInputCustom"
                      type="email"
                      placeholder="name@example.com"
                      onChange={this.handleEmailChange}
                      value={email}
                    />
                    <label htmlFor="floatingInputCustom">Email address</label>
                  </Form.Floating>
                  <Form.Floating>
                    <Form.Control
                      id="floatingPasswordCustom"
                      type="password"
                      placeholder="Password"
                      onChange={this.handlePasswordChange}
                      value={password}
                    />
                    <label htmlFor="floatingPasswordCustom">Password</label>
                  </Form.Floating>
                  <Button variant="primary" type="submit" className="topPadded">
                    Log In
                  </Button>
                </Form>
              </Card.Body>
            </Card>
            {failed
              && (
              <Alert variant="danger" dismissible className="topPadded" onClose={this.resetFailed}>
                Login failed.
              </Alert>
              )}
          </Col>
        </Row>
      </Container>
    );
  }
}
Login.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  history: PropTypes.object.isRequired,
};

export default withRouter(Login);
