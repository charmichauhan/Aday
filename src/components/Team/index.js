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
  workplaceId:localStorage.getItem("workplaceId")
};

export default class Team extends Component {
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

  componentWillMount(){
    this.setState({workplaceId:localStorage.getItem("workplaceId")})
  }
  componentWillReceiveProps(){
    this.setState({workplaceId:localStorage.getItem("workplaceId")})
  }
	render() {
		return (
			<section className="team">

				<br/>
				<div className="col-md-12 page-title-rectangle">
						<div className="col-sm-offset-3 col-sm-5 rectangle page-title">
								TEAM MEMBERS
						</div>
				</div>
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
						<TeamMembers />
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
						<Managers workplaceId={this.state.workplaceId}/>
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
