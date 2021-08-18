import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Spinner from 'react-bootstrap/Spinner';
import { CgClose } from 'react-icons/cg';
import { AiOutlineMail } from 'react-icons/ai';

import Chat from './Chat';
import { socket } from '../services';
import './base.css';
import './Home.css';
import students from '../assets/students.jpeg';

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
    this.state = { status: this.statusSet.DEFAULT, matchedEmail: null };
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

    const { status, matchedEmail } = this.state;

    switch (status) {
      case this.statusSet.DEFAULT:
        return (
          <Row className="welcomeRow">
            <Col className="welcomeCol">
              <h1 className="introHome">
                Hello,
                {' '}
                {email}
              </h1>
              <div className="introSmall">
                Chat Freely!
                <br />
                Meet new people,

                Have fun :)
              </div>
              <Button variant="light" type="button" className="buttonLink" onClick={Home.startSearch}>
                Start Chat
              </Button>
              <Button variant="light" type="button" className="privacyLink">
                Privacy Policy
              </Button>
              <div className="introVerySmall">
                Please report any inappropriate behavior to this email:
              </div>
              <div
                className="d-flex flex-row"
                style={{
                  backgroundColor: '#CBC3E3', width: 350, height: 50, borderRadius: 8, marginTop: 20,
                }}
              >

                <div style={{
                  width: 35, height: 35, backgroundColor: 'indigo', borderRadius: 40, marginLeft: -20, marginTop: 8, marginBottom: 10, border: 'solid', borderColor: 'white',
                }}
                >
                  <AiOutlineMail style={{ marginLeft: 6, marginTop: 3, color: 'white' }} />
                </div>

                <div
                  className="email"
                >
                  shufflr.app@gmail.com
                </div>

              </div>
            </Col>
            <Col className="welcomeCol1">
              <img
                alt="Students"
                src={students}
                className="Students"
              />
              <img
                alt="Students1"
                src={students}
                className="Students1"
              />
            </Col>
          </Row>

        );
      case this.statusSet.SEARCHING:
        return (
          <Row className="welcomeRow">
            <Col className="welcomeCol">
              <h1 className="introHome">
                Hello,
                {' '}
                {email}
              </h1>
              <div className="introSmall">
                Chat Freely!
                <br />
                Meet new people,

                Have fun :)
              </div>
              <Button variant="light" type="button" className="buttonLink">
                <Spinner animation="border" variant="primary" style={{ fontSize: 10 }} />
                <CgClose style={{ fontSize: 20, marginTop: 6, float: 'right' }} onClick={Home.cancelSearch} />
              </Button>
              <Button variant="light" type="button" className="privacyLink">
                Privacy Policy
              </Button>
              <div className="introVerySmall">
                Please report any inappropriate behavior to this email:
              </div>
              <div
                className="d-flex flex-row"
                style={{
                  backgroundColor: '#CBC3E3', width: 350, height: 50, borderRadius: 8, marginTop: 20,
                }}
              >

                <div style={{
                  width: 35, height: 35, backgroundColor: 'indigo', borderRadius: 40, marginLeft: -20, marginTop: 8, marginBottom: 10, border: 'solid', borderColor: 'white',
                }}
                >
                  <AiOutlineMail style={{ marginLeft: 6, marginTop: 3, color: 'white' }} />
                </div>

                <div
                  className="email"
                >
                  shufflr.app@gmail.com
                </div>

              </div>
            </Col>
            <Col className="welcomeCol1">
              <img
                alt="Students"
                src={students}
                className="Students"
              />
              <img
                alt="Students1"
                src={students}
                className="Students1"
              />
            </Col>
          </Row>
        );
      case this.statusSet.CHATTING:
        return (
          <Col md="8" className="justify-content-center align-items-center">
            <Chat email={email} partner={matchedEmail} onTermination={Home.stopChat} />
          </Col>
        );
      default:
        throw Error('Invalid status');
    }
  }
}
Home.propTypes = {
  email: PropTypes.string.isRequired,
};

export default Home;
