import React, { Component } from 'react';
import moment from 'moment';
import Week from 'react-big-calendar/lib/Week';
import dates from 'react-big-calendar/lib/utils/dates';
import localizer from 'react-big-calendar/lib/localizer';
import JobsRow from './JobsRow';
import SpecialDay from "./SpecialDay";
import jobsData from "./jobs.json";
import '../style.css';

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
        return (
			<div className="col-md-12">
				<table className="table table-bordered atable">
					<tbody>
					<tr>
						<th className="long"></th>
                        <th>{days[1]}</th>
                        <th>{days[2]}</th>
                        <th>{days[3]}</th>
                        <th>{days[4]}</th>
                        <th>{days[5]}</th>
                        <th>{days[6]}</th>
                        <th>{days[7]}</th>
					</tr>
                    <SpecialDay dateStart={start}/>
					{jobData.map((value,index)=>(
						<JobsRow data={jobData[index]}/>
						)
					)
					}
					</tbody>
				</table>
			</div>
        );
    }
}

ShiftWeekTable.range = (date, { culture }) => {
    let firstOfWeek = localizer.startOfWeek(culture);
    let start = dates.startOf(date, 'week', firstOfWeek);
    let end = dates.endOf(date, 'week', firstOfWeek);
    return { start, end };
};
