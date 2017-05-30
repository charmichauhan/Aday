import React, { Component } from 'react';
import { Header } from 'semantic-ui-react'

export default class WorkingHours extends Component {
	constructor(){
		super()
		this.state = {
			workingHours : [
				{
					day: "Mon",
					begin: "08:00 AM",
					end: "09:00 PM"
				},
				{
					day: "Tue",
					begin: "08:00 AM",
					end: "09:00 PM"
				},
				{
					day: "Wed",
					begin: "08:00 AM",
					end: "09:00 PM"
				},
				{
					day: "Thur",
					begin: "08:00 AM",
					end: "09:00 PM"
				},
				{
					day: "Fri",
					begin: "08:00 AM",
					end: "09:00 PM"
				},
				{
					day: "Sat",
					begin: "08:00 AM",
					end: "09:00 PM"
				},
				{
					day: "Sun",
					begin: "08:00 AM",
					end: "09:00 PM"
				}
			]
		}
	}
	
	render() {
		console.log(this.state)
		return (
			<div className="working-hours">
				<Header as="h4">HOURS OF OPERATIONS</Header>
				{
					this.state.workingHours.map((h,i)=> <div key={i}><b>{h.day}</b> {h.begin} - {h.end}</div>)
				}
			</div>
		);
	}
}
