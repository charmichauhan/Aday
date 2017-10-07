import React, { Component } from 'react';
import { TimePicker } from 'rc-timepicker';
import cloneDeep from 'lodash/cloneDeep';
import moment from 'moment';
import InputMask from 'react-input-mask';

import 'rc-timepicker/lib/css/styles.css';
import './select.css';

export default class StartToEndTimePicker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      startTime: props.startTime,
      startTimeValue: props.isEdit && moment(props.startTime).format('HH:mm'),
      endTime: props.endTime,
      endTimeValue: props.isEdit && moment(props.startTime).format('HH:mm'),
      showSelector: false,
      duration: { hours: 0, minutes: 0 }
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
    function escapeMarkings(unsafe) {
      return unsafe.replace(/_/g, '');
    }

    const stateValue = cloneDeep(this.state[name]) || moment();
    let [hour, min] = escapeMarkings(value).split(':');
    if (hour && hour >= 0 && hour <= 24) {
      stateValue.hour(hour);
    }
    if (min && min >= 0 && min <= 60) {
      stateValue.minute(min);
    }
    const { formCallBack } = this.props;
    if (formCallBack && hour && min) {
      formCallBack({ [name]: stateValue });
    }

    const startTime = name === 'startTime' && stateValue || this.state.startTime;
    const endTime = name === 'endTime' && stateValue || this.state.endTime;
    const { startTimeValue, endTimeValue } = this.state;
    const stateToUpdate = { [name]: stateValue, [name + 'Value']: value };
    if (startTime && startTime.isValid() && startTimeValue
      && endTime && endTime.isValid() && (endTimeValue || name === 'endTime')) {
      let minDiff = endTime.diff(startTime, 'minutes');
      if (minDiff > 0) {
        stateToUpdate.duration = {
          hours: (minDiff - (minDiff % 60) ) / 60,
          minutes: minDiff % 60
        };
      }
    }

    this.setState(stateToUpdate, () => {
      const { formCallBack } = this.props, { startTime, endTime } = this.state;
      if (formCallBack && startTime && startTime.isValid() && endTime && endTime.isValid()) {
        formCallBack({ startTime, endTime });
      }
    });
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
    const { duration, showSelector, startTime, startTimeValue, endTime, endTimeValue } = this.state;
    const { onNowSelect } = this.props;
    return (
      <div className="time-selector-wrapper">
        <div className="time-wrapper">
          <label className="text-uppercase blue-heading">Start Time</label>
        </div>
        <div className="time-wrapper" style={{marginLeft:-5}}>
          <label className="text-uppercase blue-heading">End Time</label>
        </div>
        <div className="label-wrapper" onClick={this.toggleSelector}>
          <p>
            <InputMask
              type="text"
              name="startTime"
              value={startTimeValue || ''}
              onChange={({ target }) => this.handleTimeChange(target)}
              placeholder="When does this shift start?"
              mask="99:99" maskChar="_" />
          </p>
          <p>
            <InputMask
              type="text"
              name="endTime"
              value={endTimeValue || ''}
              onChange={({ target }) => this.handleTimeChange(target)}
              placeholder="When does this shift end?"
              mask="99:99" maskChar="_" />
          </p>
          <p>
            <i className="fa fa-clock-o" />
          </p>
          {/*<p style={{flex: 1}}>{startTimeValueTop || <span className='placeholder-text'>WHEN WILL THE SHIFT START?</span>}</p>*/}
          {/*<p style={{flex: 1, textAlign:'left'}}>{endTimeValueTop || <span className='placeholder-text'>WHEN WILL THE SHIFT END?</span>}</p>*/}
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
            <div className="center-footer-group">
              <span>Shift Length: {duration.hours} hours {duration.minutes} minutes</span>
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
