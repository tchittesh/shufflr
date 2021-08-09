import React, { Component } from 'react';
import * as Yup from 'yup';
import { Link, withRouter } from 'react-router-dom';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';

import { accountService } from '../services';

import './base.css';

class CreateAccount extends Component {
  constructor(props) {
    super(props);
    this.state = { email: '', password: '', status: ['', ''] };

    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.resetStatus = this.resetStatus.bind(this);

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
    this.validationSchema.validate(form)
      .then(() => {
        accountService.createAccount(form)
          .then((response) => {
            console.log(response);
            this.setState({ status: ['Registration successful, please check your email for verification instructions', 'success'] });
          })
          .catch((error) => {
            this.setState({ status: [`Backend error, ${error}`, 'danger'] });
          });
      })
      .catch((err) => {
        this.setState({ status: [err.errors, 'danger'] });
      });
  }

  resetStatus() {
    this.setState({ status: ['', ''] });
  }

  render() {
    const { email, password, status } = this.state;
    const [message, alertType] = status;
    return (
      <Col md="5">
        <Card className="text-center">
          <Card.Header as="h5">Create Account</Card.Header>
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
              <Button variant="primary" type="submit" className="topMargin">
                Sign up
              </Button>
            </Form>
          </Card.Body>
        </Card>
        <Card className="text-center topMargin">
          <Card.Body>
            <Link to="login">
              <Button variant="link">
                Already have an account?
              </Button>
            </Link>
          </Card.Body>
        </Card>
        {message !== ''
              && (
              <Alert variant={alertType} dismissible className="topMargin" onClose={this.resetStatus}>
                {message}
              </Alert>
              )}
      </Col>
    );
  }
}

export default withRouter(CreateAccount);
