import React, { Component } from 'react';

import './Countdown.scss';

class Clock extends Component {
  static leading0(num) {
    return num < 10 ? `0${num}` : num;
  }

  constructor(props) {
    super(props);
    this.deadline = 'August 18, 2021 21:00:00 EDT';
    this.state = {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    };
  }

  componentDidMount() {
    this.getTimeUntil(this.deadline);
    setInterval(() => this.getTimeUntil(this.deadline), 1000);
  }

  getTimeUntil(deadline) {
    const time = Date.parse(deadline) - Date.parse(new Date());
    if (time < 0) {
      this.setState({
        days: 0, hours: 0, minutes: 0, seconds: 0,
      });
    } else {
      const seconds = Math.floor((time / 1000) % 60);
      const minutes = Math.floor((time / 1000 / 60) % 60);
      const hours = Math.floor((time / (1000 * 60 * 60)) % 24);
      const days = Math.floor(time / (1000 * 60 * 60 * 24));
      this.setState({
        days, hours, minutes, seconds,
      });
    }
  }

  render() {
    const {
      days, hours, minutes, seconds,
    } = this.state;
    return (
      <div>
        <table className="cd-table">
          <tr className="cd-top-row">
            <td>{Clock.leading0(days)}</td>
            <td>{Clock.leading0(hours)}</td>
            <td>{Clock.leading0(minutes)}</td>
            <td>{Clock.leading0(seconds)}</td>
          </tr>
          <tr className="cd-bottom-row">
            <td>DAYS</td>
            <td>HOURS</td>
            <td>MINUTES</td>
            <td>SECONDS</td>
          </tr>
        </table>
      </div>
    );
  }
}
export default Clock;
