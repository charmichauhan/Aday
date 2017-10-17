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
    const { startDate, isRecurring, selectedDate, isPublished } = this.props;
    const tableSize = 7;
    return (
      <div className="day-selector">
        <DaySelector
          tableSize={tableSize}
          isRecurring={isRecurring}
          startDate={startDate}
          selectedDate={selectedDate}
          callBack={this.handleData}
          isPublished={isPublished}
        />
      </div>
    );
  }
}
