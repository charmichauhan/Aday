import React, { Component } from 'react';
import moment from 'moment';
import specialday from './specialday.json';
import '../style.css';
import {
    TableRow,
    TableRowColumn,
} from 'material-ui/Table';
const styles={
    paddingLeft:'0',
    paddingRight:'0',
    height:'auto'
};
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
            <TableRow className="spday" displayBorder={false} style={{height:'auto'}}>
                <TableRowColumn style={styles} className="headcol"></TableRowColumn>
                {special[1]?<TableRowColumn style={styles}><p className="spclDay">{special[1]}</p></TableRowColumn>:<TableRowColumn style={styles}></TableRowColumn>}
                {special[2]?<TableRowColumn style={styles}><p className="spclDay">{special[2]}</p></TableRowColumn>:<TableRowColumn style={styles}></TableRowColumn>}
                {special[3]?<TableRowColumn style={styles}><p className="spclDay">{special[3]}</p></TableRowColumn>:<TableRowColumn style={styles}></TableRowColumn>}
                {special[4]?<TableRowColumn style={styles}><p className="spclDay">{special[4]}</p></TableRowColumn>:<TableRowColumn style={styles}></TableRowColumn>}
                {special[5]?<TableRowColumn style={styles}><p className="spclDay">{special[5]}</p></TableRowColumn>:<TableRowColumn style={styles}></TableRowColumn>}
                {special[6]?<TableRowColumn style={styles}><p className="spclDay">{special[6]}</p></TableRowColumn>:<TableRowColumn style={styles}></TableRowColumn>}
                {special[7]?<TableRowColumn style={styles}><p className="spclDay">{special[7]}</p></TableRowColumn>:<TableRowColumn style={styles}></TableRowColumn>}
            </TableRow>
        )
    }
}