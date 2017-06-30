import React, { Component } from 'react';
import moment from 'moment';
import Week from 'react-big-calendar/lib/Week';
import dates from 'react-big-calendar/lib/utils/dates';
import localizer from 'react-big-calendar/lib/localizer';
import Bartender from '../../../../public/assets/Positions/bartender.png';
import Breakfast from '../../../../public/assets/Positions/breakfast.png';
import Cashier from '../../../../public/assets/Positions/cashier.png';
import Cleaning from '../../../../public/assets/Positions/cleaning.png';
import Door from '../../../../public/assets/Positions/door.png';
import Sandwich from '../../../../public/assets/Positions/sandwich.png';
import '../style.css';

export default class ShiftWeekTable extends Week {
    render() {
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
					<tr className="spday">
						<td></td>
						<td></td>
						<td>Labor Day</td>
						<td></td>
						<td></td>
						<td></td>
						<td></td>
						<td></td>
					</tr>
					<tr className="tableh">
						<td width="100%">
							<table className="" width="100%">
								<tbody>
								<tr>
									<td width="30%"><img src={Cashier} alt="img"/> </td>
									<td width="70%" className="penalheading">Cashier<p>0 hours</p></td>
								</tr>
								</tbody>
							</table>
						</td>
						<td></td>
						<td></td>
						<td></td>
						<td></td>
						<td></td>
						<td></td>
						<td></td>
					</tr>
					<tr className="tableh">
						<td width="100%">
							<table className="" width="100%">
								<tbody>
								<tr>
									<td width="30%"><img src={Cleaning} alt="img"/> </td>
									<td width="70%" className="penalheading">Deep Clean<p>0 hours</p></td>
								</tr>
								</tbody>
							</table>
						</td>
						<td></td>
						<td></td>
						<td></td>
						<td></td>
						<td></td>
						<td></td>
						<td></td>
					</tr>
					<tr className="tableh">
						<td width="100%">
							<table className="" width="100%">
								<tbody>
								<tr>
									<td width="30%"><img src={Door} alt="img"/> </td>
									<td width="70%" className="penalheading">Front Door<p>0 hours</p></td>
								</tr>
								</tbody>
							</table>
						</td>
						<td></td>
						<td></td>
						<td></td>
						<td></td>
						<td></td>
						<td></td>
						<td></td>
					</tr>
					<tr className="tableh">
						<td width="100%">
							<table className="" width="100%">
								<tbody>
								<tr>
									<td width="30%"><img src={Bartender} alt="img"/> </td>
									<td width="70%" className="penalheading">Bartender<p>0 hours</p></td>
								</tr>
								</tbody>
							</table>
						</td>
						<td></td>
						<td></td>
						<td></td>
						<td></td>
						<td></td>
						<td></td>
						<td></td>
					</tr>
					<tr className="tableh">
						<td width="100%">
							<table className="" width="100%">
								<tbody>
								<tr>
									<td width="30%"><img src={Sandwich} alt="img"/> </td>
									<td width="70%" className="penalheading">Sandwich<p>0 hours</p></td>
								</tr>
								</tbody>
							</table>
						</td>
						<td></td>
						<td></td>
						<td></td>
						<td></td>
						<td></td>
						<td></td>
						<td></td>
					</tr>
					<tr className="tableh">
						<td width="100%">
							<table className="" width="100%">
								<tbody>
								<tr>
									<td width="30%"><img src={Breakfast} alt="img"/> </td>
									<td width="70%" className="penalheading">Breakfast<p>0 hours</p></td>
								</tr>
								</tbody>
							</table>
						</td>
						<td></td>
						<td></td>
						<td></td>
						<td></td>
						<td></td>
						<td></td>
						<td></td>
					</tr>
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
