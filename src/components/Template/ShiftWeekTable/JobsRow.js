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
        const hashByDay = {"Sunday": [], "Monday": [], "Tuesday": [], "Wednesday": [], "Thursday": [], "Friday": [], "Saturday": []};
         this.props.data.map((value,index) => {
             const day = value.dayOfWeek
             if (hashByDay[day]){
                 hashByDay[day] = [...hashByDay[day], value];
             } else {
                 hashByDay[day] =  [value];
             }
         })

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
                                       <img width="55px" src={this.props.view=="job"?data[0].positionByPositionId.positionIconUrl : data[0].user[2] } alt="img"/>
                                    </div>
                                    <div className="user_desc penalheading">{this.props.view=="job" ? data[0].positionByPositionId.positionName.split(" ")[0] : data[0].user[0]}
                                       <p className="lastName">{ this.props.view=="job" ? data[0].positionByPositionId.positionName.split(" ")[1] : data[0].user[1]}</p>
                                        <p className="finalHours employeeFinalHours">{finalHours || 0} hours<br/>{finalMinutes || 0} Minutes</p>
                                    </div>
                               </div>
                </TableRowColumn>
                     {
                       Object.keys(hashByDay).map((value,index)=> ((
                          <TableRowColumn key={index} className="shiftbox" style={{paddingLeft:'0px',paddingRight:'0px',backgroundColor:'#F5F5F5'}}>
                                   {
                                      Object.values(hashByDay[value]).map((y, index)=>(
                                          <EventPopup data={y} key={index} view={this.props.view}/>
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
