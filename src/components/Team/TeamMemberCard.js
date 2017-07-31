import React, { Component } from 'react'
import { Image, Button, Icon, Card, Rating, Header } from 'semantic-ui-react'
import RaisedButton from 'material-ui/RaisedButton';
import "./team-member-card.css"

export default class TeamMemberCard extends Component {
	render() {
		const {
			user,
			avatar_url,
			user_phone_number,
			email,
			job,
		} = this.props.member

		return (
		    <Card>
		    	<Card.Content>
			      	<center>
					    <Image centered='true' size='small' shape='circular' src={user.avatar_url} />
					</center>
					<br/>
		        	<Card.Description>
						<center>
							<font size="5.5" className="first_name">{user.first_name}</font>
							<span> </span>
							<font size="5.5" className="last_name">{user.last_name}</font>
						</center>
					<Card.Content>
						<center className='rating' className="card_body">
							<Rating icon='star' defaultRating={5} maxRating={5} />
							<br/>
							<br/>
							<font size="3">
							{user.phone_number}
							<br/>
							{user.email}
							<br/>
							</font>
							<br/>
							<Button color='blue'>View Profile</Button>
							<br/>
						</center>
					</Card.Content>
		        	</Card.Description>
		    	</Card.Content>
		    </Card>
		);
	}
}
