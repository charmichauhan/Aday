import React, {Component} from "react";
import moment from "moment";
import Week from "react-big-calendar/lib/Week";
import dates from "react-big-calendar/lib/utils/dates";
import localizer from "react-big-calendar/lib/localizer";
import JobsRow from "./JobsRow";
import HoursBooked from "./HoursBooked";
import jobsData from "./jobs.json";
import SpecialDay from "./SpecialDay";
import Modal from '../../helpers/Modal';
import CircleButton from '../../helpers/CircleButton';
import "../../Scheduling/style.css";
import {Table, TableBody, TableHeader, TableFooter, TableRow, TableRowColumn} from "material-ui/Table";

const styles = {
    bodyStyle: {
        maxHeight: 900
    },
    wrapperStyle: {
        width: 1188
    },
    root: {
        borderCollapse: 'separate',
        borderSpacing: '8px 8px',
        marginBottom:0
    },
    tableFooter: {
        paddingLeft:'0px',
        paddingRight:'0px'
    },
    tableFooterHeading: {
        paddingLeft:'0px',
        paddingRight:'0px',
        width: 178
    }
};
export default class ShiftWeekTable extends Week {
    constructor(props){
        super(props);
        this.state={
            deleteTemplateModal:false
        };
    }
    modalClose = () => {
        this.setState({
            deleteTemplateModal:false
        });
    };
    handleDeleteTemplate = () => {
        let that =this;
        that.setState({deleteTemplateModal:true})
    };
    render() {
        let jobData = jobsData;
        let {date} = this.props;
        let {start} = ShiftWeekTable.range(date,this.props);
        let deleteTemplateAction =[{type:"white",title:"Cancel",handleClick:this.modalClose,image:false},
            {type:"red",title:"Delete Shift",handleClick:this.deleteShift,image:true}];
        return (
            <div>
            <div className="table-responsive">
                <Table bodyStyle={styles.bodyStyle} wrapperStyle={styles.wrapperStyle}
                       fixedFooter={true} fixedHeader={true} width="100%" minHeight="100px"
                       className="table atable emp_view_table" style={styles.root}>
                    <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                        <TableRow displayBorder={false}>
                            <TableRowColumn style={styles.tableFooter} className="long dayname"><p className="weekDay">Hours Booked</p><HoursBooked
                                Data={jobData}/></TableRowColumn>
                            <TableRowColumn style={styles.tableFooter} className="dayname"><p
                                className="weekDay"> {moment(start).day(0).format('dddd')}</p><p
                                className="weekDate">{moment(start).day(0).format('D')}</p></TableRowColumn>
                            <TableRowColumn style={styles.tableFooter} className="dayname"><p
                                className="weekDay"> {moment(start).day(1).format('dddd')} </p>
                                <p className="weekDate">{moment(start).day(1).format('D')}</p></TableRowColumn>
                            <TableRowColumn style={styles.tableFooter} className="dayname"><p
                                className= "weekDay"> {moment(start).day(2).format('dddd')} </p><p
                                className="weekDate">  {moment(start).day(2).format('D')}</p></TableRowColumn>
                            <TableRowColumn style={styles.tableFooter} className="dayname"><p
                                className="weekDay"> {moment(start).day(3).format('dddd')} </p><p
                                className="weekDate">  {moment(start).day(3).format('D')}</p></TableRowColumn>
                            <TableRowColumn style={styles.tableFooter} className="dayname"><p
                                className="weekDay"> {moment(start).day(4).format('dddd')} </p><p
                                className="weekDate">  {moment(start).day(4).format('D')}</p></TableRowColumn>
                            <TableRowColumn style={styles.tableFooter} className="dayname"><p
                                className="weekDay"> {moment(start).day(5).format('dddd')} </p><p
                                className="weekDate">  {moment(start).day(5).format('D')}</p></TableRowColumn>
                            <TableRowColumn style={styles.tableFooter} className="dayname"><p
                                className="weekDay"> {moment(start).day(6).format('dddd')} </p><p
                                className="weekDate">  {moment(start).day(6).format('D')}</p></TableRowColumn>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <SpecialDay/>
                        {jobData.map((value, index) => (
                                <JobsRow data={jobData[index]} key={index}/>
                            )
                        )
                        }
                    </TableBody>
                    <TableFooter adjustForCheckbox={false}>
                        <TableRow displayBorder={false}>
                            <TableRowColumn style={styles.tableFooterHeading}>
                                <div className="mtitle computed-weekly-scheduled-hour "><p className="bfont">weekly
                                    hours booked:</p><p className="sfont">185 of 236 | 78%</p></div>
                            </TableRowColumn>
                            <TableRowColumn style={styles.tableFooter}>
                                <div className="stitle computed-weekly-scheduled-hour"><p className="bfont">hours
                                    booked</p><p className="sfont">185 of 236 | 78%</p></div>
                            </TableRowColumn>
                            <TableRowColumn style={styles.tableFooter}>
                                <div className="stitle computed-weekly-scheduled-hour"><p className="bfont">hours
                                    booked</p><p className="sfont">185 of 236 | 78%</p></div>
                            </TableRowColumn>
                            <TableRowColumn style={styles.tableFooter}>
                                <div className="stitle computed-weekly-scheduled-hour"><p className="bfont">hours
                                    booked</p><p className="sfont">185 of 236 | 78%</p></div>
                            </TableRowColumn>
                            <TableRowColumn style={styles.tableFooter}>
                                <div className="stitle computed-weekly-scheduled-hour"><p className="bfont">hours
                                    booked</p><p className="sfont">185 of 236 | 78%</p></div>
                            </TableRowColumn>
                            <TableRowColumn style={styles.tableFooter}>
                                <div className="stitle computed-weekly-scheduled-hour"><p className="bfont">hours
                                    booked</p><p className="sfont">185 of 236 | 78%</p></div>
                            </TableRowColumn>
                            <TableRowColumn style={styles.tableFooter}>
                                <div className="stitle computed-weekly-scheduled-hour"><p className="bfont">hours
                                    booked</p><p className="sfont">185 of 236 | 78%</p></div>
                            </TableRowColumn>
                            <TableRowColumn style={styles.tableFooter}>
                                <div className="stitle computed-weekly-scheduled-hour"><p className="bfont">hours
                                    booked</p><p className="sfont">185 of 236 | 78%</p></div>
                            </TableRowColumn>
                        </TableRow>
                        <TableRow displayBorder={false}>
                            <TableRowColumn style={styles.tableFooter}>
                                <div className="mtitle"><p className="bfont">weekly spend booked:</p><p
                                    className="sfont">$12038 of $18293 | 66%</p></div>
                            </TableRowColumn>
                            <TableRowColumn style={styles.tableFooter}>
                                <div className="stitle"><p className="bfont">spend booked</p><p className="sfont">$1293
                                    of $2019 | 64%</p></div>
                            </TableRowColumn>
                            <TableRowColumn style={styles.tableFooter}>
                                <div className="stitle"><p className="bfont">hours booked</p><p className="sfont">185 of
                                    236 | 78%</p></div>
                            </TableRowColumn>
                            <TableRowColumn style={styles.tableFooter}>
                                <div className="stitle "><p className="bfont">hours booked</p><p className="sfont">185
                                    of 236 | 78%</p></div>
                            </TableRowColumn>
                            <TableRowColumn style={styles.tableFooter}>
                                <div className="stitle "><p className="bfont">hours booked</p><p className="sfont">185
                                    of 236 | 78%</p></div>
                            </TableRowColumn>
                            <TableRowColumn style={styles.tableFooter}>
                                <div className="stitle "><p className="bfont">hours booked</p><p className="sfont">185
                                    of 236 | 78%</p></div>
                            </TableRowColumn>
                            <TableRowColumn style={styles.tableFooter}>
                                <div className="stitle "><p className="bfont">hours booked</p><p className="sfont">185
                                    of 236 | 78%</p></div>
                            </TableRowColumn>
                            <TableRowColumn style={styles.tableFooter}>
                                <div className="stitle "><p className="bfont">hours booked</p><p className="sfont">185
                                    of 236 | 78%</p></div>
                            </TableRowColumn>
                        </TableRow>
                    </TableFooter>
                </Table>
            </div>
                {this.state.deleteTemplateModal?<Modal isOpen = {this.state.deleteTemplateModal} title="Confirm"
                                                     message = 'Are you sure that you want to delete the "Standard $5000 Sales Week" template?'
                                                     action = {deleteTemplateAction} 
                                                       closeAction={this.modalClose} />
                    :""}
            <div className="text-center">
                <CircleButton type="white" title="Cancel" handleClick={this.handleDeleteTemplate}/>
                <CircleButton type="red" title="delete template" handleClick={this.handleDeleteTemplate}/>
                <CircleButton type="blue" title="apply template" handleClick={this.handleDeleteTemplate}/>
             </div>
            </div>
        );
    }
}

ShiftWeekTable.range = (date, {culture}) => {
    let firstOfWeek = localizer.startOfWeek(culture);
    let start = dates.startOf(date, 'week', firstOfWeek);
    let end = dates.endOf(date, 'week', firstOfWeek);
    return {start, end};
};
