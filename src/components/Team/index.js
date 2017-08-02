import React, { Component } from 'react';
import { Tabs, Tab } from 'material-ui/Tabs';

import TeamMembers from './TeamMembers';
import InviteTeamMembers from './InviteTeamMembers';
import Managers from './Managers';
import InviteManagers from './InviteManagers';

import { Header, Button } from 'semantic-ui-react'

import { tabDesign } from '../styles';

import './team.css';

const styles = {
	tabDesign
};

const initState = {
	team_members: [
		{
			user: {
				first_name: "Alfredo",
				last_name: "Kelly",
				avatar_url: "https://s3.us-east-2.amazonaws.com/harvard-operations-pics/Operations/RA/alfredo-kelly.jpg",
				phone_number: "1-617-284-9232",
				email: "happygoluck@gmail.com"
			},
			position: 5,
		},
		{
			user: {
				first_name: "Alberto",
				last_name: "Sepulveda",
				avatar_url: "https://s3.us-east-2.amazonaws.com/harvard-operations-pics/Operations/RA/alberto-sepulueda.jpg",
				phone_number: "1-617-492-4220",
				email: "cashmeousside@gmail.com"
			},
			position: 5,
		},
		{
			user: {
				first_name: "Alexandre",
				last_name: "Oliveira",
				avatar_url: "https://s3.us-east-2.amazonaws.com/harvard-operations-pics/Operations/RA/alexandre-oliveira.jpg",
				phone_number: "1-617-392-9193",
				email: "oldskool@aol.com"
			},
			position: 5,
		},
		{
			user: {
				first_name: "Alipio",
				last_name: "Ospina",
				avatar_url: "https://s3.us-east-2.amazonaws.com/harvard-operations-pics/Operations/RA/alipio-ospina.jpg",
				phone_number: "1-617-329-8594",
				email: "yepthatsit392@gmail.com"
			},
			position: 5,
		},
		{
			user: {
				first_name: "Alvaro",
				last_name: "Gomez",
				avatar_url: "https://s3.us-east-2.amazonaws.com/harvard-operations-pics/Operations/RA/alvaro-gomez.jpg",
				phone_number: "1-805-940-5840",
				email: "disismylife@aol.com"
			},
			position: 5,
		},
		{
			user: {
				first_name: "Andreas",
				last_name: "Horava",
				avatar_url: "https://s3.us-east-2.amazonaws.com/harvard-operations-pics/Operations/RA/andreas-horava.jpg",
				phone_number: "1-617-303-9490",
				email: "pastryking@hotmail.com"
			},
			position: 5,
		},
	]
};

export default class team extends Component {
	constructor(props) {
		super(props);
		this.state = initState;
	}

	handleChange = (value) => {
		this.setState({	value: value });
	};

	getButtonStyle = (value) => ({
		...styles.tabDesign.buttonStyle,
		fontWeight: (this.state.value === value && 700) || 500
	});	

	render() {
		return (
			<section className="team">
				<br/>
				<center>
					<Button basic fluid active='false'>
					<Header as='h1'>Team Members</Header>
					</Button>
				</center>
				<br/>
				<Tabs
					value={this.state.value}
					onChange={this.handleChange}
					inkBarStyle={styles.tabDesign.inkBarStyle}
					tabItemContainerStyle={styles.tabDesign.tabItemContainerStyle}>

					<Tab
						buttonStyle={this.getButtonStyle('team_members')}
						label="Team Members"
						value="team_members">
						<TeamMembers team_members={this.state.team_members}/>
					</Tab>

					<Tab
						buttonStyle={this.getButtonStyle('invite_members')}
						label="Invite Team Members"
						value="invitations_team">
						<InviteTeamMembers />
					</Tab>

					<Tab						
						buttonStyle={this.getButtonStyle('managers')}
						label="Managers"
						value="managers">
						<Managers managers={this.state.team_members}/>
					</Tab>

					<Tab
						buttonStyle={this.getButtonStyle('invite_managers')}
						label="Invite Managers"
						value="invitations_managers">
						<InviteManagers/>
					</Tab>
				</Tabs>
			</section>
		)
	}
}