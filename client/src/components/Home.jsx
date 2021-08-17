import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Spinner from 'react-bootstrap/Spinner';
import { GiCancel } from 'react-icons/gi';

import Chat from './Chat';
import { socket } from '../services';
import './base.css';

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
          <Col md="5" className="justify-content-center align-items-center">
            <h1 className="center-text white-text">
              Welcome,
              {' '}
              {email}
            </h1>
            <Row>
              <Button variant="primary" type="button" className="topPadded" onClick={Home.startSearch}>
                Start Chat
              </Button>
            </Row>
          </Col>
        );
      case this.statusSet.SEARCHING:
        return (
          <Col md="5" className="justify-content-center align-items-center">
            <h1 className="center-text white-text">
              Welcome,
              {' '}
              {email}
            </h1>
            <Row>
              <Button variant="primary" type="button" className="topPadded">
                <Spinner animation="border" variant="light" />
                <GiCancel style={{ fontSize: 20, marginTop: 6, float: 'right' }} onClick={Home.cancelSearch} />
              </Button>
            </Row>
          </Col>
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
