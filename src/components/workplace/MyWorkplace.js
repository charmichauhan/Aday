import React, { Component } from 'react';
import {Header, Divider, Grid, Label} from 'semantic-ui-react'

import Avatar from '../helpers/Avatar'
import WorkplaceMap from '../maps/Workplace'
import WorkingHours from './WorkingHours'
import WorkplaceReviews from './WorkplaceReviews'


export default class MyWorkplace extends Component {
	render() {
		return (
			<Grid className="workplace">
				<Grid.Column width={12}>
					<Header as="h2">RESTAURANT ASSOCIATES
						<Header.Subheader>
							CHAO CENTER
						</Header.Subheader>
					</Header>
					<div className="workplace-details">Catering Services</div>
					<WorkplaceMap/>
					<Divider/>
					<WorkplaceReviews/>
				</Grid.Column>
				<Grid.Column width={4}>
					<WorkingHours/>
					<Header as="h4">GENERAL MANAGER</Header>
					<Avatar
						first_name="JOSE"
						last_name="CORTEZ"
						type="avatar-verticle"
						size="tiny"
					/>
					<Header as="h4">ALL MANAGERs: <Label>3</Label></Header>
					<Avatar
						first_name="JOSE"
						last_name="CORTEZ"
						type="avatar-verticle"
						size="tiny"
					/>
					<Header as="h4">TEAM MEMBERS: <Label>212</Label></Header>
					<Avatar
						first_name="JOSE"
						last_name="CORTEZ"
						type="avatar-verticle"
						size="tiny"
					/>
					<Avatar
						first_name="JOSE"
						last_name="CORTEZ"
						type="avatar-verticle"
						size="tiny"
					/>
					<Avatar
						first_name="JOSE"
						last_name="CORTEZ"
						type="avatar-verticle"
						size="tiny"
					/>

				</Grid.Column>
			</Grid>
		);
	}
}
