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
      <div className="day-selector">
        <label className="text-uppercase blue-heading">Repeat Shifts Weekly</label>
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
