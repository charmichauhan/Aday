import React, { Component } from 'react';
import moment from 'moment';
import Week from 'react-big-calendar/lib/Week';
import dates from 'react-big-calendar/lib/utils/dates';
import localizer from 'react-big-calendar/lib/localizer';
import JobsRow from './JobsRow';
import {Table, TableBody, TableHeader, TableFooter, TableRow, TableRowColumn} from "material-ui/Table";
import HoursBooked from "./HoursBooked";
import SpecialDay from "./SpecialDay";
import jobsData from "./jobs.json";
import '../../Scheduling/style.css';
import { gql, graphql, compose } from 'react-apollo';
import allShiftsByWeeksPublished from '../../Scheduling/ShiftWeekTable/shiftsByWeeksPublishedQuery'

const styles = {

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
    },
    footerStyle: {
        position:'fixed',
        bottom:0,
        width: 'calc(100% - 290px)',
        boxShadow:'0 1px 2px 0 rgba(74, 74, 74, 0.5)'
    }
};

class ShiftWeekTableComponent extends Week {
    render() {
        if (this.props.data.loading) {
            return (<div>Loading</div>)
        }

        if (this.props.data.error) {
            console.log(this.props.data.error)
            return (<div>An unexpected error occurred</div>)
        }

        let userHash = {};
        let calendarHash = {};
        if  (this.props.allUsers && this.props.allUsers.allUsers){
            this.props.allUsers.allUsers.edges.map((value,index) => {
                userHash[value.node.id] = [value.node.firstName, value.node.lastName, value.node.avatarUrl]
            });
            const weekPublished = this.props.data.weekPublishedByDate.nodes[0];
            if (weekPublished){
                weekPublished.shiftsByWeekPublishedId.edges.map((value,index) => {
                    const rowHash = {}
                    const dayOfWeek = moment(value.node.startTime).format("dddd");
                    rowHash["weekday"] = dayOfWeek;
                    let assigned = value.node.workersAssigned
                    if (value.node.workersAssigned == null){
                        assigned  = [];
                    }
                    if (value.node.workersRequestedNum > assigned.length){
                        rowHash["userFirstName"] = "Open"
                        rowHash["userLastName"] = "Shifts"
                        rowHash["userAvatar"] = ""
                        if (calendarHash["Open Shifts"]){
                            calendarHash["Open Shifts"] = [...calendarHash["Open Shifts"],  Object.assign(rowHash, value.node)]
                        } else {
                            calendarHash["Open Shifts"] = [Object.assign(rowHash, value.node)]
                        }
                    }
                    if (assigned.length) {
                        value.node.workersAssigned.map((v) => {
                            const userName = userHash[v];
                            rowHash["userFirstName"] = userHash[v][0]
                            rowHash["userLastName"] = userHash[v][1]
                            rowHash["userAvatar"] = userHash[v][2]
                            if (calendarHash[userName]) {
                                calendarHash[userName] = [...calendarHash[userName], Object.assign(rowHash, value.node) ]
                            } else {
                                calendarHash[userName] = [Object.assign(rowHash, value.node)];
                            }
                        })
                    }
                });
            }

        }
        let { date } = this.props;
        let { start } = ShiftWeekTableComponent.range(date, this.props);
        let jobData = calendarHash;
        return (
            <div className="table-responsive">
                <Table bodyStyle={styles.bodyStyle} wrapperStyle={styles.wrapperStyle} footerStyle={styles.footerStyle}
                       fixedFooter={true} fixedHeader={true} width="100%" minHeight="100px"
                       className="table atable emp_view_table" style={styles.root}>
                    <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                        <TableRow displayBorder={false}>
                            <TableRowColumn style={styles.tableFooter} className="long dayname"><p className="weekDay">Hours Booked</p>78%</TableRowColumn>
                            <TableRowColumn style={styles.tableFooter} className="dayname"><p
                                className="weekDay"> {moment(start).day(0).format('dddd')}</p><p
                                className="weekDate">{moment(start).day(0).format('D')}</p></TableRowColumn>
                            <TableRowColumn style={styles.tableFooter} className="dayname"><p
                                className="weekDay"> {moment(start).day(1).format('dddd')} </p>
                                <p className="weekDate">{moment(start).day(1).format('D')}</p></TableRowColumn>
                            <TableRowColumn style={styles.tableFooter} className="dayname"><p
                                className="weekDay"> {moment(start).day(2).format('dddd')} </p><p
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
                        {
                            (Object.keys(jobData)).map((value, index)=>(
                                <JobsRow data={jobData[value]} key={value}/>
                            ))
                        }
                    </TableBody>
                </Table>
            </div>
        );
    }
}


/*
                    <p className="weekDay">Hours Booked</p><HoursBooked
                                Data={jobData}/>
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
        );
    }
}

*/

ShiftWeekTableComponent.range = (date, { culture }) => {
    let firstOfWeek = localizer.startOfWeek(culture);
    let start = dates.startOf(date, 'week', firstOfWeek);
    let end = dates.endOf(date, 'week', firstOfWeek);
    return { start, end };
};

const allUsers = gql`
    query allUsers {
        allUsers{
            edges{
                node{
                    id
                    firstName
                    lastName
                    avatarUrl
                }
            }
        }
    }
    `
    
///
const ShiftWeekTable = compose(
graphql(allShiftsByWeeksPublished, {
   options: (ownProps) => ({ 
     variables: {
       brandid: "5a14782b-c220-4927-b059-f4f22d01c230",
       day: moment(ownProps.date)
     }
   }),
 }),
 graphql(allUsers, {name: "allUsers"})
 )(ShiftWeekTableComponent)


export default ShiftWeekTable