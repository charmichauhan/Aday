import React, { Component } from 'react';
import { TimePicker } from 'rc-timepicker';
import moment from 'moment';
import RaisedButton from 'material-ui/RaisedButton';
import { Button } from 'semantic-ui-react';

import { colors } from '../../../styles';

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
    this.setState({ [name]: dateTime, [name + 'Value']: value });
  };

  setCallbackData = () => {
    const { formCallBack } = this.props;
    if (formCallBack) {
      const { startTime, startTimeValue, endTime, endTimeValue } = this.state;
      formCallBack({ startTime, endTime });
      this.setState({ startTimeValueTop: startTimeValue, endTimeValueTop: endTimeValue, showSelector: false, showSelector: !this.state.showSelector });
    }
  };

  toggleSelector = () => {
    this.setState({ showSelector: !this.state.showSelector });
  };

  render() {
    const { showSelector, startTimeValue, startTimeValueTop, endTimeValue, endTimeValueTop } = this.state;
    return (
      <div className="time-selector-wrapper">
        <div className="time-wrapper">
          <label className="text-uppercase blue-heading">Start Time</label>
        </div>
        <div className="time-wrapper" style={{marginLeft:-10}}>
          <label className="text-uppercase blue-heading">End Time</label>
        </div>
        <div className="label-wrapper" onClick={this.toggleSelector}>
          <p>{startTimeValueTop || 'When does this shift start?'}</p>
          <p>{endTimeValueTop || 'When does this shift end?'}</p>
          <p>
            <i className="fa fa-clock-o" />
          </p>
        </div>
        <div className="time-selector-display" style={{ display: showSelector ? 'block' : 'none' }}>
          <div className="time-wrapper">
            <p style={{ background: '#ffffff', padding: '0 0 10px 10px', marginBottom: 0  }}>{startTimeValue || 'Start'}</p>
            <TimePicker getTime={(value) => this.handleTimeChange({ name: 'startTime', value })} />
          </div>
          <div className="time-wrapper">
            <p style={{ background: '#ffffff', padding: '0 0 10px 10px', marginBottom: 0 }}>{endTimeValue || 'End'}</p>
            <TimePicker getTime={(value) => this.handleTimeChange({ name: 'endTime', value })} />
          </div>
          <div className="time-actions-wrapper text-uppercase">
            <div className="left-picker-group">
                <button className="now-picker-button" >NOW</button>
            </div>
            <div className="right-picker-group">
                <div style={{alignSelf:'center'}}>
                    <button className="cancel-picker-button" onClick={this.toggleSelector}>CANCEL</button>
                </div>
                <div style={{alignSelf:'center'}}>
                    <button className="ok-picker-button" onClick={this.setCallbackData}>OK</button>
                </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
