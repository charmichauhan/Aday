import React, { Component } from 'react';
import moment from 'moment';
import Week from 'react-big-calendar/lib/Week';
import dates from 'react-big-calendar/lib/utils/dates';
import localizer from 'react-big-calendar/lib/localizer';
import JobsRow from './JobsRow';
import { concat, groupBy  } from 'lodash';
import {Table, TableBody, TableHeader, TableFooter, TableRow, TableRowColumn} from "material-ui/Table";
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
    getSummary = (summary,start ) =>{
        let summaryDetail = [];
        for(var i=0;i<=6;i++){
            summaryDetail.push(<TableRowColumn style={styles.tableFooter}>
                <div className="stitle computed-weekly-scheduled-hour"><p className="bfont">hours booked:</p>
                    <p className="sfont">
                        {summary && summary[moment(start).day(i).format('D')] && summary[moment(start).day(i).format('D')]['totalBookedHours'] || 0} of {summary && summary[moment(start).day(i).format('D')] && summary[moment(start).day(i).format('D')]['totalHours'] || 0} |
                        {summary && summary[moment(start).day(i).format('D')] && Math.round((summary[moment(start).day(i).format('D')]['totalBookedHours']*100)/summary[moment(start).day(i).format('D')]['totalHours']) || 0}%
                    </p>
                </div>
            </TableRowColumn>);
        }
        return summaryDetail;
    };

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

        this.props.data.allShifts.edges.map((value, index) => {
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
      let { date } = this.props;
      let { start } = ShiftWeekTableComponent.range(date, this.props);
      let jobData = calendarHash;
      let jobs = [];
      (Object.keys(jobData)).forEach((jobType,index) => {
          jobs = concat(jobs, jobData[jobType])
      });
      let sortedData = jobs.map((job) => ({ ...job, startDate: new Date(job.startTime).getUTCDate()}));
      let groupedData = groupBy(sortedData, 'startDate');
      let summary = {};
      let weeklyHoursTotal = 0;
      let weeklyHoursBooked = 0;
      Object.keys(groupedData).forEach((shift,index) => {
        let totalHours=0;
        let totalBookedHours=0;
        let shiftData = groupedData[shift];
        Object.keys(shiftData).forEach((data,index) => {
          let startTime = moment(shiftData[data]['startTime']).format("hh:mm A");
          let endTime = moment(shiftData[data]['endTime']).format("hh:mm A");
          let workerAssigned = shiftData[data]['workersAssigned'] && shiftData[data]['workersAssigned'].length;
          let workerInvited = shiftData[data]['workersInvited'] && shiftData[data]['workersInvited'].length
          let shiftHours = parseInt(moment.utc(moment(endTime,"hh:mm A").diff(moment(startTime,"hh:mm A"))).format("H"));
          let openShift = shiftData[data]['workersRequestedNum'] - ( workerAssigned+ workerInvited );
          let openShiftTotal = shiftHours*openShift;
          let workersAssignedTotal = shiftHours*(workerAssigned);
          let workersInvitedTotal = shiftHours*(workerInvited);
          let workerShiftHours = openShiftTotal + workersAssignedTotal + workersInvitedTotal;
          totalHours += parseInt(workerShiftHours);
          totalBookedHours += workersAssignedTotal;
        });
        summary[shift] = {'totalHours':totalHours,'totalBookedHours':totalBookedHours};
        weeklyHoursTotal +=totalHours;
        weeklyHoursBooked += totalBookedHours;
      });
      let weeklyTotalHoursBooked = Math.round((weeklyHoursBooked*100)/weeklyHoursTotal) || 0;
      return (
          <div className="table-responsive">
              <Table bodyStyle={styles.bodyStyle} wrapperStyle={styles.wrapperStyle} footerStyle={styles.footerStyle}
                     fixedFooter={true} fixedHeader={true} width="100%" minHeight="100px"
                     className="table atable emp_view_table" style={styles.root}>
                  <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                      <TableRow displayBorder={false}>
                          <TableRowColumn style={styles.tableFooter} className="long dayname"><p className="weekDay">Hours Booked</p><p className="hoursWorked">{weeklyTotalHoursBooked || 0}%</p></TableRowColumn>
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
                      {
                          (Object.keys(jobData)).map((value, index)=>(
                              <JobsRow data={jobData[value]} key={value}/>
                          ))
                      }
                  </TableBody>
                  <TableFooter adjustForCheckbox={false}>
                      <TableRow displayBorder={false}>
                          <TableRowColumn style={styles.tableFooterHeading}>
                              <div className="mtitle computed-weekly-scheduled-hour "><p className="bfont">weekly
                                  hours booked:</p><p className="sfont">{weeklyHoursBooked} of {weeklyHoursTotal}
                                  | {weeklyTotalHoursBooked}%</p></div>
                          </TableRowColumn>
                          {this.getSummary(summary,start)}
                      </TableRow>
                      <TableRow displayBorder={false}>
                      </TableRow>
                  </TableFooter>
              </Table>
          </div>
      );
    }
}

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


const ShiftWeekTable = compose(

  graphql(allShiftsByWeeksPublished, {
    options: (ownProps) => ({
      variables: {
        publishId: ownProps.events
      }
    }),
  }),
  graphql(allUsers, {name: "allUsers"})
)(ShiftWeekTableComponent)
export default ShiftWeekTable
