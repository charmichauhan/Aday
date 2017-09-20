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
      this.setState({ startTimeValueTop: startTimeValue, endTimeValueTop: endTimeValue, showSelector: false });
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
        <div className="time-wrapper">
          <label className="text-uppercase blue-heading">End Time</label>
        </div>
        <div className="label-wrapper" onClick={this.toggleSelector}>
          <p>{startTimeValueTop || 'Start'}</p>
          <p className="text-center">to</p>
          <p>{endTimeValueTop || 'End'}</p>
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
            <p style={{ background: '#ffffff', paddingLeft: '10px' }}>{endTimeValue || 'End'}</p>
            <TimePicker getTime={(value) => this.handleTimeChange({ name: 'endTime', value })} />
          </div>
          <div className="time-actions-wrapper text-uppercase">
            <RaisedButton
              label="NOW"
              backgroundColor={colors.primaryRed}
              labelColor="#FFFFFF"
              labelStyle={{ fontWeight: 800 }}
              style={{ margin: '10px 0' }}
            />
            <div className="pull-right">
              <Button
                style={{ color: '#0022a1', background: 'transparent' }}
                content='CANCEL'
                onClick={this.toggleSelector}
              />
              <RaisedButton
                label="OK"
                backgroundColor={colors.primaryBlue}
                labelColor="#FFFFFF"
                labelStyle={{ fontWeight: 800 }}
                style={{ margin: '10px 0' }}
                onClick={this.setCallbackData}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
