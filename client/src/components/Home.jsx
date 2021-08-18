/* eslint-disable max-len */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Spinner from 'react-bootstrap/Spinner';
import { CgClose } from 'react-icons/cg';
import { AiOutlineMail } from 'react-icons/ai';

import Chat from './Chat';
import PrivacyPolicy from './PrivacyPolicy';
import { socket } from '../services';
import './base.css';
import './Home.css';
import princetonStudents from '../assets/princeton_students.jpg';
import cmuStudents from '../assets/cmu_students.png';

class Home extends Component {
  static startSearch() {
    socket.emit('search');
  }

  static cancelSearch() {
    socket.emit('cancel');
  }

  static stopChat() {
    socket.emit('exit');
  }

  constructor(props) {
    super(props);
    this.statusSet = {
      DEFAULT: 'default',
      SEARCHING: 'searching',
      CHATTING: 'chatting',
    };
    this.state = {
      status: this.statusSet.DEFAULT,
      matchedEmail: null,
      reportModalVisible: false,
      startChatModalVisible: false,
      privacyModalVisible: false,
    };
    socket.disconnect();
    socket.connect();
  }

  componentDidMount() {
    socket.on('matchFound', ({ email }) => {
      const { status } = this.state;
      console.log('received match with', email, status);
      this.setState({ status: this.statusSet.CHATTING, matchedEmail: email });
    });
    socket.on('searchReceived', () => {
      this.setState({ status: this.statusSet.SEARCHING });
    });
    socket.on('cancelReceived', () => {
      this.setState({ status: this.statusSet.DEFAULT });
    });
    socket.on('exitReceived', () => {
      this.setState({ status: this.statusSet.DEFAULT });
    });
    socket.on('partnerDisconnected', () => {
      this.setState({ status: this.statusSet.DEFAULT });
    });
  }

  componentWillUnmount() {
    socket.removeAllListeners('matchFound');
    socket.removeAllListeners('searchReceived');
    socket.removeAllListeners('cancelReceived');
    socket.removeAllListeners('exitReceived');
    socket.removeAllListeners('partnerDisconnected');
    socket.disconnect();
  }

  render() {
    const { email } = this.props;

    const {
      status, matchedEmail, reportModalVisible, startChatModalVisible, privacyModalVisible,
    } = this.state;

    if (status === this.statusSet.CHATTING) {
      return (
        <Col md="8" className="justify-content-center align-items-center">
          <Chat email={email} partner={matchedEmail} onTermination={Home.stopChat} />
        </Col>
      );
    }
    if (status === this.statusSet.DEFAULT || status === this.statusSet.SEARCHING) {
      return (
        <Row className="welcomeRow">
          {/* TOP LEVEL MODALS */}
          <Modal
            show={reportModalVisible}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            onHide={() => this.setState({ reportModalVisible: false })}
          >
            <Modal.Header closeButton>
              <Modal.Title id="contained-modal-title-vcenter">
                See inappropriate behavior?
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              Please report any inappropriate behavior to this email:
              <div
                className="d-flex flex-row"
                style={{
                  backgroundColor: '#CBC3E3', width: 350, height: 50, borderRadius: 8, marginTop: 20, marginLeft: 20,
                }}
              >

                <div style={{
                  width: 35, height: 35, backgroundColor: 'indigo', borderRadius: 40, marginLeft: -20, marginTop: 8, marginBottom: 10, border: 'solid', borderColor: 'white',
                }}
                >
                  <AiOutlineMail style={{ marginLeft: 6, marginTop: 3, color: 'white' }} />
                </div>

                <div className="email">
                  shufflr.app@gmail.com
                </div>

              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button
                onClick={() => this.setState({ reportModalVisible: false })}
                style={{ backgroundColor: 'purple' }}
              >
                Close
              </Button>
            </Modal.Footer>
          </Modal>

          <Modal
            show={startChatModalVisible}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            onHide={() => this.setState({ startChatModalVisible: false })}
          >
            <Modal.Header closeButton>
              <Modal.Title id="contained-modal-title-vcenter">
                Start chat button not responding?
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              Yikes! We&apos;ll fix this in the future, but refreshing the page should work for now.
            </Modal.Body>
            <Modal.Footer>
              <Button
                onClick={() => this.setState({ startChatModalVisible: false })}
                style={{ backgroundColor: 'purple' }}
              >
                Close
              </Button>
            </Modal.Footer>
          </Modal>

          <Modal
            show={privacyModalVisible}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            onHide={() => this.setState({ privacyModalVisible: false })}
          >
            <Modal.Header closeButton>
              <Modal.Title id="contained-modal-title-vcenter">
                Privacy Policy
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <PrivacyPolicy />
            </Modal.Body>
            <Modal.Footer>
              <Button
                onClick={() => this.setState({ privacyModalVisible: false })}
                style={{ backgroundColor: 'purple' }}
              >
                Close
              </Button>
            </Modal.Footer>
          </Modal>

          <Col className="welcomeCol">
            <h1 className="introHome">
              Hello,
              {' '}
              {email}
              !
            </h1>
            <div className="introSmall">
              Ready to meet new people? Make new friends?
            </div>
            {
              status === this.statusSet.DEFAULT
              && (
              <Button variant="light" type="button" className="buttonLink" onClick={Home.startSearch}>
                Start Chat
              </Button>
              )
            }
            {
              status === this.statusSet.SEARCHING
              && (
                <Button variant="light" type="button" className="buttonLink">
                  <Spinner animation="border" variant="dark" style={{ fontSize: 10 }} />
                  <CgClose style={{ fontSize: 20, marginTop: 6, float: 'right' }} onClick={Home.cancelSearch} />
                </Button>
              )
            }
            <hr className="homeDivider" />
            <div className="feeedbackDiv">
              Have any feedback? Email us at shufflr.app@gmail.com.
            </div>
            <Row className="linkRow">
              <Col>
                <Button variant="light" type="button" className="sideLink" onClick={() => this.setState({ reportModalVisible: true })}>
                  See inappropriate behavior?
                </Button>
              </Col>
              <Col>
                <Button variant="light" type="button" className="sideLink" onClick={() => this.setState({ startChatModalVisible: true })}>
                  Start chat button not responding?
                </Button>
              </Col>
              <Col>
                <Button variant="light" type="button" className="sideLink" onClick={() => this.setState({ privacyModalVisible: true })}>
                  Read our Privacy Policy
                </Button>
              </Col>

            </Row>
          </Col>
          <Col className="welcomeCol1">
            <img
              alt="Students"
              src={princetonStudents}
              className="Students"
            />
            <img
              alt="Students1"
              src={cmuStudents}
              className="Students1"
            />
          </Col>
        </Row>

      );
    }
    throw Error('Invalid status');
  }
}
Home.propTypes = {
  email: PropTypes.string.isRequired,
};

export default Home;
