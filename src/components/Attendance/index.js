import React, { Component } from 'react';
import { Tabs, Tab } from 'material-ui/Tabs';
import { withApollo } from 'react-apollo';

import ShiftHistory from './ShiftHistory';
import TimeOffRequests from './TimeOffRequests';
import { tabDesign } from '../styles';

import './attendance.css';

const styles = {
  tabDesign
};

const initialState = {
  value: 'shiftHistory',
  corporationId: localStorage.getItem('corporationId')
};

class Attendance extends Component {
  constructor(props) {
    super(props);
    this.state = initialState;
  }

  handleChange = (value) => {
    this.setState({ value: value });
  };

  getButtonStyle = (value) => ({
    ...styles.tabDesign.buttonStyle,
    fontWeight: (this.state.value === value && 700) || 500
  });

  render() {
    return (
      <section className="attendance">
        <div className="col-md-12 title-box">
          <div className="col-sm-offset-3 col-sm-5 rectangle">
            TIME & ATTENDANCE
          </div>
        </div>
        <Tabs
          value={this.state.value}
          onChange={this.handleChange}
          inkBarStyle={styles.tabDesign.inkBarStyle}
          tabItemContainerStyle={styles.tabDesign.tabItemContainerStyle}>
          <Tab
            buttonStyle={this.getButtonStyle('shiftHistory')}
            label="SHIFT HISTORY"
            value="shiftHistory">
            <ShiftHistory />
          </Tab>
          <Tab
            buttonStyle={this.getButtonStyle('timeOfRequests')}
            label="TIME OFF REQUESTS"
            value="timeOfRequests">
            <TimeOffRequests />
          </Tab>
        </Tabs>
      </section>
    );
  }
}

export default withApollo(Attendance);
