import React, { Component } from 'react';
import { Menu, Icon } from 'semantic-ui-react';
import { NavLink } from 'react-router-dom';
import EmergencyShiftButton from './KendallLearning/EmergencyShiftButton';

export default class Nav extends Component {
	render() {
		return (
			<div>
				<EmergencyShiftButton/>
				<Menu vertical fluid>
					<Menu.Item>
						<Menu.Header><Icon name="calendar"/> SCHEDULE</Menu.Header>
						<Menu.Menu>
							<Menu.Item as={NavLink} to="/schedule/team" name="team"/>
							<Menu.Item as={NavLink} to="/schedule/manager" name="manager"/>
						</Menu.Menu>
					</Menu.Item>
					<Menu.Item>
						<Menu.Header><Icon name="cubes"/> WORKPLACES</Menu.Header>
						<Menu.Menu>
							<Menu.Item as={NavLink} to="/workplaces/mine" name="my workplace"/>
							<Menu.Item as={NavLink} to="/workplaces/shared" name="shared workplaces"/>
						</Menu.Menu>
					</Menu.Item>
					<Menu.Item>
						<Menu.Header><Icon name="users"/> TEAM MEMBERS</Menu.Header>
						<Menu.Menu>
							<Menu.Item as={NavLink} to="/team/roster" name="roster"/>
							<Menu.Item as={NavLink} to="/team/policies" name="policies"/>
						</Menu.Menu>
					</Menu.Item>
					<Menu.Item>
						<Menu.Header><Icon name="certificate"/> CERTIFICATIONS</Menu.Header>
						<Menu.Menu>
							<Menu.Item as={NavLink} to="/certifications/certificates" name="certificates"/>
							<Menu.Item as={NavLink} to="/certifications/traning" name="training" disabled/>
						</Menu.Menu>
					</Menu.Item>
					<Menu.Item>
						<Menu.Header><Icon name="clock"/> TIME & ATTENDANCE</Menu.Header>
						<Menu.Menu>
							<Menu.Item as={NavLink} to="/attendance/requests" name="requests"/>
							<Menu.Item as={NavLink} to="/attendance/history" name="work history"/>
						</Menu.Menu>
					</Menu.Item>
					<Menu.Item>
						<Menu.Header><Icon name="trophy"/> REWARDS</Menu.Header>
						<Menu.Menu>
							<Menu.Item as={NavLink} to="/rewards/badges" name="badges"/>
							<Menu.Item as={NavLink} to="/rewards/awards" name="awards"/>
						</Menu.Menu>
					</Menu.Item>
					<Menu.Item>
						<Menu.Header><Icon name="calendar"/> HIRING</Menu.Header>
						<Menu.Menu>
							<Menu.Item as={NavLink} to="/hiring/opportunities" name="opportunities"/>
							<Menu.Item as={NavLink} to="/hiring/cadidates" name="cadidates"/>
						</Menu.Menu>
					</Menu.Item>
					<Menu.Item>
						<Menu.Header><Icon name="line chart"/> REPORTING</Menu.Header>
						<Menu.Menu>
							<Menu.Item as={NavLink} to="/schedule/team" name="analytics"/>
							<Menu.Item as={NavLink} to="/schedule/manager" name="reports"/>
						</Menu.Menu>
					</Menu.Item>
					<Menu.Item>
						<Menu.Header><Icon name="comment"/> NOTIFICATIONS</Menu.Header>
					</Menu.Item>
					<Menu.Item>
						<Menu.Header><Icon name="settings"/>POSITIONS</Menu.Header>
						<Menu.Menu>
							<Menu.Item as={NavLink} to="/positions/positions" name="positions"/>
						</Menu.Menu>
					</Menu.Item>
					<Menu.Item>
						<Menu.Header><Icon name="settings"/> SETTINGS</Menu.Header>
						<Menu.Menu>
							<Menu.Item as={NavLink} to="/settings/personal" name="personal"/>
							<Menu.Item as={NavLink} to="/settings/workplace" name="workplace"/>
							<Menu.Item as={NavLink} to="/settings/brand" name="brand"/>
							<Menu.Item as={NavLink} to="/settings/company" name="company"/>
						</Menu.Menu>
					</Menu.Item>
				</Menu>
			</div>
		);
	}
}
