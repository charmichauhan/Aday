import React, { Component } from 'react';
import EventPopup from './EventPopup';
import moment from 'moment';
import '../style.css';
import {
    TableRow,
    TableRowColumn,
} from 'material-ui/Table';

export default class JobsRow extends Component{
    render(){
        let data = this.props.data;
        let shifts = data.shifts[0];
        let finalHours = 0;
        let finalMinutes = 0;
        Object.values(shifts).map((value,index) => {
            if(value.length){
                for(let i=0;i<value.length;i++){
                    let startTime = moment(value[i]['timeFrom'],"hh:mm a");
                    let endTime = moment(value[i]['timeTo'],"hh:mm a");
                    let h = endTime.diff(startTime,'hours');
                    let m = moment.utc(moment(endTime,"HH:mm:ss").diff(moment(startTime,"HH:mm:ss"))).format("mm");
                    finalHours += h;
                    finalMinutes += parseInt(m);
                }
            }
        });
        let adHours= Math.floor(finalMinutes/60);
        finalHours+=adHours;
        finalMinutes = finalMinutes - (adHours*60);
        return(
            <TableRow className="tableh" displayBorder={false}>
                <TableRowColumn className="headcol" style={{paddingLeft:'0px',paddingRight:'0px'}}>
                    <div className="user_profile" width="80%">
                        <div className="user_img">
                            <img src={data.icon} alt="img"/>
                        </div>
                        <div className="user_desc penalheading">{data.title}
                            <p className="finalHours">{finalHours} hours<br/>{finalMinutes} Minutes</p>
                            <p className="scheduled_tag">SCHEDULED</p>
                        </div>
                    </div>
                </TableRowColumn>
                {
                    Object.values(shifts).map((value,index)=> ((
                            <TableRowColumn key={index} className="shiftbox" style={{paddingLeft:'0px',paddingRight:'0px',backgroundColor:'#F5F5F5'}}>
                                {
                                    Object.values(value).map((value,index)=>(
                                        <EventPopup data={value} key={index}/>
                                    ))
                                }
                                <button type="button" className="addshift">
                                    + ADD HOURS
                                </button>
                            </TableRowColumn>
                        )
                    ))
                }
            </TableRow>
        )
    }
}