import React, { Component } from 'react';
import { TimePicker } from 'rc-timepicker';
import cloneDeep from 'lodash/cloneDeep';
import moment from 'moment';

import 'rc-timepicker/lib/css/styles.css';

export default class StartToEndTimePicker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      startTime: props.startTime,
      startTimeValue: props.isEdit && moment(props.startTime).format('HH:mm'),
      endTime: props.endTime,
      endTimeValue: props.isEdit && moment(props.startTime).format('HH:mm'),
      showSelector: false
    }
  }

  componentWillMount() {
    const { formCallBack } = this.props;
    const { startTime, endTime } = this.state;
    formCallBack({ startTime, endTime });
  }

  componentWillReceiveProps(nextProps) {
    const { startTime, endTime } =  this.state;
    if (nextProps.startTime && nextProps.endTime) {
      if (nextProps.startTime.valueOf() !== startTime.valueOf() || nextProps.endTime.valueOf() !== endTime.valueOf()) {
        this.setState({
          startTime: nextProps.startTime,
          endTime: nextProps.endTime
        });
      }
      if (nextProps.isEdit) {
        this.setState({
          startTimeValue: moment(nextProps.startTime).format('HH:mm'),
          endTimeValue: moment(nextProps.endTime).format('HH:mm'),
        });
      }
    } else {
      this.setState({
        startTime: moment(),
        startTimeValue: '',
        endTime: moment(),
        endTimeValue: '',
      });
    }
  }

  handleTimeChange = ({ name, value }) => {
    const stateValue = cloneDeep(this.state[name]) || moment();
    let [hour, min] = value.split(':');
    if (hour) stateValue.hour(hour);
    if (min) stateValue.minute(min);
    this.setState({ [name]: stateValue, [name + 'Value']: value });
  };

  setCallbackData = () => {
    const { formCallBack } = this.props;
    if (formCallBack) {
      const { startTime, endTime } = this.state;
      formCallBack({ startTime, endTime });
      this.setState({ showSelector: !this.state.showSelector });
    }
  };

  toggleSelector = () => {
    this.setState({ showSelector: !this.state.showSelector });
  };

  isDisabled = () => {
    const { startTimeValue, endTimeValue } = this.state;
    return !startTimeValue || !endTimeValue;
  };

  render() {
    const { showSelector, startTime, startTimeValue, endTime, endTimeValue } = this.state;
    const { onNowSelect } = this.props;
    return (
      <div className="time-selector-wrapper">
        <div className="time-wrapper">
          <label className="text-uppercase blue-heading">Start Time</label>
        </div>
        <div className="time-wrapper">
          <label className="text-uppercase blue-heading">End Time</label>
        </div>
        <div className="label-wrapper" onClick={this.toggleSelector}>
          <p>
            <input
              type="text"
              name="startTime"
              value={startTimeValue || ''}
              onChange={({ target }) => this.handleTimeChange(target)}
              placeholder="When does this shift start? (08:30)" />
          </p>
          <p>
            <input
              type="text"
              name="endTime"
              value={endTimeValue || ''}
              onChange={({ target }) => this.handleTimeChange(target)}
              placeholder="When does this shift end? (15:00)" />
          </p>
          <p>
            <i className="fa fa-clock-o" />
          </p>
        </div>
        <div className="time-selector-display" style={{ display: showSelector ? 'block' : 'none' }}>
          <div className="time-wrapper">
            <TimePicker date={startTime} getTime={(value) => this.handleTimeChange({ name: 'startTime', value })} />
          </div>
          <div className="time-wrapper">
            <TimePicker date={endTime} getTime={(value) => this.handleTimeChange({ name: 'endTime', value })} />
          </div>
          <div className="time-actions-wrapper text-uppercase">
            <div className="left-picker-group">
                <button className="now-picker-button" onClick={onNowSelect}>NOW</button>
            </div>
            <div className="right-picker-group">
                <div style={{alignSelf:'center'}}>
                    <button className="cancel-picker-button" onClick={this.toggleSelector}>CANCEL</button>
                </div>
                <div style={{alignSelf:'center'}}>
                    <button className="ok-picker-button" disabled={this.isDisabled()} onClick={this.setCallbackData}>OK</button>
                </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
