import React, { Component } from 'react';
import Candidates from './Candidates';
import { Header, Button, Segment, Form, Dropdown, Menu, Checkbox } from 'semantic-ui-react'
import RaisedButton from 'material-ui/RaisedButton';
import { tabDesign } from '../styles';
import Switch from 'react-flexible-switch';

import './hiring.css';

const styles = {
	tabDesign
};

const initState = {
	candidates: [
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


export default class Hiring extends Component {
	constructor(props) {
		super(props);
		this.state = initState;
	}

	

	render() {

	const options = [
	  { key: 1, text: 'By Position Title', value: 1 },
	  { key: 2, text: 'By Name', value: 2 },
	  { key: 3, text: 'Your Rating', value: 3 },
	]
		return (
			<div>
			<br/>
			<center>
				<Button basic fluid active='false'>
				<Header as='h1'>Find Talent</Header>
				</Button>
			</center>
			<br/>
			<Segment>
			    <Form>
			      <Form.Group>
			        <Form.Input  size='big' placeholder='Cashier, Cook' />
					<Dropdown placeholder='By Position' selection simple options={options} />
			        <Form.Field id='invite_team_member' control={Button} size='big' content='Search'/>
					</Form.Group>
			        <div>
			        <Header as='h4'>Return Only Completed Profiles?</Header>
			        <Switch value={false} labels={{ on: 'YES', off: 'NO' }} circleStyles={{ onColor: 'green', offColor: 'red', diameter: 20 }}/>
			        </div>
			    </Form>
			</Segment>
			<div>
				<Candidates candidates={this.state.candidates}/>
			</div>
			</div>
		)
	}
}


