import React, { Component } from 'react';
import moment from 'moment';
import specialday from './specialday.json';
import '../../Scheduling/style.css';
import {
    TableRow,
    TableRowColumn,
} from 'material-ui/Table';


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
            <TableRow className="spday" displayBorder={false}>
                <TableRowColumn className="headcol" style={{paddingLeft:'0px',paddingRight:'0px'}}></TableRowColumn>
                {special[1]?<TableRowColumn><p className="spclDay">{special[1]}</p></TableRowColumn>:<TableRowColumn></TableRowColumn>}
                {special[2]?<TableRowColumn><p className="spclDay">{special[2]}</p></TableRowColumn>:<TableRowColumn></TableRowColumn>}
                {special[3]?<TableRowColumn><p className="spclDay">{special[3]}</p></TableRowColumn>:<TableRowColumn></TableRowColumn>}
                {special[4]?<TableRowColumn><p className="spclDay">{special[4]}</p></TableRowColumn>:<TableRowColumn></TableRowColumn>}
                {special[5]?<TableRowColumn><p className="spclDay">{special[5]}</p></TableRowColumn>:<TableRowColumn></TableRowColumn>}
                {special[6]?<TableRowColumn><p className="spclDay">{special[6]}</p></TableRowColumn>:<TableRowColumn></TableRowColumn>}
                {special[7]?<TableRowColumn><p className="spclDay">{special[7]}</p></TableRowColumn>:<TableRowColumn></TableRowColumn>}
                <TableRowColumn className="headcol" style={{paddingLeft:'0px',paddingRight:'0px'}}>
                    <div className="user_profile" width="80%">
                        <div className="user_img">
                            <img src={data.image} alt="img"/>
                        </div>
                        <div className="user_desc penalheading">{data.firstName}
                            <p className="lastName">{data.lastName}</p>
                            <p className="finalHours employeeFinalHours">{finalHours} hours<br/>{finalMinutes} Minutes</p>
                        </div>
                    </div>
                </TableRowColumn>
            </TableRow>
        )
    }
}