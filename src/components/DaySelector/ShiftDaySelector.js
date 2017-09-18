import React, { Component } from 'react';
import moment from 'moment';
import DaySelector from './DaySelector/DaySelector';

export default class ShiftDaySelector extends Component {
  constructor(props) {
    super(props);
  }

  handleData = (value) => {
    this.props.formCallBack(value);
  };

  render() {
    const tableSize = 7;
    const selectedDate = moment().format('MM-DD-YYYY');
    return (
      <div>
        <label className="text-uppercase blue-heading">Shift Day(s) Of The Week</label>
        <DaySelector
          tableSize={tableSize}
          startDate={this.props.startDate}
          selectedDate={selectedDate}
          callBack={this.handleData}
        />
      </div>
    );
  }
}

