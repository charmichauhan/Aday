import React, { Component } from 'react'
import { Image, Button } from 'semantic-ui-react'

import "./team.css"

export default class TeamMemberCard extends Component {
	render() {
		const {
			user,
			cover = "https://2.bp.blogspot.com/-RmPp8EvzMZU/UcbaIb0UhbI/AAAAAAAAQEM/AMYS91zqhjc/s1600/watermarked_cover666.jpg",
			avatar = "http://www.finearttips.com/wp-content/uploads/2010/05/avatar.jpg",
			workplace,
			certificates,
			shifts
		} = this.props.member
		return (
			<div className="member-card">
				<div className="cover">
					<Image src={cover}/>
				</div>
				<div className="profile-picture">
					<Image shape="circular" size="tiny" src={avatar}/>
				</div>
				{user.name}<br/>
				<small>{workplace.name}</small>
				<br/>
				<Button size="mini">VIEW PROFILE </Button>
				<br/>
				{certificates} CERTIFICATES | {shifts} SHIFTS
			</div>
		);
	}
}
