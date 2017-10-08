import React, { Component } from 'react';
import EventPopup from './EventPopup';
import moment from 'moment';
import '../../Scheduling/style.css';
import {
    TableRow,
    TableRowColumn,
} from 'material-ui/Table';
import { Truncate } from 'rebass'

export default class JobsRow extends Component{

    render(){
        let data = this.props.data;
        const daysOfWeek = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];
        const hashByDay = {"SUNDAY": [], "MONDAY": [], "TUESDAY": [], "WEDNESDAY": [], "THURSDAY": [], "FRIDAY": [], "SATURDAY": []};
        data.map((value,index) => {
            const day =  value.weekday
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

            if (startTime == "Invalid date"){
                let start = value.startTime.split(":")
                let end = value.endTime.split(":")
                startTime = moment().hour(parseInt(start[0])).minute(parseInt(start[1])).format("hh:mm A");
                endTime = moment().hour(parseInt(end[0])).minute(parseInt(end[1])).format("hh:mm A");
            }
            
            let h = moment.utc(moment(endTime,"hh:mm A").diff(moment(startTime,"hh:mm A"))).format("HH");
            let m = moment.utc(moment(endTime,"hh:mm A").diff(moment(startTime,"hh:mm A"))).format("mm");
            let unpaidHours = 0;
            let unpaidMinutes = 0;
            if (value.unpaidBreakTime) {
                unpaidHours = parseInt(value.unpaidBreakTime.split(':')[0])
                unpaidMinutes = parseInt(value.unpaidBreakTime.split(':')[1])
            }
            h = parseInt(h) - unpaidHours;
            m = parseInt(m) - unpaidMinutes;

            if (this.props.view=="job"){
                let workerAssigned = value['workersAssigned'] && value['workersAssigned'].length;
                h=h*workerAssigned;
                m=m*workerAssigned;
            }

            if (value.userFirstName == "Open" && value.userLastName == "Shifts"){
                let workerAssigned = value['workersAssigned'] && value['workersAssigned'].length;
                let workerInvited =  value['workersInvited'] &&  value['workersInvited'].length;
                let openShift =  value['workersRequestedNum'] - ( workerAssigned+ workerInvited );
                h=h*openShift;
                m=m*openShift;
            }

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
                      <img src={this.props.view=="job"?data[0].positionByPositionId.positionIconUrl:data[0].userAvatar } alt="img"/>
                    </div>
                    <div className="user_desc penalheading">

                            {this.props.view=="job"? data[0].positionByPositionId.positionName : data[0].userFirstName}

                        <p>
                            <Truncate className="lastName">
                                {this.props.view=="job"?  "" :data[0].userLastName}
                            </Truncate>
                        </p>

                        <Truncate>
                            <p className="finalHours">{finalHours} HRS & <br/>{finalMinutes} MINS </p>
                        </Truncate>

                         <p className="scheduled_tag">BOOKED</p>

                    </div>
                  </div>
                </TableRowColumn>
                {
                    daysOfWeek.map((value,index)=> ((
                            <TableRowColumn key={index} className="shiftbox" style={{paddingLeft:'0px',paddingRight:'0px',backgroundColor:'#F5F5F5'}}>
                                {
                                    Object.values(hashByDay[value]).map((y, index)=>(
                                        <EventPopup users={this.props.users} data={y} key={index} view={this.props.view} />
                                    ))
                                }
                            </TableRowColumn>
                        )
                    ))
                }
            </TableRow>
        )
    }
}
