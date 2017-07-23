import React,{Component} from 'react';
import moment from 'moment';
import DaySelector from './DaySelector/DaySelector';

export default class ShiftDaySelector extends Component {
  constructor(props){
    super(props);
    this.handleData=this.handleData.bind(this);
  }
  handleData(value){
    this.props.formCallBack(value);
  }
  render(){
    const tableSize=7;
    const selectedDate=moment().format('MM-DD-YYYY');
    return(
       <DaySelector
          tableSize={tableSize}
          startDate={this.props.startDate}
          selectedDate={selectedDate}
          callBack={ this.handleData }
      />
    );
  }
}
