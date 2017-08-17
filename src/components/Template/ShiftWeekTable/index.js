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
import {allTemplateShifts, allUsers, createWeekPublishedMutation,
        deleteTemplateMutation, allTemplates} from '../TemplateQueries';
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

    static propTypes = {
        createWeekPublished: React.PropTypes.func.isRequired
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
        that.setState({deleteTemplateModal:true});
    };
    deleteTemplate = () => {
        this.props.deleteTemplate({
          variables: { templateId : this.props.events[1] },
          refetchQueries: [{query: allTemplates}]}).then(this.props.events[3])
            .then(this.setState({deleteTemplateModal:false}));

    }

    handleApplyTemplate(start){
        const that = this;

        this.setState({
            applyingTemplateModal: true
        });

        let weekPublishedId = this.props.events[2]

        if(!weekPublishedId) {
         weekPublishedId = uuidv1();
         this.props.createWeekPublished({
                variables: { data:
                                {weekPublished:
                                   { id: weekPublishedId,
                                    start: moment(start).startOf('week').format(),
                                    end: moment(start).endOf('week').format(),
                                    published: false,
                                    brandId: localStorage.getItem('brandId') }
                            }}

            })
            .then(({ data }) => {

                var uri = 'https://20170808t142850-dot-forward-chess-157313.appspot.com/api/templateToShift'

                  var options = {
                      uri: uri,
                      method: 'POST',
                      json: {"data": {"template_id": this.props.events[1],
                                      "weekPublishedId": weekPublishedId ,
                                      "start": moment(start).startOf('week').format(),
                                      "end":   moment(start).endOf('week').format()
                                      }
                      }
                  };
                  rp(options)
                    .then(function(response) {
                        that.setState({
                          applyingTemplateModal: false
                        });
                       window.location.href = '/schedule/team';
                      }).catch((error) => {
                          console.log('there was an error sending the query', error);
                      });
            })

        } else {

                var uri = 'https://20170808t142850-dot-forward-chess-157313.appspot.com/api/templateToShift'
                var options = {
                      uri: uri,
                      method: 'POST',
                      json: {"data": {"template_id": this.props.events[1],
                                      "weekPublishedId": weekPublishedId ,
                                      "start": moment(start).startOf('week').format(),
                                      "end":   moment(start).endOf('week').format()
                                    }
                      }
                  };
                  rp(options)
                    .then(function(response) {
                        that.setState({
                          applyingTemplateModal: false
                        });
                       window.location.href = '/schedule/team';
                      }).catch((error) => {
                          console.log('there was an error sending the query', error);
                  });
        }
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
         if (this.props.events[1] == "") {
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
        let {start} = ShiftWeekTableComponent.range(date,this.props);
        let deleteTemplateAction =[{type:"white",title:"Cancel",handleClick:this.modalClose,image:false},
            {type:"red",title:"Delete Template",handleClick:this.deleteTemplate}];
        let applyTemplateAction =[{type:"white", title: "One Moment"}];
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
                                    <CircleButton type="blue" title="apply template" handleClick={(start) => this.handleApplyTemplate(this.props.date)}/>
                                </div>
                            </TableRowColumn>
                        </TableRow>
                    </TableFooter>
                </Table>
            </div>
                {this.state.deleteTemplateModal?<Modal isOpen = {this.state.deleteTemplateModal} title="Confirm"
                                                     message = {'Are you sure that you want to delete the \'' +
                                                                this.props.data.templateById.templateName + '\' template?'}
                                                     action = {deleteTemplateAction}
                                                       closeAction={this.modalClose} />
                    :""}
                {this.state.applyingTemplateModal ?
                  <Modal isOpen = {this.state.applyingTemplateModal} title=""
                      message="Please Wait While We Apply This Template"
                      action={applyTemplateAction}
                      closeAction={this.modalClose}
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

const ShiftWeekTable = compose(
  graphql(allTemplateShifts, {
    options: (ownProps) => ({
      variables: {
        id: ownProps.events[1],
      }
    }),
  }),
  graphql(allUsers, {name: "allUsers"}),
  graphql(createWeekPublishedMutation, {
    name : 'createWeekPublished'
  }),
  graphql(deleteTemplateMutation, {
    name : 'deleteTemplate'
  })
)(ShiftWeekTableComponent);

export default ShiftWeekTable;
