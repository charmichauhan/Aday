import React, { Component } from 'react';
import { Tabs, Tab } from 'material-ui/Tabs';

import Personal from './Personal';
import Workplace from './Workplace';
import Brand from './Brand';
import Company from './Company';
import './settings.css';

const styles = {
	headline: {
		fontSize: 24,
		paddingTop: 16,
		marginBottom: 12,
		fontWeight: 400,
	},
};

const initState = {
	user: {
		id: 101,
		firstName: 'Billy',
		lastName: 'Buchanan',
		email: 'billy.buchanan@gmail.com',
		phoneNumber: '0123465789'
	},
	value: 'personal',
	companies: [{
		id: 1,
		name: 'Compass Group, USA',
	}],
	brands: [{
		id: 1,
		name: 'Restaurant Associates',
	}, {
		id: 2,
		name: 'Flik’s Hospitality Group'
	}],
	workplaces: [{
		id: 1,
		name: 'Chao Center',
		type: 'Restaurant Associates'
	}, {
		id: 2,
		name: 'Spangler Center',
		type: 'Restaurant Associates'
	}]
};

export default class Settings extends Component {
	constructor(props) {
		super(props);
		this.state = initState;
	}

	componentWillMount() {
		const { props: {match}} = this;
		const tab = match && match.params && match.params.tab;
		this.setState({ value: tab});
	}

	handleChange = (value) => {
		this.setState({
			value: value,
		});
	};

	render() {
		return (
			<section className="settings">
				<Tabs value={this.state.value} onChange={this.handleChange}>
					<Tab label="Personal" value="personal">
						<Personal user={this.state.user} />
					</Tab>
					<Tab label="Workplace" value="workplace">
						<Workplace brands={this.state.brands} workplaces={this.state.workplaces} />
					</Tab>
					<Tab label="Brand" value="brand">
						<Brand brands={this.state.brands} />
					</Tab>
					<Tab label="Company" value="company">
						<Company companies={this.state.companies} />
					</Tab>
				</Tabs>
			</section>
		);
	}
}
