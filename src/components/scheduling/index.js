import React, { Component } from 'react';
import $ from 'jquery'

import 'fullcalendar/dist/fullcalendar.css';
import 'fullcalendar/dist/fullcalendar.js';


class Calendar extends Component {

  componentDidMount(){
    const { calendar } = this.refs;

    $(calendar).fullCalendar({events: this.props.events, header: this.props.header});
  }

  render() {
    return (
      <div ref='calendar'></div>
    );
  }

}


export default class Schedule extends Component {
	render(){
		let events = [
			{
				start: '2017-05-12',
				end: '2017-01-17',
				rendering: 'background',
				color: '#00FF00'
			},
			{
				start: '2017-05-12',
				end: '2017-01-24',
				rendering: 'background',
				color: '#FF0000'
			},
		]
		let header = {
			left:   'prev,next',
			center: 'title',
			right:  'today, basicDay, basicWeek, month'
		}

		return (
			<div className="App">
				<Calendar events={events} header={header} />
			</div>
		);
	}
}
