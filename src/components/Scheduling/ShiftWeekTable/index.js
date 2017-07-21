import React,{Component} from 'react';

import { Provider } from 'react-redux';
import { createStore, combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import {Table, TableBody, TableHeader, TableFooter, TableRow, TableRowColumn} from "material-ui/Table";
import HoursBooked from "./HoursBooked";
import moment from 'moment';
import Week from 'react-big-calendar/lib/Week';
import dates from 'react-big-calendar/lib/utils/dates';
import localizer from 'react-big-calendar/lib/localizer';
import JobsRow from './JobsRow';
import SpecialDay from "./SpecialDay";
import { gql,graphql } from 'react-apollo';
import jobsData from "./jobs.json";
import '../style.css';


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
    }
};

export default class ShiftWeekTable extends Week {
    render() {
        // if (this.props.data.loading) {
        //     return (<div>Loading</div>)
        // }
        //
        // if (this.props.data.error) {
        //     console.log(this.props.data.error)
        //     return (<div>An unexpected error occurred</div>)
        // }
        let jobData = jobsData;
        let { date } = this.props;
        let { start } = ShiftWeekTable.range(date, this.props);
        let is_publish = true;
        const reducer = combineReducers ({ form: formReducer, shifts: shiftReducer});
        const store = createStore(reducer, {shifts: []});
        let unsubscribe = store.subscribe(() =>
            console.log(store.getState())
        );
        return (
            <Provider store={store}>
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
            </Provider>
        );
    }
}

ShiftWeekTable.range = (date, { culture }) => {
    let firstOfWeek = localizer.startOfWeek(culture);
    let start = dates.startOf(date, 'week', firstOfWeek);
    let end = dates.endOf(date, 'week', firstOfWeek);
    return { start, end };
};

// const allShifts = gql`
//   query allShifts($brandid: Uuid!, $daystart: Datetime!, $dayend: Datetime!)
//     { brandShiftByDate(brandid: $brandid, daystart: $daystart, dayend: $dayend){
//         edges {
//           node {
//             id
//             startTime
//             endTime
//             workersAssigned
//             workersInvited
//             workersRequestedNum
//             positionByPositionId{
//                 positionName
//                 brandByBrandId {
//                   brandName
//                 }
//              }
//           }
//         }
//     }
//   }
// `
// const allData = graphql(allShifts, {
//     options: (ownProps) => ({
//         variables: {
//             brandid: "5a14782b-c220-4927-b059-f4f22d01c230",
//             daystart: "2017-07-07",
//             dayend: "2017-07-24"
//         }
//     })
// });
// export default graphql(allShifts)(ShiftData);
// const data = graphql(allData)(ShiftWeekTable);
// @graphql(MyQuery)
// @graphql(MyMutation)
// graphql(data)
// const MyComponentData = data(ShiftWeekTable);