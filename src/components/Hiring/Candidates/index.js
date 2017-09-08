import React, { Component } from 'react'
import CandidateCard from './CandidateCard'
import { Image, Button, Icon, Card, Header, Rating } from 'semantic-ui-react'

const initialState = {
	//stub
};

export default class Candidates extends Component {
	constructor(props) {
		super(props);
		this.state = {
			...initialState,
			candidates: props.candidates
		};
	}

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
				<Card.Group itemsPerRow="7">
					{
						this.state.candidates.map((m, i)=> <CandidateCard key={i} member={m}/>)
					}
				</Card.Group>*/
			</div>
		);
	}
}
