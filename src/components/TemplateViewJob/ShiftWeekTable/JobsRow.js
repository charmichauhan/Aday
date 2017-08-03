import React, { Component } from 'react';
import EventPopup from './EventPopup';
import moment from 'moment';
import '../../Scheduling/style.css';
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
            const day = moment(value.startTime, "HH:mm:ss").format("dddd");
            if (hashByDay[day]){
                hashByDay[day] = [...hashByDay[day], value];
            } else {
                hashByDay[day] = [value];
            }
        });
        let finalHours = 0;
        let finalMinutes = 0;
        Object.values(this.props.data).map((value,index) => {
            let startTime = moment(value.startTime, "HH:mm:ss");
            let endTime = moment(value.endTime, "HH:mm:ss");
            let h = endTime.diff(startTime,'hours');
            let m = moment.utc(moment(endTime).diff(moment(startTime))).format("mm");
            let workerAssigned = value['workersAssigned'] && value['workersAssigned'].length;
            h=h*workerAssigned;
            m=m*workerAssigned;
            finalHours += h;
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
                            <p className="finalHours">{finalHours || 0} hours<br/>{finalMinutes || 0} Minutes</p>
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
