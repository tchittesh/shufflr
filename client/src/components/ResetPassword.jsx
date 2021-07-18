import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import { accountService } from '../services';

class ResetPassword extends Component {
  constructor(props) {
    super(props);
    const { match } = this.props;
    this.state = { password: '', status: ['', ''], token: match.params.token };

    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.resetStatus = this.resetStatus.bind(this);

    this.validationSchema = Yup.object().shape({
      token: Yup.string(),
      password: Yup.string()
        .min(8, 'Password must be at least 8 characters')
        .required('Password is required'),
    });
  }

  handlePasswordChange(event) {
    this.setState({ password: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();
    const { password, token } = this.state;
    const form = { password, token };
    this.validationSchema.validate(form)
      .then(() => {
        accountService.resetPassword(form)
          .then((response) => {
            console.log(response);
            this.setState({ status: ['Password changed.', 'success'] });
          })
          .catch(() => {
            this.setState({ status: ['Failed to change password.', 'danger'] });
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
    const { password, status } = this.state;
    const [message, alertType] = status;
    return (
      <Col md="5">
        <Card className="text-center">
          <Card.Header as="h5">Reset Password</Card.Header>
          <Card.Body>
            <Form onSubmit={this.handleSubmit}>
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
                Reset Password
              </Button>
            </Form>
          </Card.Body>
        </Card>
        {message !== ''
              && (
              <Alert variant={alertType} dismissible className="topPadded" onClose={this.resetStatus}>
                {message}
              </Alert>
              )}
      </Col>
    );
  }
}
ResetPassword.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  match: PropTypes.object.isRequired,
};

export default withRouter(ResetPassword);
