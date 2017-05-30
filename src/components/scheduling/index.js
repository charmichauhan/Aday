import React, { Component } from 'react';
import BigCalendar from 'react-big-calendar'
import moment from 'moment'

import myEventsList from './sampleEvents'

import './styles.less'
import './prism.less'
BigCalendar.momentLocalizer(moment)

export default class Schedule extends Component {
	render() {
		console.log(myEventsList)
		return (
			<div>
				<BigCalendar
					events={myEventsList}
					startAccessor='startDate'
					endAccessor='endDate'
				/>
			</div>
		);
	}
}
