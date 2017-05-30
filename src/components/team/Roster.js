import React, { Component } from 'react'
import { Button, Search, Menu } from 'semantic-ui-react'

import TeamMemberCard from './TeamMemberCard'

export default class Roster extends Component {
	constructor(){
		super()
		this.state = {
			team_members: [
				{
					user: {
						name: "Jose Cortez",
						avatar: "",
						cover_image: "https://2.bp.blogspot.com/-RmPp8EvzMZU/UcbaIb0UhbI/AAAAAAAAQEM/AMYS91zqhjc/s1600/watermarked_cover666.jpg",
					},
					workplace: {
						name: "Chao Center"
					},
					certificates: 5,
					shifts: 574
				}
			]
		}
	}
	render() {
		return (
			<div>
				<Menu size="mini">
					<Menu.Item>
						<Button>ADD TEAM MEMBER</Button>
					</Menu.Item>

					<Menu.Item>
						<Search/>
					</Menu.Item>

					<Menu.Item>
						<Button>EXPORT EXCEL</Button>
					</Menu.Item>
				</Menu>
				{
					this.state.team_members.map((m, i)=> <TeamMemberCard key={i} member={m}/>)
				}
			</div>
		);
	}
}
