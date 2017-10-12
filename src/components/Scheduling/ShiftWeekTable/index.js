import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { createStore, combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import { Table, TableBody, TableHeader, TableFooter, TableRow, TableRowColumn } from 'material-ui/Table';
import moment from 'moment';
import Week from 'react-big-calendar/lib/Week';
import dates from 'react-big-calendar/lib/utils/dates';
import localizer from 'react-big-calendar/lib/localizer';
import JobsRow from './JobsRow';
import { concat, groupBy, pick, find } from 'lodash';
import SpecialDay from './SpecialDay';
import { gql, graphql, compose } from 'react-apollo';
import jobsData from './jobs.json';
import '../style.css';
import allShiftsByWeeksPublished from './shiftsByWeeksPublishedQuery'
var Halogen = require('halogen');
/*
import EditShift from './ShiftEdit/Edit';
import DeleteShift from './ShiftEdit/DeleteShift';
 */


function shiftReducer(state = {}, action) {
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
        width: 1610
    },
    root: {
        borderCollapse: 'separate',
        borderSpacing: '8px 8px',
        paddingLeft:'0px',
        marginBottom: 0,
        minWidth: 1750,
    },
    tableFooter: {
        padding:0,
        height: 'auto',
        border: '0 none'
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
        bottom: 10,
        /*
        width:'calc(100% - 320px)',
        */
        boxShadow:'0 1px 2px 0 rgba(74, 74, 74, 0.5)'
    },
  heightremove: {
          height: 'auto'

  }
};


class ShiftWeekTableComponent extends Week {
  constructor(props) {
    super(props);
    this.state = ({
      calendarView: 'job'
    });
  }

  componentWillReceiveProps = (nextProps) => {
      if (!nextProps.data.loading && !nextProps.allUsers.loading && !nextProps.dataReceived) {
        this.props.setCSVData(this.csvData(nextProps));
      }
    this.setState({calendarView: this.props.eventPropGetter()});
  };

  getSummary = (summary, start) => {
    let summaryDetail = [];
    for (let i = 0; i <= 6; i++) {
      summaryDetail.push(<TableRowColumn style={styles.tableFooter}>
        <div className="stitle computed-weekly-scheduled-hour"><p className="bfont">hours booked:</p>
          <p className="sfont">
            {summary && summary[moment(start).day(i).format('D')] && summary[moment(start).day(i).format('D')]['totalBookedHours'] || 0}
            of {summary && summary[moment(start).day(i).format('D')] && summary[moment(start).day(i).format('D')]['totalHours'] || 0}
            |
            {summary && summary[moment(start).day(i).format('D')] && Math.round((summary[moment(start).day(i).format('D')]['totalBookedHours'] * 100) / summary[moment(start).day(i).format('D')]['totalHours']) || 0}%
          </p>
        </div>
      </TableRowColumn>);
    }
    return summaryDetail;
  };


  getUserById = (id, props) => {
    const users = props.allUsers;
    let foundWorker = find(users.allUsers.edges, (user) => user.node.id === id);
    if (!foundWorker) return null;
    return pick(foundWorker.node, ['id', 'avatarUrl', 'firstName', 'lastName']);
  };

  getShiftData = (shiftValue, props) => {
    const shift = {...shiftValue};
    if (!shift.workersAssigned) shift.workersAssigned = [];
      shift.workersAssigned = shift.workersAssigned.map(worker => {
        if (typeof worker === 'string') {
          return this.getUserById(worker, props);
        }
        return null;
      });
    return shift;
  };

  csvData = (props) => {

    const userAssignedShifts =  props.data.allShifts.edges.map(({node}) => {
        return this.getShiftData(node, props);
    }).filter((shift) => { return shift.workersAssigned.length });

    const csvShifts = [];

    userAssignedShifts.forEach((shift) => {
      const weekday = moment(shift.startTime).format('dddd');

      if (localStorage.getItem('workplaceId') != '') {
        if (localStorage.getItem('workplaceId') == shift.workplaceByWorkplaceId.id) {
          shift.workersAssigned.forEach((user) => {
            csvShifts.push({
              userId: user.id,
              positionId: shift.positionByPositionId.id,
              PositionName: shift.positionByPositionId.positionName,
              FirstName: user.firstName,
              LastName: user.lastName,
              [weekday]: moment(shift.startTime).format('h:mm A') + ' to ' +moment(shift.endTime).format('h:mm A'),

            })
          });
        }
      }else {
        shift.workersAssigned.forEach((user) => {
          csvShifts.push({
            userId: user.id,
            positionId: shift.positionByPositionId.id,
            PositionName: shift.positionByPositionId.positionName,
            FirstName: user.firstName,
            LastName: user.lastName,
            [weekday]: moment(shift.startTime).format('h:mm A') + ' to ' +moment(shift.endTime).format('h:mm A'),

          })
        });
      }
    });
  return csvShifts;
  };

  getDataEmployeeView = (workplaceId, data, allUsers, recurring, start) => {
    let userHash = {};
    let calendarHash = {};
    if (allUsers && allUsers.allUsers) {
      allUsers.allUsers.edges.map((value, index) => {
        userHash[value.node.id] = [value.node.firstName, value.node.lastName, value.node.avatarUrl]
      });



      data.allShifts.edges.map((value, index) => {
        if (workplaceId != '') {
          if (workplaceId == value.node.workplaceByWorkplaceId.id) {

            const dayOfWeek = moment(value.node.startTime).format('dddd').toUpperCase();;

            let assigned = value.node.workersAssigned
            if (value.node.workersAssigned == null) {
              assigned = [];
            }
            if (assigned.length < value.node.workersRequestedNum) {
              const rowHash = {}
              rowHash['weekday'] = dayOfWeek;
              rowHash['userFirstName'] = 'Open'
              rowHash['userLastName'] = 'Shifts'
              rowHash['userAvatar'] = '/assets/Icons/search.png'
              if (calendarHash['Open Shifts']) {
                calendarHash['Open Shifts'] = [...calendarHash['Open Shifts'], Object.assign(rowHash, value.node)]
              } else {
                calendarHash['Open Shifts'] = [Object.assign(rowHash, value.node)]
              }
            }
            assigned.map((v) => {
              const rowHash = {}
              rowHash['weekday'] = dayOfWeek;
              const userName = userHash[v];
              rowHash['userFirstName'] = userHash[v][0]
              rowHash['userLastName'] = userHash[v][1]
              rowHash['userAvatar'] = userHash[v][2]
              if (calendarHash[userName]) {
                calendarHash[userName] = [...calendarHash[userName], Object.assign(rowHash, value.node)]
              } else {
                calendarHash[userName] = [Object.assign(rowHash, value.node)];
              }
            })
          }
        }
        else {

          const dayOfWeek = moment(value.node.startTime).format('dddd').toUpperCase();;

          let assigned = value.node.workersAssigned
          if (value.node.workersAssigned == null) {
            assigned = [];
          }
          if (assigned.length < value.node.workersRequestedNum) {
            const rowHash = {}
            rowHash['weekday'] = dayOfWeek;
            rowHash['userFirstName'] = 'Open'
            rowHash['userLastName'] = 'Shifts'
            rowHash['userAvatar'] = '/assets/Icons/search.png'
            if (calendarHash['Open Shifts']) {
              calendarHash['Open Shifts'] = [...calendarHash['Open Shifts'], Object.assign(rowHash, value.node)]
            } else {
              calendarHash['Open Shifts'] = [Object.assign(rowHash, value.node)]
            }
          }
          assigned.map((v) => {
            const rowHash = {}
            rowHash['weekday'] = dayOfWeek;
            const userName = userHash[v];
            rowHash['userFirstName'] = userHash[v][0]
            rowHash['userLastName'] = userHash[v][1]
            rowHash['userAvatar'] = userHash[v][2]
            if (calendarHash[userName]) {
              calendarHash[userName] = [...calendarHash[userName], Object.assign(rowHash, value.node)]
            } else {
              calendarHash[userName] = [Object.assign(rowHash, value.node)];
            }
          })
        }
      });
    }




    recurring.unappliedRecurring.edges.map((value, index) => {
        let workplaceName = value.node.workplaceByWorkplaceId.workplaceName
        if (workplaceId != '') {
        if (workplaceId == value.node.workplaceByWorkplaceId.id) {
            value.node.recurringShiftsByRecurringId.edges.map((shift, shiftIndex) => {
                if(moment(start).isBefore(moment(shift.node.expiration))) {
                    const positionName = shift.node.positionByPositionId.positionName;
                        let assigned = []
                        shift.node.recurringShiftAssigneesByRecurringShiftId.edges.map((assignees, aIndex) => {
                            assigned.push(assignees.node.userId)
                        })

                        if (assigned.length < shift.node.workerCount) {
                          const rowHash = {};
                          rowHash['workplaceByWorkplaceId'] = {'workplaceName': workplaceName}
                          rowHash['userFirstName'] = 'Open'
                          rowHash['userLastName'] = 'Shifts'
                          rowHash['userAvatar'] = '/assets/Icons/search.png'
                          if (calendarHash['Open Shifts']) {
                            calendarHash['Open Shifts'] = [...calendarHash['Open Shifts'], Object.assign(rowHash, shift.node)]
                          } else {
                            calendarHash['Open Shifts'] = [Object.assign(rowHash, shift.node)]
                          }
                        }
                        assigned.map((v) => {
                          const rowHash = {}
                          rowHash['workplaceByWorkplaceId'] = {'workplaceName': workplaceName}
                          const userName = userHash[v];
                          rowHash['userFirstName'] = userHash[v][0]
                          rowHash['userLastName'] = userHash[v][1]
                          rowHash['userAvatar'] = userHash[v][2]
                          if (calendarHash[userName]) {
                            calendarHash[userName] = [...calendarHash[userName], Object.assign(rowHash, shift.node)]
                          } else {
                            calendarHash[userName] = [Object.assign(rowHash, shift.node)];
                          }
                        })
            }
          })
          }
        } else {
            value.node.recurringShiftsByRecurringId.edges.map((shift, shiftIndex) => {
                if(moment(start).isBefore(moment(shift.node.expiration))) {
                    const positionName = shift.node.positionByPositionId.positionName;
                        let assigned = []
                        shift.node.recurringShiftAssigneesByRecurringShiftId.edges.map((assignees, aIndex) => {
                            assigned.push(assignees.node.userId)
                        })

                        if (assigned.length < shift.node.workerCount) {
                          const rowHash = {};
                          rowHash['workplaceByWorkplaceId'] = {'workplaceName': workplaceName}
                          rowHash['userFirstName'] = 'Open'
                          rowHash['userLastName'] = 'Shifts'
                          rowHash['userAvatar'] = '/assets/Icons/search.png'
                          if (calendarHash['Open Shifts']) {
                            calendarHash['Open Shifts'] = [...calendarHash['Open Shifts'], Object.assign(rowHash, shift.node)]
                          } else {
                            calendarHash['Open Shifts'] = [Object.assign(rowHash, shift.node)]
                          }
                        }
                        assigned.map((v) => {
                          const rowHash = {}
                          rowHash['workplaceByWorkplaceId'] = {'workplaceName': workplaceName}
                          const userName = userHash[v];
                          rowHash['userFirstName'] = userHash[v][0]
                          rowHash['userLastName'] = userHash[v][1]
                          rowHash['userAvatar'] = userHash[v][2]
                          if (calendarHash[userName]) {
                            calendarHash[userName] = [...calendarHash[userName], Object.assign(rowHash, shift.node)]
                          } else {
                            calendarHash[userName] = [Object.assign(rowHash, shift.node)];
                          }
                        })
            }
          })
        }
     })

    return calendarHash;
  };

  getDataJobView = (workplaceId, data, recurring, start) => {
    let calendarHash = {};
    data.allShifts.edges.map((value, index) => {
      if (workplaceId != '') {
        if (workplaceId == value.node.workplaceByWorkplaceId.id) {
          const positionName = value.node.positionByPositionId.positionName;
          const dayOfWeek = moment(value.node.startTime).format('dddd');
          const rowHash = {};
          rowHash['weekday'] = dayOfWeek;
          if (calendarHash[positionName]) {
            calendarHash[positionName] = [...calendarHash[positionName], Object.assign(rowHash, value.node)]
          } else {
            calendarHash[positionName] = [Object.assign(rowHash, value.node)];
          }
        }
      }
      else {
        const positionName = value.node.positionByPositionId.positionName;
        const dayOfWeek = moment(value.node.startTime).format('dddd');
        const rowHash = {};
        rowHash['weekday'] = dayOfWeek.toUpperCase();
        if (calendarHash[positionName]) {
          calendarHash[positionName] = [...calendarHash[positionName], Object.assign(rowHash, value.node)]
        } else {
          calendarHash[positionName] = [Object.assign(rowHash, value.node)];
        }
      }
    });

    recurring.unappliedRecurring.edges.map((value, index) => {
          let workplaceName = value.node.workplaceByWorkplaceId.workplaceName
           if (workplaceId != '') {
             if (workplaceId == value.node.workplaceByWorkplaceId.id) {
              value.node.recurringShiftsByRecurringId.edges.map((shift, shiftIndex) => {
                if(moment(start).isBefore(moment(shift.node.expiration))) {
                  const positionName = shift.node.positionByPositionId.positionName;
                       const rowHash = {};
                       rowHash['workplaceByWorkplaceId'] = {'workplaceName': workplaceName}
                       rowHash['workersAssigned'] = []
                       shift.node.recurringShiftAssigneesByRecurringShiftId.edges.map((assignees, aIndex) => {
                            rowHash['workersAssigned'].push(assignees.node.userId)
                       })
                       if (calendarHash[positionName]) {
                          calendarHash[positionName] = [...calendarHash[positionName], Object.assign(rowHash, shift.node)]
                       } else {
                        calendarHash[positionName] = [Object.assign(rowHash, shift.node)];
                       }
                }
              })
            }
            } else {
              value.node.recurringShiftsByRecurringId.edges.map((shift, shiftIndex) => {
                if(moment(start).isBefore(moment(shift.node.expiration))) {
                  const positionName = shift.node.positionByPositionId.positionName;
                       const rowHash = {};
                       rowHash['workplaceByWorkplaceId'] = {'workplaceName': workplaceName}
                       rowHash['workersAssigned'] = []
                       shift.node.recurringShiftAssigneesByRecurringShiftId.edges.map((assignees, aIndex) => {
                            rowHash['workersAssigned'].push(assignees.node.userId)
                       })
                       if (calendarHash[positionName]) {
                          calendarHash[positionName] = [...calendarHash[positionName], Object.assign(rowHash, shift.node)]
                       } else {
                        calendarHash[positionName] = [Object.assign(rowHash, shift.node)];
                       }
                }
              })
            }
    })
    return calendarHash;
  };

  render() {
    if (this.props.data.loading || this.props.allUsers.loading || this.props.unappliedRecurring.loading) {
      return (<div><Halogen.SyncLoader color='#00A863'/></div>)
    }

    let { date } = this.props;
    let { start } = ShiftWeekTable.range(date, this.props);
    const TableRowHeader = ( <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
      <TableRow displayBorder={false}>
        <TableRowColumn style={styles.tableFooter} className="dayname"><p
          className="weekDay"> {moment(start).day(0).format('dddd')}</p><p
          className="weekDate">{moment(start).day(0).format('D')}</p></TableRowColumn>
        <TableRowColumn style={styles.tableFooter} className="dayname"><p
          className="weekDay"> {moment(start).day(1).format('dddd')} </p>
          <p className="weekDate">{moment(start).day(1).format('D')}</p></TableRowColumn>
        <TableRowColumn style={styles.tableFooter} className="dayname"><p
          className="weekDay"> {moment(start).day(2).format('dddd')} </p>
          <p className="weekDate">  {moment(start).day(2).format('D')}</p></TableRowColumn>
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

    let workplaceId = localStorage.getItem('workplaceId');
    let { data } = this.props;
    let recurring = this.props.unappliedRecurring
    //let recurring = "hello"
    let jobData = this.state.calendarView == 'job' ? this.getDataJobView(workplaceId, data, recurring, start) : this.getDataEmployeeView(workplaceId, data, this.props.allUsers, recurring, start);
    let jobDataKeys = Object.keys(jobData)
    let openShiftIndex = jobDataKeys.indexOf('Open Shifts')
    if (openShiftIndex > -1) {
      jobDataKeys.splice(openShiftIndex, 1);
    }
    let jobs = [];
    (Object.keys(jobData)).forEach((jobType, index) => {
      jobs = concat(jobs, jobData[jobType])
    });
    let sortedData = jobs.map((job) => ({ ...job, startDate: new Date(job.startTime).getUTCDate() }));
    let groupedData = groupBy(sortedData, 'startDate');
    let summary = {};
    let weeklyHoursTotal = 0;
    let weeklyHoursBooked = 0;
    let weeklyTotalHoursBooked = 0;
      // calculating total hours
      if (this.state.calendarView == 'job') {
        Object.keys(groupedData).forEach((shift, index) => {
          let totalHours = 0;
          let totalBookedHours = 0;
          let shiftData = groupedData[shift];
          Object.keys(shiftData).forEach((data, index) => {
            let startTime = moment(shiftData[data]['startTime']).format('hh:mm A');
            let endTime = moment(shiftData[data]['endTime']).format('hh:mm A');
            let workerAssigned = shiftData[data]['workersAssigned'] && shiftData[data]['workersAssigned'].length;
            let workerInvited = shiftData[data]['workersInvited'] && shiftData[data]['workersInvited'].length
            let shiftHours = parseInt(moment.utc(moment(endTime, 'hh:mm A').diff(moment(startTime, 'hh:mm A'))).format('H'));
            let openShift = shiftData[data]['workersRequestedNum'] - ( workerAssigned + workerInvited );
            let openShiftTotal = shiftHours * openShift;
            let workersAssignedTotal = shiftHours * (workerAssigned);
            let workersInvitedTotal = shiftHours * (workerInvited);
            let workerShiftHours = openShiftTotal + workersAssignedTotal + workersInvitedTotal;
            totalHours += parseInt(workerShiftHours);
            totalBookedHours += workersAssignedTotal;
          });
          summary[shift] = { 'totalHours': totalHours, 'totalBookedHours': totalBookedHours };
          weeklyHoursTotal += totalHours;
          weeklyHoursBooked += totalBookedHours;
        });
        weeklyTotalHoursBooked = Math.round((weeklyHoursBooked * 100) / weeklyHoursTotal) || 0;
      } else {
        Object.keys(groupedData).forEach((shift, index) => {
          let totalHours = 0;
          let totalBookedHours = 0;
          let shiftData = groupedData[shift];
          Object.keys(shiftData).forEach((data, index) => {
            let startTime = moment(shiftData[data]['startTime']).format('hh:mm A');
            let endTime = moment(shiftData[data]['endTime']).format('hh:mm A');
            let shiftHours = parseInt(moment.utc(moment(endTime, 'hh:mm A').diff(moment(startTime, 'hh:mm A'))).format('H'));
            if (shiftData[data]['userFirstName'] == 'Open' && shiftData[data]['userLastName'] == 'Shifts') {
              let workerAssigned = shiftData[data]['workersAssigned'] && shiftData[data]['workersAssigned'].length;
              let workerInvited = shiftData[data]['workersInvited'] && shiftData[data]['workersInvited'].length
              let openShift = shiftData[data]['workersRequestedNum'] - ( workerAssigned + workerInvited )
              totalHours += shiftHours * openShift;
            } else {
              totalHours += shiftHours;
              totalBookedHours += shiftHours;
            }
          });
          summary[shift] = { 'totalHours': totalHours, 'totalBookedHours': totalBookedHours };
          weeklyHoursTotal += totalHours;
          weeklyHoursBooked += totalBookedHours;
        });
        weeklyTotalHoursBooked = Math.round((weeklyHoursBooked * 100) / weeklyHoursTotal) || 0;
      }

      let is_publish = true;
      const reducer = combineReducers({ form: formReducer, shifts: shiftReducer });
      const store = createStore(reducer, { shifts: [] });
      let unsubscribe = store.subscribe(() =>
        console.log(store.getState())
      );
    return (
      <Provider store={store}>
        <div className="table-responsive">
          <Table bodyStyle={styles.bodyStyle} wrapperStyle={styles.wrapperStyle} footerStyle={styles.footerStyle}
                 fixedFooter={true} fixedHeader={true} width="100%" minHeight="100px"
                 className="table atable emp_view_table" style={styles.root}>
            <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
              <TableRow displayBorder={false} style={styles.heightremove}>
                <TableRowColumn style={styles.tableFooter} className="long dayname">
                  {/*<div><p className="weekDay">Hours Booked</p>
                    <p className="hoursWorked">{weeklyTotalHoursBooked || 0}%</p></div>*/}
                  <div className="calendar-emp-job-btn">
                    <div className="cal-emp-job-btn">
                      <button className="cal-emp-btn active">Employee view</button>
                      <button className="cal-emp-btn">Job view</button>
                    </div>
                  </div>
                </TableRowColumn>
                <TableRowColumn style={styles.tableFooter} className="dayname"><p
                  className="weekDate"> {moment(start).day(0).format('ddd')} {moment(start).day(0).format('MM')}/{moment(start).day(0).format('D')}</p></TableRowColumn>
                <TableRowColumn style={styles.tableFooter} className="dayname">
                  <p className="weekDate">{moment(start).day(1).format('ddd')} {moment(start).day(1).format('MM')}/{moment(start).day(1).format('D')}</p></TableRowColumn>
                <TableRowColumn style={styles.tableFooter} className="dayname"><p
                  className="weekDate"> {moment(start).day(2).format('ddd')} {moment(start).day(2).format('MM')}/{moment(start).day(2).format('D')}</p></TableRowColumn>
                <TableRowColumn style={styles.tableFooter} className="dayname"><p
                  className="weekDate"> {moment(start).day(3).format('ddd')} {moment(start).day(3).format('MM')}/{moment(start).day(3).format('D')}</p></TableRowColumn>
                <TableRowColumn style={styles.tableFooter} className="dayname"><p
                  className="weekDate">{moment(start).day(4).format('ddd')} {moment(start).day(4).format('MM')}/{moment(start).day(4).format('D')}</p></TableRowColumn>
                <TableRowColumn style={styles.tableFooter} className="dayname"><p
                  className="weekDate">{moment(start).day(5).format('ddd')} {moment(start).day(5).format('MM')}/{moment(start).day(5).format('D')}</p></TableRowColumn>
                <TableRowColumn style={styles.tableFooter} className="dayname"><p
                  className="weekDate">{moment(start).day(6).format('ddd')} {moment(start).day(6).format('MM')}/{moment(start).day(6).format('D')}</p></TableRowColumn>
              </TableRow>
            </TableHeader>
            <TableBody>
              <SpecialDay dateStart={start} setSpecialDay={this.getSpecialDay} />

              {jobDataKeys.map((value, index) => (
                  <JobsRow
                    data={jobData[value]}
                    key={value}
                    users={this.props.allUsers}
                    view={this.state.calendarView}/>
                )
              )
              }

              {jobData['Open Shifts'] &&
              <JobsRow
                data={jobData['Open Shifts']}
                key={'Open Shifts'}
                users={this.props.allUsers}
                view={this.state.calendarView}/>
              }
            </TableBody>
            <TableFooter adjustForCheckbox={false}>
              <TableRow displayBorder={false}>
                <TableRowColumn style={styles.tableFooterHeading}>
                  <div className="mtitle computed-weekly-scheduled-hour "><p className="bfont">weekly
                    hours booked:</p><p className="sfont">{weeklyHoursBooked} of {weeklyHoursTotal}
                    | {weeklyTotalHoursBooked}%</p></div>
                </TableRowColumn>
                {this.getSummary(summary, start)}
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


const unappliedRecurring = gql`
  query unappliedRecurring ($brandId: Uuid!, $lastApplied: Datetime!) {
    unappliedRecurring( brand: $brandId, lastApplied: $lastApplied ){
      edges{
        node{
          id
          workplaceByWorkplaceId{
            id
            workplaceName
          }
          recurringShiftsByRecurringId(condition: {expired: false}){
            edges{
              node{
                startTime
                endTime
                workerCount
                isTraineeShift
                unpaidBreakTime
                instructions
                days
                expiration
                positionByPositionId{
                  id
                  positionName
                  positionIconUrl
                  brandByBrandId {
                    id
                    brandName
                  }
                }
                recurringShiftAssigneesByRecurringShiftId {
                  edges{
                    node{
                      userId
                    }
                  }
                }
              }
            }
          }
        }
      }
      }
}`

const allUsers = gql`
  query allUsers {
    allUsers {
      edges {
        node {
          id
          firstName
          lastName
          avatarUrl
        }
      }
    }
  }`;
///
const ShiftWeekTable = compose(
  graphql(allShiftsByWeeksPublished, {
    options: (ownProps) => ({
      variables: {
        publishId: ownProps.events.publish_id || '00000000-0000-0000-0000-000000000000'
      }
    })
  }),
  graphql( unappliedRecurring, {
    options: (ownProps) => ({
      variables: {
        brandId: localStorage.getItem('brandId'),
        lastApplied: moment(ownProps.date).startOf('week')
      }
    }),
    name: 'unappliedRecurring'

  }),
  graphql(allUsers, { name: 'allUsers' })
)(ShiftWeekTableComponent);

export default ShiftWeekTable
