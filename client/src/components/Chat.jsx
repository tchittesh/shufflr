import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import { accountService, socket } from '../services';
import './Chat.scss';

class Chat extends Component {
  constructor(props) {
    super(props);

    this.state = { text: '', messages: [] };
    this.messagesEndRef = React.createRef();
    this.onTermination = props.onTermination;
    this.matchedEmail = props.partner;

    this.sendMsg = this.sendMsg.bind(this);
    this.scrollToBottom = this.scrollToBottom.bind(this);
  }

  componentDidMount() {
    socket.on('message', (msg) => {
      const { messages } = this.state;
      messages.push({
        email: this.matchedEmail,
        text: msg.text,
      });
      this.setState({ messages });
    });
  }

  componentDidUpdate() {
    this.scrollToBottom();
  }

  sendMsg() {
    const { text } = this.state;
    if (text !== '') {
      socket.emit('send', text);
      const email = accountService.emailAddress;
      const { messages } = this.state;
      messages.push({
        email,
        text,
      });
      this.setState({ text: '', messages });
      this.scrollToBottom();
    }
  }

  scrollToBottom() {
    this.messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
  }

  render() {
    const email = accountService.emailAddress;
    const { text, messages } = this.state;

    return (
      <Row className="vh-80">
        <Col className="chat">
          <Row className="user-name">
            <span>
              <Button variant="primary" type="cancel" onClick={this.onTermination}>
                Back
              </Button>
              <h4>
                {email}
                {' '}
                chatting with
                {' '}
                {this.matchedEmail}
              </h4>
            </span>
          </Row>
          <div className="chat-message">
            {messages.map((i, idx) => {
              if (i.email !== email) {
                return (
                  // eslint-disable-next-line react/no-array-index-key
                  <div className="message" key={idx}>
                    <p>{i.text}</p>
                  </div>
                );
              }
              return (
                // eslint-disable-next-line react/no-array-index-key
                <div className="message mess-right" key={idx}>
                  <p>{i.text}</p>
                </div>
              );
            })}
            <div ref={this.messagesEndRef} />
          </div>
          <div className="send">
            <input
              placeholder="enter your message"
              value={text}
              onChange={(e) => this.setState({ text: e.target.value })}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  this.sendMsg();
                }
              }}
            />
            <button type="submit" onClick={this.sendMsg}>Send</button>
          </div>
        </Col>
      </Row>
    );
  }
}
Chat.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  onTermination: PropTypes.func.isRequired,
  partner: PropTypes.string.isRequired,
};

export default Chat;
