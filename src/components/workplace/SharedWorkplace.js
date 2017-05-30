import React, { Component } from 'react';
import { Card, Image } from 'semantic-ui-react'

import Avatar from '../helpers/Avatar'


export default class SharedWorkplace extends Component {
	constructor(){
		super()
		this.state = {
			workspaces : [
				{
					title: "CHAO CENTER",
					general_manager:{
						first_name: "Eric",
						last_name: "WISE",
						title: "General Manager"
					}
				},
				{
					title: "MORGAN HALL",
					general_manager:{
						first_name: "Eric",
						last_name: "WISE",
						title: "General Manager"
					}
				},
				{
					title: "SPANGLER CENTER",
					general_manager:{
						first_name: "Eric",
						last_name: "WISE",
						title: "General Manager"
					}
				}
			]
		}
	}
	render() {
		return (
			<Card.Group>
			{
				this.state.workspaces.map((workspace, i)=>(
					<Card key={i}>
						<Card.Content>
							<Card.Header>{workspace.title}</Card.Header>
						</Card.Content>
						<Image src="http://www.softpress.com/kb/images/Google%20Maps%20Marker%20Action%20in%20use.png"/>
						<Card.Content>
							<Avatar
								first_name={workspace.general_manager.first_name}
								last_name={workspace.general_manager.last_name}
								description={workspace.general_manager.title}
							/>
						</Card.Content>
					</Card>
				))
			}	
			</Card.Group>
		);
	}
}
