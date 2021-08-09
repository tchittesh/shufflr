import React, { Component } from 'react';
import { BrowserRouter as Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { accountService } from '../services';

class VerifyEmail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      verified: false, modalShow: true, responseVerified: false, message: 'Verifying your email...',
    };

    const { match } = this.props;
    accountService.verifyEmail(match.params.token)
      .then(() => {
        this.setState({ message: 'Your email has now been verified, happy chatting :)', responseVerified: true });
      }).catch(() => {
        this.setState({ message: 'Authentication Failed', responseVerified: true });
      });
  }

  render() {
    const {
      verified, message, modalShow, responseVerified,
    } = this.state;
    if (verified) {
      return <Redirect to="/chat" />;
    }
    return (
      <div>
        <Modal
          show={modalShow}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
          onClick={() => this.setState({ modalShow: false })}
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
              Email Verification
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>
              {message}
            </p>
          </Modal.Body>
          <Modal.Footer>
            <Button
              onClick={() => this.setState({ modalShow: false })}
              disabled={!responseVerified}
              style={{ backgroundColor: 'purple' }}
            >
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}
VerifyEmail.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  match: PropTypes.object.isRequired,
};

export default VerifyEmail;
