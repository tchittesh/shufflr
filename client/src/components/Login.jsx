import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';

import { accountService } from '../services';
import './base.css';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '', password: '', failed: false, status: '',
    };

    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.resetFailedAndStatus = this.resetFailedAndStatus.bind(this);

    this.validationSchema = Yup.object().shape({
      email: Yup.string()
        .email('Email is invalid')
        .matches(/^.+@((andrew.cmu)|(princeton)).edu$/,
          'Invalid school domain (requires andrew.cmu.edu or princeton.edu)')
        .required('Email is required'),
      password: Yup.string()
        .min(8, 'Password must be at least 8 characters')
        .required('Password is required'),
    });
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
    const form = { email, password };
    const { history } = this.props;
    this.validationSchema.validate(form)
      .then(() => {
        accountService.login({ email, password })
          .then(() => {
            history.push('/home');
          })
          .catch(() => {
            this.setState({ failed: true, status: 'Login failed' });
          });
      })
      .catch((err) => {
        this.setState({ failed: true, status: err.errors });
      });
  }

  resetFailedAndStatus() {
    this.setState({ failed: false, status: '' });
  }

  render() {
    const {
      email, password, failed, status,
    } = this.state;
    return (
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
              <Button variant="primary" className="topMargin" type="submit">
                Log In
              </Button>
            </Form>
          </Card.Body>
        </Card>
        <Card className="text-center topMargin">
          <Card.Body>
            <Row className="align-items-center justify-content-center">
              <Col>
                <Link to="create-account">
                  <Button variant="link">
                    Don&apos;t have an account?
                  </Button>
                </Link>
              </Col>
            </Row>
            <Row className="align-items-center justify-content-center">
              <Col>
                <Link to="forgot-password">
                  <Button variant="link">
                    Forgot your password?
                  </Button>
                </Link>
              </Col>
            </Row>
          </Card.Body>
        </Card>
        {failed && status !== '' && (
          <Alert variant="danger" dismissible className="topMargin" onClose={this.resetFailed}>
            {status}
          </Alert>
        )}
      </Col>
    );
  }
}
Login.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  history: PropTypes.object.isRequired,
};

export default withRouter(Login);
