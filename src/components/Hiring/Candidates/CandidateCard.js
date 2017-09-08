import React, { Component } from 'react'
import { Image, Button, Icon, Card, Rating, Header } from 'semantic-ui-react'
import RaisedButton from 'material-ui/RaisedButton';
import "./candidate.css"

export default class CandidateCard extends Component {
	render() {
		const {
			user,
			avatar_url,
			user_phone_number,
			email,
			job,
		} = this.props.member

		return (
		    <Card style={{width:250}} color='red'>
		    	<Card.Content>
			      	<center>
					    <Image centered={true} size='small' shape='circular' src={user.avatar_url} />
					</center>
					<div style={{height:15}} />
					<Card.Header style={{textAlign:"center"}}>
						<font size="5.5" className="_first-name">{user.first_name}</font>
							<br />
						<font size="5.5" className="_last-name">{user.last_name}</font>
					</Card.Header>
					<Card.Content>
						<center className='rating card_body'>
							<div style={{height:7}} />
							<Rating icon='star' defaultRating={5} maxRating={5} />
							<div style={{height:15}} />
							<Card.Meta>
								<font size="2">
								{user.email}
								<br/>
								{user.phone_number}
								</font>
							</Card.Meta>
							<div style={{height:7}} />
							<RaisedButton label="View Profile" backgroundColor="#0022A1" labelColor="#FFFFFF" onClick={this.handleDrawerOpen} style={{marginTop:3}}/>
							<div style={{height:7}} />
						</center>
					</Card.Content>
		    	</Card.Content>
		    </Card>
		);
	}
}
