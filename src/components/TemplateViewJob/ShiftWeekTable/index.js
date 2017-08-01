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
import { gql, graphql, compose } from 'react-apollo';
import {Table, TableBody, TableHeader, TableFooter, TableRow, TableRowColumn} from "material-ui/Table";

const styles = {
    bodyStyle: {
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
        if (this.props.data.loading) {
            return (<div>Loading</div>)
        }

        if (this.props.data.error) {
            console.log(this.props.data.error)
            return (<div>An unexpected error occurred</div>)
        }

        let { date } = this.props;
        let { start } = ShiftWeekTable.range(date, this.props);

        let calendarHash = {};
        let userHash={};
        let weekPublished = "";

        if  (this.props.allUsers && this.props.allUsers.allUsers){
            this.props.allUsers.allUsers.edges.map((value,index) => {
                userHash[value.node.id] = [value.node.firstName, value.node.lastName, value.node.avatarUrl]
            });
            let workplace="";
            if (this.props.data.templateById){
                weekPublished = this.props.data.templateById.templateShiftsByTemplateId.edges;
                workplace = this.props.data.templateById.workplaceByWorkplaceId.workplaceName;
            }
            if(weekPublished){
                weekPublished.map((value, index) => {
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
        }

        let jobData = calendarHash;
        let deleteTemplateAction =[{type:"white",title:"Cancel",handleClick:this.modalClose,image:false},
            {type:"red",title:"Delete Shift",handleClick:this.deleteShift,image:true}];
        return (
            <div>
            <div className="table-responsive table-fixed-bottom-mrb">
                <Table bodyStyle={styles.bodyStyle} wrapperStyle={styles.wrapperStyle}
                       fixedFooter={true} fixedHeader={true} width="100%" minHeight="100px" footerStyle={styles.footerStyle}
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
                        {(Object.keys(jobData)).map((value, index) => (
                                <JobsRow data={jobData[value]} key={value}/>
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
                        <TableRow>
                            <TableRowColumn colSpan="8">
                            <div className="text-center">
                                <CircleButton type="white" title="Cancel" handleClick={this.handleDeleteTemplate}/>
                                <CircleButton type="red" title="delete template" handleClick={this.handleDeleteTemplate}/>
                                <CircleButton type="blue" title="apply template" handleClick={this.handleDeleteTemplate}/>
                            </div>
                            </TableRowColumn>
                        </TableRow>
                    </TableFooter>

                </Table>
            </div>
                {this.state.deleteTemplateModal && <Modal isOpen = {this.state.deleteTemplateModal} title="Confirm"
                                                     message = 'Are you sure that you want to delete the "Standard $5000 Sales Week" template?'
                                                     action = {deleteTemplateAction} 
                                                       closeAction={this.modalClose} />
                }

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
                id: "5a03282c-c220-4927-b059-f4f22d01c230",
            }
        }),
    }),
    graphql(allUsers, {name: "allUsers"})
)(ShiftWeekTableComponent);

export default ShiftWeekTable;