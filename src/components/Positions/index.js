import React, { Component } from 'react';
import { range, random } from 'lodash';
import { Tabs, Tab } from 'material-ui/Tabs';

import Positions from './Positions';
import { tabDesign } from '../styles';

import './positions.css';

const styles = {
	tabDesign
};

let positionsType = ['Cashier', 'Bakery', 'Sushi Chef', 'Pizza Chef', 'Deep Clean'];
const initState = {
	value: 'positions',
	positions: positionsType.map((position, index) => ({
		id: index + 1, // To make positive id
		type: position,
		teamMembers: range(random(0, 25)),
		workplaces: range(random(0, 5)),
		trainingHours: random(0, 40),
		trainingTracks: random(0, 10)
	}))
};

export default class PositionsSection extends Component {
	constructor(props) {
		super(props);
		this.state = initState;
	}

	componentWillMount() {
		const { props: {match}} = this;
		const tab = match && match.params && match.params.tab;
		this.setState({ value: tab });
	}

	handleChange = (value) => {
		this.setState({	value: value });
	};

	getButtonStyle = (value) => ({
		...styles.tabDesign.buttonStyle,
		fontWeight: (this.state.value === value && 600) || 500
	});

	render() {
		const { positions } = this.state;
		return (
			<section className="positions">
				<Tabs
					value={this.state.value}
					onChange={this.handleChange}
					inkBarStyle={styles.tabDesign.inkBarStyle}
					tabItemContainerStyle={styles.tabDesign.tabItemContainerStyle}>
					<Tab
						buttonStyle={this.getButtonStyle('positions')}
						label="Positions"
						value="positions">
						<Positions positions={positions} />
					</Tab>
					<Tab
						buttonStyle={this.getButtonStyle('training')}
						label="Training"
						value="training">
						<h2>Training</h2>
					</Tab>
				</Tabs>
			</section>
		);
	}
}
