import React,{Component} from 'react';

import { Provider } from 'react-redux';
import { createStore, combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import {Table, TableBody, TableHeader, TableFooter, TableRow, TableRowColumn} from "material-ui/Table";
import moment from 'moment';
import Week from 'react-big-calendar/lib/Week';
import dates from 'react-big-calendar/lib/utils/dates';
import localizer from 'react-big-calendar/lib/localizer';
import JobsRow from './JobsRow';
import { concat, groupBy  } from 'lodash';
import SpecialDay from "./SpecialDay";
import { gql,graphql,compose } from 'react-apollo';
import jobsData from "./jobs.json";
import '../style.css';
import allShiftsByWeeksPublished from './shiftsByWeeksPublishedQuery'


/*import EditShift from './ShiftEdit/Edit';
import DeleteShift from './ShiftEdit/DeleteShift';
*/


function shiftReducer(state={}, action) {
    switch (action.type) {
        case 'SUBMIT_NEW_SHIFT':
            return Object.assign({}, state, {
                shifts: [
                    ...(state.shifts || []),
                    {
                        //date: action.date,
                        workplace: action.workplace,
                        /*template: action.template,
                        certification: action.certification,
                        start: action.start,
                        end: action.end*/
                    }
                ]
            });
        default:
            return state
    }
}


const styles = {
        bodyStyle: {
        maxHeight: 990
    },
    wrapperStyle: {
        width: 1188
    },
    root: {
        borderCollapse: 'separate',
        borderSpacing: '8px 8px',
        paddingLeft:'0px',
        marginBottom:0
    },
    tableFooter: {
        padding:0
    },
    headerStyle: {
        padding:0
    },
    tableFooterHeading: {
        paddingLeft:'0px',
        paddingRight:'0px',
        width: 178
    },
    footerStyle: {
        position: 'fixed',
        bottom: 0,
        width:'calc(100% - 320px)',
        boxShadow:'0 1px 2px 0 rgba(74, 74, 74, 0.5)'
    }
};


class ShiftWeekTableComponent extends Week {
  constructor(props){
      super(props);
      this.state=({
         calendarView:"job"
      });
  }
  componentWillReceiveProps = () => {
    this.setState({calendarView:this.props.eventPropGetter()});
  };

  getSummary = (summary,start ) =>{
    if (this.state.calendarView=="job"){
     let summaryDetail = [];
      for(let i=0;i<=6;i++){
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
    }
  };
  getDataEmployeeView = (workplaceId,data,allUsers) => {
    let userHash = {};
    let calendarHash = {};
    if  (allUsers && allUsers.allUsers){
      allUsers.allUsers.edges.map((value,index) => {
        userHash[value.node.id] = [value.node.firstName, value.node.lastName, value.node.avatarUrl]
      });

      data.allShifts.edges.map((value, index) => {
        if(workplaceId != "") {
          if (workplaceId == value.node.workplaceByWorkplaceId.id) {

            const dayOfWeek = moment(value.node.startTime).format("dddd");

            let assigned = value.node.workersAssigned
            if (value.node.workersAssigned == null) {
              assigned = [];
            }
            if (!assigned.length) {
              const rowHash = {}
              rowHash["weekday"] = dayOfWeek;
              rowHash["userFirstName"] = "Open"
              rowHash["userLastName"] = "Shifts"
              rowHash["userAvatar"] = "/assets/Icons/search.png"
              if (calendarHash["Open Shifts"]) {
                calendarHash["Open Shifts"] = [...calendarHash["Open Shifts"], Object.assign(rowHash, value.node)]
              } else {
                calendarHash["Open Shifts"] = [Object.assign(rowHash, value.node)]
              }
            }
            else{
              value.node.workersAssigned.map((v) => {
                const rowHash = {}
                rowHash["weekday"] = dayOfWeek;
                const userName = userHash[v];
                rowHash["userFirstName"] = userHash[v][0]
                rowHash["userLastName"] = userHash[v][1]
                rowHash["userAvatar"] = userHash[v][2]
                if (calendarHash[userName]) {
                  calendarHash[userName] = [...calendarHash[userName], Object.assign(rowHash, value.node)]
                } else {
                  calendarHash[userName] = [Object.assign(rowHash, value.node)];
                }
              })
            }
          }
        }
        else {

          const dayOfWeek = moment(value.node.startTime).format("dddd");

          let assigned = value.node.workersAssigned
          if (value.node.workersAssigned == null) {
            assigned = [];
          }
          if (!assigned.length) {
            const rowHash = {}
            rowHash["weekday"] = dayOfWeek;
            rowHash["userFirstName"] = "Open"
            rowHash["userLastName"] = "Shifts"
            rowHash["userAvatar"] = "/assets/Icons/search.png"
            if (calendarHash["Open Shifts"]) {
              calendarHash["Open Shifts"] = [...calendarHash["Open Shifts"], Object.assign(rowHash, value.node)]
            } else {
              calendarHash["Open Shifts"] = [Object.assign(rowHash, value.node)]
            }
          }
          else{
            value.node.workersAssigned.map((v) => {
              const rowHash = {}
              rowHash["weekday"] = dayOfWeek;
              const userName = userHash[v];
              rowHash["userFirstName"] = userHash[v][0]
              rowHash["userLastName"] = userHash[v][1]
              rowHash["userAvatar"] = userHash[v][2]
              if (calendarHash[userName]) {
                calendarHash[userName] = [...calendarHash[userName], Object.assign(rowHash, value.node)]
              } else {
                calendarHash[userName] = [Object.assign(rowHash, value.node)];
              }
            })
          }
        }
      });
    }
    return calendarHash;
  };

  getDataJobView = (workplaceId,data) => {
    let calendarHash = {};
    data.allShifts.edges.map((value, index) => {
      if(workplaceId != ""){
        if(workplaceId == value.node.workplaceByWorkplaceId.id){
          const positionName = value.node.positionByPositionId.positionName;
          const dayOfWeek = moment(value.node.startTime).format("dddd");
          const rowHash = {};
          rowHash["weekday"] = dayOfWeek;
          if (calendarHash[positionName]) {
            calendarHash[positionName] = [...calendarHash[positionName], Object.assign(rowHash, value.node)]
          } else {
            calendarHash[positionName] = [Object.assign(rowHash, value.node)];
          }
        }
      }
      else{
        const positionName = value.node.positionByPositionId.positionName;
        const dayOfWeek = moment(value.node.startTime).format("dddd");
        const rowHash = {};
        rowHash["weekday"] = dayOfWeek;
        if (calendarHash[positionName]) {
          calendarHash[positionName] = [...calendarHash[positionName], Object.assign(rowHash, value.node)]
        } else {
          calendarHash[positionName] = [Object.assign(rowHash, value.node)];
        }
      }
    });
    return calendarHash;
  };
    render() {
      if (this.props.data.loading || this.props.allUsers.loading) {
        return (<div>Loading</div>)
      }
      let workplaceId = localStorage.getItem("workplaceId");
      let {data} = this.props;
      let jobData = this.state.calendarView=="job"?this.getDataJobView(workplaceId,data):this.getDataEmployeeView(workplaceId,data,this.props.allUsers);
      let jobDataKeys = Object.keys(jobData)
      let openShiftIndex = jobDataKeys.indexOf("Open Shifts")
      jobDataKeys.splice(openShiftIndex, 1);
      let jobs = [];
      (Object.keys(jobData)).forEach((jobType,index) => {
          jobs = concat(jobs, jobData[jobType])
      });
      let sortedData = jobs.map((job) => ({ ...job, startDate: new Date(job.startTime).getUTCDate()}));
      let groupedData = groupBy(sortedData, 'startDate');
      let summary = {};
      let weeklyHoursTotal = 0;
      let weeklyHoursBooked = 0;
      let weeklyTotalHoursBooked = 0;
      if (this.state.calendarView=="job"){
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
        weeklyTotalHoursBooked = Math.round((weeklyHoursBooked*100)/weeklyHoursTotal) || 0;
      }
      let { date } = this.props;
      let { start } = ShiftWeekTable.range(date, this.props);
      let is_publish = true;
      const reducer = combineReducers ({ form: formReducer, shifts: shiftReducer});
      const store = createStore(reducer, {shifts: []});
      let unsubscribe = store.subscribe(() =>
          console.log(store.getState())
      );

      const TableRowHeader = ( <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                            <TableRow displayBorder={false}>
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
                                    className="weekDate">{moment(start).day(6).format('D')}</p></TableRowColumn>
                            </TableRow>
                        </TableHeader>)




      if (this.props.data.error) {
        return (
        <div className="table-responsive">
                    <Table bodyStyle={styles.bodyStyle} wrapperStyle={styles.wrapperStyle} footerStyle={styles.footerStyle}
                           fixedFooter={true} fixedHeader={true} width="100%" minHeight="100px"
                           className="table atable emp_view_table" style={styles.root}>
                          { TableRowHeader }
                      </Table>
        </div>
        )
      }

      return (
            <Provider store={store}>
                <div className="table-responsive">
                    <Table bodyStyle={styles.bodyStyle} wrapperStyle={styles.wrapperStyle} footerStyle={styles.footerStyle}
                           fixedFooter={true} fixedHeader={true} width="100%" minHeight="100px"
                           className="table atable emp_view_table" style={styles.root}>
                        <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                            <TableRow displayBorder={false}>
                                <TableRowColumn style={styles.tableFooter} className="long dayname">
                                  { this.state.calendarView=="job"? (
                                   <div> <p className="weekDay">Hours Booked</p>
                                   <p className="hoursWorked">{weeklyTotalHoursBooked || 0}%</p> </div>) : "" }
                                </TableRowColumn>
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
                                    className="weekDate">{moment(start).day(6).format('D')}</p></TableRowColumn>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <SpecialDay dateStart={start} setSpecialDay={this.getSpecialDay}/>

                            {jobDataKeys.map((value, index) => (
                                  <JobsRow
                                      data={jobData[value]}
                                      key={value}
                                      users={this.props.allUsers}
                                      view={this.state.calendarView} />
                                )
                            )
                            }

                            {jobData["Open Shifts"] &&
                                   <JobsRow
                                      data={jobData["Open Shifts"]}
                                      key={"Open Shifts"}
                                      users={this.props.allUsers}
                                      view={this.state.calendarView} />
                            }
                        </TableBody>
                        <TableFooter adjustForCheckbox={false}>
                            <TableRow displayBorder={false}>
                                <TableRowColumn style={styles.tableFooterHeading}>
                                  { this.state.calendarView=="job"? (<div className="mtitle computed-weekly-scheduled-hour "><p className="bfont">weekly
                                        hours booked:</p><p className="sfont">{weeklyHoursBooked} of {weeklyHoursTotal}
                                         | {weeklyTotalHoursBooked}%</p></div>) : "" }
                                </TableRowColumn>
                                {this.getSummary(summary,start)}
                            </TableRow>
                            <TableRow displayBorder={false}>
                            </TableRow>
                        </TableFooter>
                    </Table>
                </div>
            </Provider>
        );
    }
}



ShiftWeekTableComponent.range = (date, { culture }) => {
    let firstOfWeek = localizer.startOfWeek(culture);
    let start = moment(dates.startOf(date, 'week', firstOfWeek));
    let end = moment(dates.endOf(date, 'week', firstOfWeek));
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
        publishId: ownProps.events.publish_id
      }
    }),
  }),
  graphql(allUsers, {name: "allUsers"})
)(ShiftWeekTableComponent);

export default ShiftWeekTable
