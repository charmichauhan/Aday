import React, { Component } from 'react';
import moment from 'moment'

import $ from 'jquery'

$('#calendar').fullCalendar({
	schedulerLicenseKey: 'CC-Attribution-NonCommercial-NoDerivatives'
});

import 'fullcalendar/dist/fullcalendar.css';
import 'fullcalendar/dist/fullcalendar.js';
import 'fullcalendar-scheduler/dist/scheduler.css';
import 'fullcalendar-scheduler/dist/scheduler.js';


class Calendar extends Component {

  componentDidMount(){
    const { calendar } = this.refs;

    $(calendar).fullCalendar({
    	editable: true,
		aspectRatio: 1.5,
		scrollTime: '00:00',
    	defaultView: 'timelineDay',
    	events: this.props.events, 
    	header: this.props.header
    });
  }

  render() {
    return (
      <div ref='calendar'></div>
    );
  }

}


export default class Schedule extends Component {
	render(){
		var todayDate = moment().startOf('day');
		var YESTERDAY = todayDate.clone().subtract(1, 'day').format('YYYY-MM-DD');
		var TODAY = todayDate.format('YYYY-MM-DD');
		var TOMORROW = todayDate.clone().add(1, 'day').format('YYYY-MM-DD');
		let events = [
			{ id: '1', resourceId: 'b', start: TODAY + 'T02:00:00', end: TODAY + 'T07:00:00', title: 'event 1' },
			{ id: '2', resourceId: 'c', start: TODAY + 'T05:00:00', end: TODAY + 'T22:00:00', title: 'event 2' },
			{ id: '3', resourceId: 'd', start: YESTERDAY, end: TOMORROW, title: 'event 3' },
			{ id: '4', resourceId: 'e', start: TODAY + 'T03:00:00', end: TODAY + 'T08:00:00', title: 'event 4' },
			{ id: '5', resourceId: 'f', start: TODAY + 'T00:30:00', end: TODAY + 'T02:30:00', title: 'event 5' }
		]
		let header = {
			left:   'prev,next',
			center: 'title',
			right:  'today, timelineDay, timelineWeek, timelineMonth'
		}

		return (
			<div className="App">
				<Calendar events={events} header={header} />
			</div>
		);
	}
}
