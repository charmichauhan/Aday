import React, { Component } from 'react';

import { Provider } from 'react-redux';
import { createStore, combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';


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
            })
        default:
            return state
    }
}



export default class ShiftWeekTable extends Week {
    render() {

    	let jobData = jobsData;
        let { date } = this.props;
        let { start } = ShiftWeekTable.range(date, this.props);
        let days = [];
        let today = moment(start);
        for (let d = 1; d <= 7; d++) {
            days[d]=moment(today["_d"]).format('dddd, D');
            today=moment(today).add(1,'days');
        }


        const reducer = combineReducers ({ form: formReducer, shifts: shiftReducer});
        const store = createStore(reducer, {shifts: []});
        let unsubscribe = store.subscribe(() =>
          console.log(store.getState())
        )

        return (
            <Provider store={store}>
			<div className="col-md-12">

                {/*<DeleteShift/>*/}
                {/* <EditShift/>*/}

                <AddNewShift/>

				<table className="table table-bordered atable">
					<tbody>
					<tr>
						<th className="long"></th>
                        <th className="dayname" >{days[1]}</th>
                        <th className="dayname">{days[2]}</th>
                        <th className="dayname">{days[3]}</th>
                        <th className="dayname">{days[4]}</th>
                        <th className="dayname">{days[5]}</th>
                        <th className="dayname">{days[6]}</th>
                        <th className="dayname">{days[7]}</th>
					</tr>
                    <SpecialDay dateStart={start}/>
					{jobData.map((value,index)=>(
						<JobsRow data={jobData[index]} key={index}/>
						)
					)
					}
					</tbody>
				</table>
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
