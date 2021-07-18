import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import { accountService } from '../services';

class ForgotPassword extends Component {
  constructor(props) {
    super(props);
    this.state = { email: '', message: '' };

    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.resetMessage = this.resetMessage.bind(this);
  }

  handleEmailChange(event) {
    this.setState({ email: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();
    const { email } = this.state;
    accountService.forgotPassword(email)
      .then((response) => {
        console.log(response);
        this.setState({ message: 'Sent an email with reset password instructions.' });
      })
      .catch(() => {
        this.setState({ message: 'Sent an email with reset password instructions.' });
      });
  }

  resetMessage() {
    this.setState({ message: '' });
  }

  render() {
    const { email, message } = this.state;
    return (
      <Col md="5">
        <Card className="text-center">
          <Card.Header as="h5">Forgot Password</Card.Header>
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
              <Button variant="primary" type="submit" className="topPadded">
                Submit
              </Button>
            </Form>
          </Card.Body>
        </Card>
        <Card className="text-center topMargin">
          <Card.Body>
            <Link to="login">
              <Button variant="link">
                Back to login
              </Button>
            </Link>
          </Card.Body>
        </Card>
        {message !== ''
              && (
              <Alert variant="success" dismissible className="topPadded" onClose={this.resetMessage}>
                {message}
              </Alert>
              )}
      </Col>
    );
  }
}

export default withRouter(ForgotPassword);
