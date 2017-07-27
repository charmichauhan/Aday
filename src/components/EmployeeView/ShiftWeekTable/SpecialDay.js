import React, { Component } from 'react';
import moment from 'moment';
import specialday from './specialday.json';
import '../../Scheduling/style.css';

export default class SpecialDay extends Component{
    render(){
        let start = this.props.dateStart;
        let special = [];
        specialday.map((value,index)=>{
            let today = moment(start);
            for (let d = 1; d <= 7; d++) {
                let spd = specialday[index];
                if(moment(spd['specialDayDate']).format('D/MM/YYYY') === moment(today["_d"]).format('D/MM/YYYY')) {
                    special[d] = value['day'];
                }
                today=moment(today).add(1,'days');
            }
        });
        return(
            <tr className="spday">
                <td></td>
                {special[1]?<td><p className="spclDay">{special[1]}</p></td>:<td></td>}
                {special[2]?<td><p className="spclDay">{special[2]}</p></td>:<td></td>}
                {special[3]?<td><p className="spclDay">{special[3]}</p></td>:<td></td>}
                {special[4]?<td><p className="spclDay">{special[4]}</p></td>:<td></td>}
                {special[5]?<td><p className="spclDay">{special[5]}</p></td>:<td></td>}
                {special[6]?<td><p className="spclDay">{special[6]}</p></td>:<td></td>}
                {special[7]?<td><p className="spclDay">{special[7]}</p></td>:<td></td>}
            </tr>
        )
    }
}