import React, { Component } from 'react';
import { Grid, Image, Header } from 'semantic-ui-react'

export default class Features extends Component {
	render() {
		return (
			<div  className="aday-features">
			<Grid columns={3}>
				<Grid.Row>
					<Grid.Column>
						<Image src='/images/Icons_Briefcase.png' size="mini"/>
						<Header as="h4">Set Staff Hourly Limits</Header>
						<p>Set daily, weekly and monthly hourly limits for your 
						employees across one or more stores</p>
					</Grid.Column>
					<Grid.Column>
						<Image src='/images/Icons_Chat.png' size="mini"/>
						<Header as="h4">Internal Staff On-Demand</Header>
						<p>Send a text message and backfill a shift by skills of 
						your team members across one or more stores</p>
					</Grid.Column>
					<Grid.Column>
						<Image src='/images/Icons_Mail.png' size="mini"/>
						<Header as="h4">Staff Notifications</Header>
						<p>Notify your employees of inportant events,
						occurrences, and emergencies via the mobile application</p>
					</Grid.Column>
				</Grid.Row>
			</Grid>
			</div>
		);
	}
}
