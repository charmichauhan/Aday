import React, { Component } from 'react'
import TeamMemberCard from './../TeamMemberCard'
import { Image, Button, Icon, Card, Header, Rating } from 'semantic-ui-react'

const initialState = {
	//stub
};

export default class TeamMembers extends Component {
	constructor(props) {
		super(props);
		this.state = {
			...initialState,
			team_members: props.team_members
		};
	}

	handleDeleteClick = (event) => {
		event.preventDefault();
		console.log('Delete button clicked');
	};

	handleDrawerSubmit = (event) => {
		event.preventDefault();
		this.setState({ open: false });
	};

	closeDrawer = (event) => {
		event.preventDefault();
		this.setState({ open: false });
	};

	openBrandDrawer = (brand) => {
		this.setState({ open: true, drawerBrand: brand });
	};

	render() {
		return (
			<div>
				<br/><br/>
				<Card.Group itemsPerRow="5">
					{
						this.state.team_members.map((m, i)=> <TeamMemberCard key={i} member={m}/>)
					}
				</Card.Group>
			</div>
		);
	}
}