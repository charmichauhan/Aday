import React,{Component} from 'react';
import moment from 'moment';
//import DateController from './DateController/DateController';
import DaySelector from './DaySelector/DaySelector';

export default class ShiftDaySelector extends Component {
  render(){
    const tableSize=7;
    const startDate=moment().format('MM-DD-YYYY');
    const selectedDate=moment().format('MM-DD-YYYY');
    return(
       <DaySelector
          tableSize={tableSize}
          startDate={startDate}
          selectedDate={selectedDate}
      />
    );
  }
}
