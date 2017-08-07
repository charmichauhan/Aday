import React, { Component } from 'react';
import moment from 'moment';
import { concat, groupBy  } from 'lodash';
import AddHolidayModal from '../../helpers/AddHolidayModal';
import '../style.css';
import {
    TableRow,
    TableRowColumn,
} from 'material-ui/Table';
const styles={
    paddingLeft:'0',
    paddingRight:'0',
    height:'auto,' ,
    cursor: 'pointer'
};
const initialState = {
  addHoliday:false,
  holidayDate:"",
  isEdit:false,
  currentData:{},
  specialDay:[
  {
    "holidayName": "Labor Day",
    "holidayDate":"Mon Aug 07 2017",
    "holidayPayPremium":"one",
    "pyramidPayPremium":false
  },
  {
    "holidayName": "Labor Day",
    "holidayDate":"Wed Aug 09 2017",
    "holidayPayPremium":"oneHalf",
    "pyramidPayPremium":true
  }
]};

export default class SpecialDay extends Component{
  constructor(props){
    super(props);
    this.state=initialState;
  }
  handleOpen = (date,holidayData) => {
    this.setState({addHoliday:true,isEdit:(holidayData?true:false),holidayDate:date["_d"],currentData:holidayData && holidayData[0]});
  };
  handleModalClose = () => {
    this.setState({addHoliday:false,isEdit:false})
  };
  handleAddHoliday = (holidayDetail) => {
    let that = this;
    const {specialDay} = that.state;
    if(that.state.isEdit){
      (Object.keys(specialDay)).map((value,index)=>{
        if(specialDay[value]['holidayDate']){
          if(moment(specialDay[value]['holidayDate']).format('D/MM/YYYY') == moment(that.state.holidayDate).format('D/MM/YYYY')){
            specialDay[value].holidayDate = that.state.holidayDate;
            specialDay[value].holidayName = holidayDetail.holidayName;
            specialDay[value].holidayPayPremium = holidayDetail.holidayPayPremium;
            specialDay[value].pyramidPayPremium = holidayDetail.pyramidPayPremium;
          }
        }
      });
    }
    else{
      holidayDetail.holidayDate=that.state.holidayDate;
      specialDay.push(holidayDetail);
    }
    that.setState({specialDay:specialDay,isEdit:false,addHoliday:false,holidayDetail:""});
  };

  getSpecialDay = (start,specialDayData) => {
    let specialDay = [];
    for(let i=0;i<=6;i++){
      let specialDayStyle = specialDayData[moment(start).day(i).format('D')] ? "spclDay":"special-day-blank";
      specialDay.push(<TableRowColumn style={styles}><p className={specialDayStyle} onClick={() => this.handleOpen(moment(start).day(i),specialDayData[moment(start).day(i).format('D')])}>{specialDayData[moment(start).day(i).format('D')] && specialDayData[moment(start).day(i).format('D')][0]['holidayName']}</p></TableRowColumn>);
    }
    return specialDay;
  };

    render(){
        let start = this.props.dateStart;
        let specialDay = this.state.specialDay;
        let sortedData = specialDay.map((special) => ({ ...special, specialDayData: moment(special.holidayDate).format('D')}));
        let groupedData = groupBy(sortedData, 'specialDayData');
        return(
            <TableRow className="spday" displayBorder={false} style={{height:'auto'}}>
                <TableRowColumn style={styles} className="headcol">
                  {this.state.addHoliday && <AddHolidayModal isOpen={this.state.addHoliday}
                  addHoliday={this.handleAddHoliday}
                  holidayData={this.state.currentData}
                  handleClose={this.handleModalClose}/>
                  }
                </TableRowColumn>
                {
                  this.getSpecialDay(start,groupedData)
                }
            </TableRow>
        )
    }
}
