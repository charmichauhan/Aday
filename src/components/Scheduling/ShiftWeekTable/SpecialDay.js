import React, { Component } from 'react';
import moment from 'moment';
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
  specialDay:[
  {
    "holidayName": "Labor Day",
    "holidayDate":"Mon Jul 31 2017",
    "holidayPayPremium":"1",
    "pyramidPayPremium":false
  },
  {
    "holidayName": "Labor Day",
    "holidayDate":"Wed Aug 02 2017",
    "holidayPayPremium":"1.5",
    "pyramidPayPremium":true
  }
]};

export default class SpecialDay extends Component{
  constructor(props){
    super(props);
    this.state=initialState;
  }
  handleOpen = (holidayDate) => {
    this.setState({addHoliday:true,holidayDate:holidayDate});
  };
  handleModalClose = () => {
    this.setState({addHoliday:false})
  };
  handleAddHoliday = (holidayDetail) => {
    let that = this;
    const {specialDay} = that.state;
    holidayDetail.holidayDate=that.state.holidayDate;
    specialDay.push(holidayDetail);
    that.setState({specialDay:specialDay,addHoliday:false,holidayDetail:""});
  };

    render(){
        let start = this.props.dateStart;
        let special = [];
        let dayDate = [];
        let specialDay = this.state.specialDay;
        specialDay.map((value,index)=>{
            let today = moment(start);
            for (let d = 1; d <= 7; d++) {
                let spd = specialDay[index];
                dayDate[d] = today["_d"].toString();
                if(moment(spd['holidayDate']).format('D/MM/YYYY') === moment(today["_d"]).format('D/MM/YYYY')) {
                    special[d] = value['holidayName'];
                }
                today=moment(today).add(1,'days');
            }
        });
        return(
            <TableRow className="spday" displayBorder={false} style={{height:'auto'}}>
                <TableRowColumn style={styles} className="headcol">
                  <AddHolidayModal isOpen={this.state.addHoliday}
                  addHoliday={this.handleAddHoliday}/>
                </TableRowColumn>
                {special[1]?<TableRowColumn style={styles}><p className="spclDay" onClick={() => this.handleOpen(dayDate[1])}>{special[1]}</p></TableRowColumn>:<TableRowColumn style={styles}><p className="special-day-blank" onClick={() => this.handleOpen(dayDate[1])}></p></TableRowColumn>}
                {special[2]?<TableRowColumn style={styles}><p className="spclDay" onClick={() => this.handleOpen(dayDate[2])}>{special[2]}</p></TableRowColumn>:<TableRowColumn style={styles}><p className="special-day-blank" onClick={() => this.handleOpen(dayDate[2])}></p></TableRowColumn>}
                {special[3]?<TableRowColumn style={styles}><p className="spclDay" onClick={() => this.handleOpen(dayDate[3])}>{special[3]}</p></TableRowColumn>:<TableRowColumn style={styles}><p className="special-day-blank" onClick={() => this.handleOpen(dayDate[3])}></p></TableRowColumn>}
                {special[4]?<TableRowColumn style={styles}><p className="spclDay" onClick={() => this.handleOpen(dayDate[4])}>{special[4]}</p></TableRowColumn>:<TableRowColumn style={styles}><p className="special-day-blank" onClick={() => this.handleOpen(dayDate[4])}></p></TableRowColumn>}
                {special[5]?<TableRowColumn style={styles}><p className="spclDay" onClick={() => this.handleOpen(dayDate[5])}>{special[5]}</p></TableRowColumn>:<TableRowColumn style={styles}><p className="special-day-blank" onClick={() => this.handleOpen(dayDate[5])}></p></TableRowColumn>}
                {special[6]?<TableRowColumn style={styles}><p className="spclDay" onClick={() => this.handleOpen(dayDate[6])}>{special[6]}</p></TableRowColumn>:<TableRowColumn style={styles}><p className="special-day-blank" onClick={() => this.handleOpen(dayDate[6])}></p></TableRowColumn>}
                {special[7]?<TableRowColumn style={styles}><p className="spclDay" onClick={() => this.handleOpen(dayDate[7])}>{special[7]}</p></TableRowColumn>:<TableRowColumn style={styles}><p className="special-day-blank" onClick={() => this.handleOpen(dayDate[7])}></p></TableRowColumn>}
            </TableRow>
        )
    }
}
