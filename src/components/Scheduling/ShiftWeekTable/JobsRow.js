import React, { Component } from 'react';
import EventPopup from './EventPopup';
import moment from 'moment';
import '../style.css';

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
            <tr className="tableh">
                <td width="100%">
                    <table className="" width="100%">
                        <tbody>
                        <tr>
                            <td width="24%"><img src={data.icon} alt="img"/></td>
                            <td width="76%" className="penalheading">{data.title}<p>{finalHours} hours<br/>{finalMinutes} Minutes</p></td>
                        </tr>
                        </tbody>
                    </table>
                </td>
                {
                    Object.values(shifts).map((value,index)=> ((
                            <td key={index}>
                                {
                                    Object.values(value).map((value,index)=>(
                                        <EventPopup data={value} key={index}/>
                                    ))
                                }
                            </td>
                        )
                    ))
                }
            </tr>
        )
    }
}