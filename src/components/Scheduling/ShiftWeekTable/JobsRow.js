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
        const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        const hashByDay = {"Sunday": [], "Monday": [], "Tuesday": [], "Wednesday": [], "Thursday": [], "Friday": [], "Saturday": []};
        data.map((value,index) => {
            const day = value.weekday
            if (hashByDay[day]){
                hashByDay[day] = [...hashByDay[day], value];
            } else {
                hashByDay[day] =  [value];
            }
        });
        let finalHours = 0;
        let finalMinutes = 0;
        Object.values(data).map((value,index) => {
            let startTime = moment(value.startTime).format("hh:mm A");
            let endTime = moment(value.endTime).format("hh:mm A");
            let h = moment.utc(moment(endTime,"hh:mm A").diff(moment(startTime,"hh:mm A"))).format("HH");
            let m = moment.utc(moment(endTime,"hh:mm A").diff(moment(startTime,"hh:mm A"))).format("mm");
            finalHours += parseInt(h);
            finalMinutes += parseInt(m);
        });
        let adHours= Math.floor(finalMinutes/60);
        finalHours+=adHours;
        finalMinutes = finalMinutes - (adHours*60);
        return(
            <TableRow className="tableh" displayBorder={false}>
                <TableRowColumn className="headcol" style={{paddingLeft:'0px',paddingRight:'0px'}}>
                    <div className="user_profile" width="80%">
                        <div className="user_img">
                            <img width="65px" src={ data[0].positionByPositionId.positionIconUrl } alt="img"/>
                        </div>
                        <div className="user_desc penalheading">{data[0].positionByPositionId.positionName.split(" ")[0]}
                            <p className="lastName"> { data[0].positionByPositionId.positionName.split(" ")[1] }</p>
                            <p className="finalHours">{finalHours} hours<br/>{finalMinutes} Minutes</p>
                            <p className="scheduled_tag">SCHEDULED</p>
                        </div>
                    </div>
                </TableRowColumn>
                {
                    daysOfWeek.map((value,index)=> ((
                            <TableRowColumn key={index} className="shiftbox" style={{paddingLeft:'0px',paddingRight:'0px',backgroundColor:'#F5F5F5'}}>
                                {
                                    Object.values(hashByDay[value]).map((y, index)=>(
                                        <EventPopup data={y} key={index}/>
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