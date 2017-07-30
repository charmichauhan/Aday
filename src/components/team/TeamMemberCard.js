import React, { Component } from 'react'
import { Image, Button, Icon, Card, Header, Rating } from 'semantic-ui-react'
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
//		  <Card.Group itemsPerRow="4">
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
							<font size="4">
							{user.phone_number}
							<br/>
							{user.email}
							<br/>
							</font>
							<br/>
							<RaisedButton label="View Profile" backgroundColor="#0022A1" labelColor="#FFFFFF"/>
							<br/>
							<br/>
						</center>
					</Card.Content>
		        	</Card.Description>
		    	</Card.Content>
{/* To be used with applicants for the position
		      <Card.Content extra>
		        <div className='ui two buttons'>
		          <Button basic color='green'>Approve</Button>
		          <Button basic color='red'>Decline</Button>
		        </div>
		      </Card.Content>
*/}
		    </Card>
//		  </Card.Group>
		);
	}
}
