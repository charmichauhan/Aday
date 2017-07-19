import React, { Component } from 'react';

import { Provider } from 'react-redux';
import { createStore, combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import ApolloClient, { createNetworkInterface } from 'apollo-client'

import moment from 'moment';
import Week from 'react-big-calendar/lib/Week';
import dates from 'react-big-calendar/lib/utils/dates';
import localizer from 'react-big-calendar/lib/localizer';
import JobsRow from './JobsRow';
import SpecialDay from "./SpecialDay";
import jobsData from "./jobs.json";
import '../style.css';


/*import EditShift from './ShiftEdit/Edit';
import DeleteShift from './ShiftEdit/DeleteShift';
*/
import AddNewShift from './ShiftEdit/AddNewShift';

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


export default class ShiftWeekTable extends Week {
   /*
    static propTypes = {
        data: React.PropTypes.shape({
          loading: React.PropTypes.bool,
          error: React.PropTypes.object,
        }).isRequired,
    }
    */
    render() {
            if (this.props.data.loading) {
                return (<div>Loading</div>)
            }

            if (this.props.data.error) {
                console.log(this.props.data.error)
                return (<div>An unexpected error occurred</div>)
            }

        let jobData = jobsData;
        let { date } = this.props;
        let { start } = ShiftWeekTable.range(date, this.props);
        let is_publish = true;
        const reducer = combineReducers ({ form: formReducer, shifts: shiftReducer});
        const store = createStore(reducer, {shifts: []});
        let unsubscribe = store.subscribe(() =>
            console.log(store.getState())
        )
        return (
            <Provider store={store}>
            <div className="table-responsive col-md-12">
                <AddNewShift/>
                <table className="table atable">
                    <thead className="thead_scroll">
                    <tr>
                        <th className="long dayname"> <p className="">Hours Booked</p><p className="hoursWorked">78%</p></th>
                        <th className="dayname"> <p className="weekDay"> {moment().day(0).format('dddd')}</p>
                            <p className="weekDate">{moment().day(0).format('D')}</p>
                        </th>
                        <th className="dayname"> <p className="weekDay"> {moment().day(1).format('dddd')} </p>
                            <p className="weekDate">{moment().day(1).format('D')}</p>
                        </th>
                        <th className="dayname"> <p className="weekDay"> {moment().day(2).format('dddd')} </p>
                            <p className="weekDate">  {moment().day(2).format('D')} </p>
                        </th>
                        <th className="dayname"> <p className="weekDay"> {moment().day(3).format('dddd')} </p>
                            <p className="weekDate"> {moment().day(3).format('D')} </p>
                        </th>
                        <th className="dayname"> <p className="weekDay"> {moment().day(4).format('dddd')} </p>
                            <p className="weekDate"> {moment().day(4).format('D')} </p>
                        </th>
                        <th className="dayname"> <p className="weekDay"> {moment().day(5).format('dddd')} </p>
                            <p className="weekDate"> {moment().day(5).format('D')} </p>
                        </th>
                        <th className="dayname"> <p className="weekDay"> {moment().day(6).format('dddd')} </p>
                            <p className="weekDate"> {moment().day(6).format('D')} </p>
                        </th>
                    </tr>
                    </thead>
                     <tbody className="tbody_scroll">
                    <SpecialDay dateStart={start}/>
                    {jobData.map((value,index)=>(
                            <JobsRow data={jobData[index]} key={index}/>
                        )
                    )
                    }
                    </tbody>
                </table>
                <div className="bottomtext">
                <table>
                    <tfoot className="textlist">
                    <tr>
                        <td ><div className="mtitle computed-weekly-scheduled-hour "><p className="bfont">weekly hours booked:</p><p className="sfont">185 of 236 | 78%</p></div></td>
                        <td ><div className="stitle computed-weekly-scheduled-hour"><p  className="bfont">hours booked</p><p className="sfont">185 of 236 | 78%</p></div></td>
                        <td ><div className="stitle computed-weekly-scheduled-hour"><p  className="bfont">hours booked</p><p className="sfont">185 of 236 | 78%</p></div></td>
                        <td ><div className="stitle computed-weekly-scheduled-hour"><p  className="bfont">hours booked</p><p className="sfont">185 of 236 | 78%</p></div></td>
                        <td ><div className="stitle computed-weekly-scheduled-hour"><p  className="bfont">hours booked</p><p className="sfont">185 of 236 | 78%</p></div></td>
                        <td ><div className="stitle computed-weekly-scheduled-hour"><p  className="bfont">hours booked</p><p className="sfont">185 of 236 | 78%</p></div></td>
                        <td ><div className="stitle computed-weekly-scheduled-hour"><p  className="bfont">hours booked</p><p className="sfont">185 of 236 | 78%</p></div></td>
                        <td ><div className="stitle computed-weekly-scheduled-hour"><p  className="bfont">hours booked</p><p className="sfont">185 of 236 | 78%</p></div></td>

                    </tr>
                    <tr>
                        <td ><div className="mtitle"><p className="bfont">weekly spend booked:</p><p className="sfont">$12038 of $18293 | 66%</p></div></td>
                        <td ><div className="stitle"><p  className="bfont">spend booked</p><p className="sfont">$1293 of $2019 | 64%</p></div></td>
                        <td ><div className="stitle"><p  className="bfont">spend booked</p><p className="sfont">185 of 236 | 78%</p></div></td>
                        <td ><div className="stitle"><p  className="bfont">spend booked</p><p className="sfont">185 of 236 | 78%</p></div></td>
                        <td ><div className="stitle"><p  className="bfont">spend booked</p><p className="sfont">185 of 236 | 78%</p></div></td>
                        <td ><div className="stitle"><p  className="bfont">spend booked</p><p className="sfont">185 of 236 | 78%</p></div></td>
                        <td ><div className="stitle"><p  className="bfont">spend booked</p><p className="sfont">185 of 236 | 78%</p></div></td>
                        <td ><div className="stitle"><p  className="bfont">spend booked</p><p className="sfont">185 of 236 | 78%</p></div></td>
                    </tr>
                    </tfoot>
                </table>
                </div>
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


const allShifts = gql
  'query allShifts($brandid: Uuid!, $daystart: Datetime!, $dayend: Datetime!){
    brandShiftByDate(brandid: $brandid, daystart: $daystart, dayend: $dayend){
        edges{
          node {
            id
            startTime
            endTime
            workersAssigned
            workersInvited
            workersRequestedNum
            positionByPositionId{
            positionName
            brandByBrandId {
                  brandName
             }
          }
        }
    }
  }
`

const ShiftWeekTable = graphql(allShifts)(ShiftWeekTableComponent)

export default ShiftWeekTable
