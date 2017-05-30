import React, { Component } from 'react'
import { Menu, Segment, Accordion } from 'semantic-ui-react'

import TimeAttendanceTable from './TimeAttendanceTable'

export default class AttendanceRequests extends Component {
	state = { activeItem: 'openRequests' }
	handleItemClick = (e, { name }) => this.setState({ activeItem: name })
	render() {
		const {
			activeItem
		} = this.state

		const panels = [
			{
				title: "PERSONAL DAYS",
				content: <TimeAttendanceTable/>
			},
			{
				title: "VACATION",
				content: <TimeAttendanceTable/>
			},
			{
				title: "DROP SHIFTS",
				content: <TimeAttendanceTable/>
			},
			{
				title: "SWAP SHIFTS",
				content: <TimeAttendanceTable/>
			},
			{
				title: "TRAINING REQUESTS",
				content: <TimeAttendanceTable/>
			}
		]
		return (
			<div>
				<Menu attached='top' tabular>
					<Menu.Item 
						name="openRequests" 
						active={activeItem === 'openRequests'}
						onClick={this.handleItemClick}/>
					<Menu.Item 
						name="approvedRequests" 
						active={activeItem === 'approvedRequests'}
						onClick={this.handleItemClick}/>
					<Menu.Item 
						name="deniedRequests" 
						active={activeItem === 'deniedRequests'}
						onClick={this.handleItemClick}/>
				</Menu>
				<Segment attached="bottom">
					{activeItem}
					<Accordion panels={panels} styled />
				</Segment>
			</div>
		);
	}
}
