import React, {Component} from "react";
import moment from "moment";
import Week from "react-big-calendar/lib/Week";
import dates from "react-big-calendar/lib/utils/dates";
import localizer from "react-big-calendar/lib/localizer";
import SpecialDay from './SpecialDay';
import JobsRow from "./JobsRow";
import jobsData from "./jobs.json";
import {BrowserRouter as Router,Redirect} from 'react-router-dom';
import Modal from '../../helpers/Modal';
import CircleButton from '../../helpers/CircleButton';
import "../../Scheduling/style.css";
import { gql, graphql,compose } from 'react-apollo';
import uuidv1 from 'uuid/v1';
import {Table, TableBody, TableHeader, TableFooter, TableRow, TableRowColumn} from "material-ui/Table";
import {allTemplateShifts, allUsers} from '../TemplateQueries';
var Halogen = require('halogen');
var rp = require('request-promise');

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
        marginBottom: 10,
        maxWidth: 1750,
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
        bottom:10,
        width: 'calc(100% - 290px)',
        boxShadow:'0 1px 2px 0 rgba(74, 74, 74, 0.5)'
    }
};

class ShiftWeekTableComponent extends Week {
    constructor(props){
        super(props);
        this.state={
            deleteTemplateModal:false,
            view:this.props.eventPropGetter(),
            redirect:false,
            confirmApplyTemplateModal: false,
            applyingTemplateModal: false
        };
    }

    static propTypes = {
        createWeekPublished: React.PropTypes.func.isRequired
    }

    componentWillReceiveProps = () => {
      this.setState({view:this.props.eventPropGetter()});
    };
    modalClose = () => {
        this.setState({
            deleteTemplateModal:false,
            applyingTemplateModal: false,
            confirmApplyTemplateModal: false
        });
    };
    backToCalendarView = () => {
      this.setState({redirect:true});
    }

  getTemplateDataEmployee = (workplaceId, allUsers, recurring) => {
    let userHash = {};
    let calendarHash = {};
    if (allUsers && allUsers.allUsers) {
      allUsers.allUsers.edges.map((value, index) => {
        userHash[value.node.id] = [value.node.firstName, value.node.lastName, value.node.avatarUrl]
      });
    } 

    recurring.edges.map((value, index) => {
        let workplaceName = value.node.workplaceByWorkplaceId.workplaceName
        if (workplaceId != '') {
          if (workplaceId == value.node.workplaceByWorkplaceId.id) {
              value.node.recurringShiftsByRecurringId.edges.map((shift, shiftIndex) => {
                      const positionName = shift.node.positionByPositionId.positionName;
                      shift.node.days.map((day, dayIndex) => {    
                          let assigned = []
                          shift.node.recurringShiftAssigneesByRecurringShiftId.edges.map((assignees, aIndex) => {
                              assigned.push(assignees.node.userId)
                          })
                          
                          if (assigned.length < shift.node.workerCount) {
                            const rowHash = {};
                            rowHash['weekday'] = day
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
                            rowHash['weekday'] = day;
                            const userName = userHash[v];
                            rowHash['workplaceByWorkplaceId'] = {'workplaceName': workplaceName}
                            rowHash['userFirstName'] = userHash[v][0]
                            rowHash['userLastName'] = userHash[v][1]
                            rowHash['userAvatar'] = userHash[v][2]
                            if (calendarHash[userName]) {
                              calendarHash[userName] = [...calendarHash[userName], Object.assign(rowHash, shift.node)]
                            } else {
                              calendarHash[userName] = [Object.assign(rowHash, shift.node)];
                            }
                          })
                })
              })
            }
        } 
     })

    return calendarHash;
  };

    getTemplateDataJob = (workplaceId, recurring) => {
      let calendarHash = {};

      recurring.edges.map((value, index) => {
            let workplaceName = value.node.workplaceByWorkplaceId.workplaceName
            console.log(workplaceId)
            console.log(value.node.workplaceByWorkplaceId.id)
             if (workplaceId != '') {
               if (workplaceId == value.node.workplaceByWorkplaceId.id) {
                value.node.recurringShiftsByRecurringId.edges.map((shift, shiftIndex) => {
                  const positionName = shift.node.positionByPositionId.positionName;
                  shift.node.days.map((day, dayIndex) => {    
                       const rowHash = {};
                       rowHash['weekday'] = day
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
                 })
                })
              }
              } 
      })
      return calendarHash;
    };

    render() {
         if (this.props.events[1] == "") {
           if (this.props.data.error) {}
           return (<div>  No Template Selected</div>)
         }
         if (this.props.data.loading || this.props.allUsers.loading) {
             return (<div><Halogen.SyncLoader color='#00A863'/></div>)
         }
         if (this.props.data.error) {
             console.log(this.props.data.error)
             return (<div> Must Select A Workplace </div>)
        }

        console.log(this.props)
        let recurring = this.props.data.allRecurrings
        let workplaceId = localStorage.getItem('workplaceId');
        let jobData = this.state.view=="job" ? this.getTemplateDataJob(workplaceId, recurring) :this.getTemplateDataEmployee(workplaceId, this.props.allUsers, recurring);
        let jobDataKeys = Object.keys(jobData)
        let openShiftIndex = jobDataKeys.indexOf('Open Shifts')
        if (openShiftIndex > -1) {
          jobDataKeys.splice(openShiftIndex, 1);
        }

        let {date} = this.props;
        let {start} = ShiftWeekTableComponent.range(date,this.props);
        let deleteTemplateAction =[{type:"white",title:"Cancel",handleClick:this.modalClose,image:false},
            {type:"red",title:"Delete Template",handleClick:this.deleteTemplate}];

        return (
          <div>
            <div className="table-responsive table-fixed-bottom-mrb">

                <Table bodyStyle={styles.bodyStyle} wrapperStyle={styles.wrapperStyle}
                       fixedFooter={true} fixedHeader={true} width="100%" minHeight="100px" footerStyle={styles.footerStyle}
                       className="table atable emp_view_table" style={styles.root}>
                    <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                        <TableRow displayBorder={false}>
                            <TableRowColumn style={styles.tableFooter} className="long dayname">
                              <div className="maintitle" style={{width: '100%', alignContent: 'left'}}>
            
                              </div>
                            </TableRowColumn>
                            <TableRowColumn style={styles.tableFooter} className="dayname"><p
                                className="weekDay"> {moment(start).day(0).format('dddd')} </p>
                            </TableRowColumn>
                            <TableRowColumn style={styles.tableFooter} className="dayname"><p
                                className="weekDay"> {moment(start).day(1).format('dddd')} </p>
                              </TableRowColumn>
                            <TableRowColumn style={styles.tableFooter} className="dayname"><p
                                className= "weekDay"> {moment(start).day(2).format('dddd')} </p>
                              </TableRowColumn>
                            <TableRowColumn style={styles.tableFooter} className="dayname"><p
                                className="weekDay"> {moment(start).day(3).format('dddd')} </p>
                              </TableRowColumn>
                            <TableRowColumn style={styles.tableFooter} className="dayname"><p
                                className="weekDay"> {moment(start).day(4).format('dddd')} </p>
                              </TableRowColumn>
                            <TableRowColumn style={styles.tableFooter} className="dayname"><p
                                className="weekDay"> {moment(start).day(5).format('dddd')} </p>
                              </TableRowColumn>
                            <TableRowColumn style={styles.tableFooter} className="dayname"><p
                                className="weekDay"> {moment(start).day(6).format('dddd')} </p>
                              </TableRowColumn>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <SpecialDay/>
                            { jobDataKeys.map((value, index) => (
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
                        <TableRow>
                            <TableRowColumn colSpan="8">
                                <div className="text-center">
                                    <CircleButton type="white" title="Back" handleClick={this.backToCalendarView}/>
                                </div>
                            </TableRowColumn>
                        </TableRow>
                    </TableFooter>
                </Table>
            </div>
          </div>
        );
    }
}


ShiftWeekTableComponent.range = (date, {culture}) => {
    let firstOfWeek = localizer.startOfWeek(culture);
    let start = dates.startOf(date, 'week', firstOfWeek);
    let end = dates.endOf(date, 'week', firstOfWeek);
    return {start, end};
};

const ShiftWeekTable = compose(
  graphql(allTemplateShifts, {
    options: (ownProps) => ({
      variables: {
        workplaceId:localStorage.getItem('workplaceId'),
        brandId: localStorage.getItem('brandId'),
      }
    })
  }),
  graphql(allUsers, {name: "allUsers"})
)(ShiftWeekTableComponent);

export default ShiftWeekTable;
