import React, { Component } from 'react';
import EventPopup from './EventPopup';
import moment from 'moment';
import '../../Scheduling/style.css';

export default class JobsRow extends Component{
    render(){

        let data = this.props.data;
        const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
        const hashByDay = {"Monday": [], "Tuesday": [], "Wednesday": [], "Thursday": [], "Friday": [], "Saturday": [], "Sunday": []};
         this.props.data.map((value,index) => {
             const day = value.weekday
             if (hashByDay[day]){
                 hashByDay[day] = [...hashByDay[day], value];
             } else {
                 hashByDay[day] =  [value];
             }
         })


        let finalHours = 0;
        let finalMinutes = 0;
        Object.values(this.props.data).map((value,index) => {
            let startTime = moment(value.startTime);
            let endTime = moment(value.endTime);
            let h = endTime.diff(startTime,'hours');
            let m = moment.utc(moment(endTime).diff(moment(startTime))).format("mm");
            finalHours += h;
            finalMinutes += parseInt(m);
        });
        let adHours= Math.floor(finalMinutes/60);
        finalHours+=adHours;
        finalMinutes = finalMinutes - (adHours*60);

        return(

            <tr className="tableh">
                <td className="headcol" width="100%">
                    {/*<table className="" width="100%">*/}
                        {/*<tbody height={"50%"}>*/}
                        {/*<tr>*/}
                            {/*<td width="24%"><img src={data.image} alt="img"/></td>*/}
                            {/*<td width="76%" className="penalheading">{data.firstName}*/}
                            {/*<p className="lastName">{data.lastName}</p>*/}
                                {/*<p className="finalHours employeeFinalHours">{finalHours} hours<br/>{finalMinutes} Minutes</p></td>*/}
                        {/*</tr>*/}
                        {/*</tbody>*/}
                    {/*</table>*/}
                    <div className="user_profile">
                        <div className="user_img">
                            <img width="65px" src={data[0].userAvatar} alt="img"/>
                        </div>
                        <div className="user_desc penalheading">{ data[0].userFirstName }
                            <p className="lastName">{ data[0].userLastName }</p>
                            <p className="finalHours employeeFinalHours">{finalHours} hours<br/>{finalMinutes} Minutes</p>
                        </div>
                    </div>
                </td>
                {
                    daysOfWeek.map((value,index)=> ((
                            <td key={index} className="shiftbox">
                                {
                                    Object.values(hashByDay[value]).map((v,i)=>(
                                        <EventPopup data={v} key={i}/>

                                    ))
                                }
                                <button type="button" className="addshift">
                                    + ADD HOURS
                                </button>
                            </td>
                        )
                    ))
                }
            </tr>
        )
    }
}