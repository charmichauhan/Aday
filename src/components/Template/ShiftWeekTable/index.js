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
        borderSpacing: '8px 8px'
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
    constructor(props){
        super(props);
        this.state={
            deleteTemplateModal:false,
            view:this.props.eventPropGetter(),
            redirect:false,
            applyingTemplateModal: false
        };
    }
    componentWillReceiveProps = () => {
      this.setState({view:this.props.eventPropGetter()});
    };
    modalClose = () => {
        this.setState({
            deleteTemplateModal:false,
            applyingTemplateModal: false
        });
    };
    handleDeleteTemplate = () => {
        let that =this;
        that.setState({deleteTemplateModal:true})
    };

    handleApplyTemplate = () => {
        this.setState({
            applyingTemplateModal: true
        });
        let that =this;       
        fetch('http://localhost:8080/templateToShift', { 
            method: 'GET',
            data: {
              template_id: '5a03282c-c220-4927-b059-f4f22d01c230'
            }
          })
          .then(function(response) {
            that.setState({
              applyingTemplateModal: false
            });
           window.location.href = '/schedule/team';
          })
    };
    backToCalendarView = () => {
      this.setState({redirect:true});
    }
    getTemplateDataJob = () => {
      let calendarHash = {};

      let templateShifts = "";

      let workplace="";
        if (this.props.data.templateById){
          templateShifts = this.props.data.templateById.templateShiftsByTemplateId.edges;
          workplace = this.props.data.templateById.workplaceByWorkplaceId.workplaceName;
        }
        if(templateShifts){
          templateShifts.map((value, index) => {
            const positionName = value.node.positionByPositionId.positionName;
            const dayOfWeek = value.node.dayOfWeek;

            const rowHash = {};
            rowHash["weekday"] = dayOfWeek;
            rowHash["workplace"] = workplace;
            if (calendarHash[positionName]) {
              calendarHash[positionName] = [...calendarHash[positionName], Object.assign(rowHash, value.node)]
            } else {
              calendarHash[positionName] = [Object.assign(rowHash, value.node)];
            }
          });
        }
      return calendarHash;
    }

    getTemplateDataEmployee = () => {
      let calendarHash = {};
      let userHash={};
      let workplace = "";
      if (this.props.data.templateById){
        workplace = this.props.data.templateById.workplaceByWorkplaceId.workplaceName;
      }

      if (this.props.data.templateById) {
        this.props.data.templateById.templateShiftsByTemplateId.edges.map((value,index) => {

          if (value.node.workerCount > value.node.templateShiftAssigneesByTemplateShiftId.edges.length){
            const rowHash = {};
            rowHash["user"] = ["Open", "Shifts"];
            rowHash["workplace"] = workplace;
            if (calendarHash["Open Shifts"]){
              calendarHash["Open Shifts"] = [...calendarHash["Open Shifts"],  Object.assign(rowHash, value.node)]
            } else {
              calendarHash["Open Shifts"] = [Object.assign(rowHash, value.node)]
            }
          }

          value.node.templateShiftAssigneesByTemplateShiftId.edges.map((value2,index2) => {
            const user = [value2.node.userByUserId.firstName, value2.node.userByUserId.lastName, value2.node.userByUserId.avatarUrl]
            const rowHash = {};
            rowHash["user"] = user;
            rowHash["workplace"] = workplace;
            if (calendarHash[user]){
              calendarHash[user] = [...calendarHash[user],  Object.assign(rowHash, value.node)]
            } else {
              calendarHash[user] = [Object.assign(rowHash, value.node)]
            }
          })
        });
      }
      return calendarHash;
    }

    render() {
         if (this.props.id == "") {
           if (this.props.data.error) {}
           return (<div>  No Template Selected</div>)
         }
         if (this.props.data.loading || this.props.allUsers.loading) {
             return (<div>Loading</div>)
         }
         if (this.props.data.error) {
             console.log(this.props.data.error)
             return (<div>  An unexpected error occurred </div>)
        }
        if(this.state.redirect){
          return (
            <Redirect to={{pathname:'/schedule/team' ,viewName:this.state.view}}/>
          )
        }
        let jobData = this.state.view=="job" ? this.getTemplateDataJob() :this.getTemplateDataEmployee();
        let {date} = this.props;
        let {start} = ShiftWeekTable.range(date,this.props);
        let deleteTemplateAction =[{type:"white",title:"Cancel",handleClick:this.modalClose,image:false},
            {type:"red",title:"Delete Shift",handleClick:this.deleteShift,image:"/images/modal/close.png"}];
        let applyTemplateAction =[{type:"white"}];
        return (
            <div>
            <div className="table-responsive table-fixed-bottom-mrb">
                <Table bodyStyle={styles.bodyStyle} wrapperStyle={styles.wrapperStyle}
                       fixedFooter={true} fixedHeader={true} width="100%" minHeight="100px" footerStyle={styles.footerStyle}
                       className="table atable emp_view_table" style={styles.root}>
                    <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                        <TableRow displayBorder={false}>
                            <TableRowColumn style={styles.tableFooter} className="long dayname"></TableRowColumn>
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
                        {Object.keys(jobData).map((value, index) => (
                                <JobsRow data={jobData[value]} key={index} view={this.state.view}/>
                                     )
                             )
                        }
                    </TableBody>
                    <TableFooter adjustForCheckbox={false}>
                        <TableRow>
                            <TableRowColumn colSpan="8">
                                <div className="text-center">
                                    <CircleButton type="white" title="Cancel" handleClick={this.backToCalendarView}/>
                                    <CircleButton type="red" title="delete template" handleClick={this.handleDeleteTemplate}/>
                                    <CircleButton type="blue" title="apply template" handleClick={this.handleApplyTemplate}/>
                                </div>
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
                {this.state.applyingTemplateModal ?
                  <Modal isOpen = {this.state.applyingTemplateModal} title="Please Wait"
                      message="Please Wait While We Apply This Template"
                      action={applyTemplateAction}
                      />
                    :""}
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


const allTemplateShifts = gql`
  query allTemplateShifts($id: Uuid!){
    templateById(id: $id) {
              id
              workplaceByWorkplaceId{
                workplaceName
              }
                templateShiftsByTemplateId{
                    edges{
                      node{
                        id
                        dayOfWeek
                        startTime
                        endTime
                        workerCount
                        positionByPositionId{
                            positionName
                        }
                        templateShiftAssigneesByTemplateShiftId{
                            edges{
                              node{
                                userByUserId {
                                  firstName
                                  lastName
                                  avatarUrl
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
  graphql(allTemplateShifts, {
    options: (ownProps) => ({
      variables: {
        id: ownProps.id,
      }
    }),
  }),
  graphql(allUsers, {name: "allUsers"})
)(ShiftWeekTableComponent);

export default ShiftWeekTable;
