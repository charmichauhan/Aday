import React, { Component } from 'react';
import { TimePicker } from 'rc-timepicker';
import moment from 'moment';

import 'rc-timepicker/lib/css/styles.css';

export default class StartToEndTimePicker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      startTime: props.startTime,
      endTime: props.endTime,
      showSelector: false
    }
  }

  componentWillMount() {
    const { formCallBack } = this.props;
    const { startTime, endTime } = this.state;
    formCallBack({ startTime, endTime });
  }

  handleTimeChange = ({ name, value }) => {
    let [hour, min] = value.split(':');
    const dateTime = moment().hour(hour).minute(min);
    this.setState({ [name]: dateTime, [name + 'Value']: value }, () => {
      const { formCallBack } = this.props;
      if (formCallBack) {
        const { startTime, endTime } = this.state;
        formCallBack({ startTime, endTime });
      }
    });
  };

  toggleSelector = () => {
    this.setState({ showSelector: !this.state.showSelector });
  };

  render() {
    const { showSelector, startTimeValue, endTimeValue } = this.state;
    return (
      <div className="time-selector-wrapper">
        <div className="time-wrapper">
          <label className="text-uppercase blue-heading">Start Time</label>
        </div>
        <div className="time-wrapper">
          <label className="text-uppercase blue-heading">End Time</label>
        </div>
        <div className="label-wrapper" onClick={this.toggleSelector}>
          <p>{startTimeValue || 'Start'}</p>
          <p className="text-center">to</p>
          <p>{endTimeValue || 'End'}</p>
          <p>
            <i className="fa fa-clock-o" />
          </p>
        </div>
        <div style={{ display: showSelector ? 'block' : 'none' }}>
          <div className="time-wrapper">
            <TimePicker getTime={(value) => this.handleTimeChange({ name: 'startTime', value })} />
          </div>
          <div className="time-wrapper">
            <TimePicker getTime={(value) => this.handleTimeChange({ name: 'endTime', value })} />
          </div>
        </div>
      </div>
    );
  }
}
