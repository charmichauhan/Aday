import React,{Component} from 'react';
import moment from 'moment';
//import DateController from './DateController/DateController';
import DaySelector from './DaySelector/DaySelector';

export default class ShiftDaySelector extends Component {
  constructor(props){
    super(props);
  }
  render(){
    const tableSize=7;
    //const { startdate }=this.props;
  //  const startDate=this.props.startDate;
    const selectedDate=moment().format('MM-DD-YYYY');
    return(
       <DaySelector
          tableSize={tableSize}
          startDate={this.props.startDate}
          selectedDate={selectedDate}
      />
    );
  }
}
