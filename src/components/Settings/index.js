import React, { Component } from 'react';
import { Tabs, Tab } from 'material-ui/Tabs';

import Personal from './Personal';
import Workplace from './Workplace';
import Brand from './Brand';
import Company from './Company';
import { tabDesign } from '../styles';
import './settings.css';

const styles = {
	tabDesign
};

const initState = {
	user: {
		id: 101,
		firstName: 'Billy',
		lastName: 'Buchanan',
		email: 'billy.buchanan@gmail.com',
		phoneNumber: '+10123465789'
	},
	value: 'personal',
	companies: [{
		id: 1,
		name: 'Compass Group, USA',
	}],
	brands: [{
		id: 1,
		name: 'Restaurant Associates',
		image: '/images/brands/ra.png'
	}, {
		id: 2,
		name: 'Flik’s Hospitality Group',
		image: '/images/brands/compass.png'
	}],
	workplaces: [{
		id: 1,
		name: 'Chao Center',
		type: 'Restaurant Associates',
		claimed: true,
		image: '/images/workplaces/chao-center.jpg'
	}, {
		id: 2,
		name: 'Spangler Center',
		type: 'Restaurant Associates',
		claimed: false,
		image: '/images/workplaces/chao-center.jpg'
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
		this.setState({ value: tab });
	}

	handleChange = (value) => {
		this.setState({	value: value });
	};

	getButtonStyle = (value) => ({
		...styles.tabDesign.buttonStyle,
		fontWeight: (this.state.value === value && 700) || 500
	});

	render() {
		return (
			<section className="settings">
				<Tabs
					value={this.state.value}
					onChange={this.handleChange}
					inkBarStyle={styles.tabDesign.inkBarStyle}
					tabItemContainerStyle={styles.tabDesign.tabItemContainerStyle}>
					<Tab
						buttonStyle={this.getButtonStyle('personal')}
						label="Personal"
						value="personal">
						<Personal user={this.state.user} />
					</Tab>
					<Tab
						buttonStyle={this.getButtonStyle('workplace')}
						label="Workplace"
						value="workplace">
						<Workplace brands={this.state.brands} workplaces={this.state.workplaces} />
					</Tab>
					<Tab
						buttonStyle={this.getButtonStyle('brand')}
						label="Brand"
						value="brand">
						<Brand brands={this.state.brands} />
					</Tab>
					<Tab
						buttonStyle={this.getButtonStyle('company')}
						label="Company"
						value="company">
						<Company companies={this.state.companies} />
					</Tab>
				</Tabs>
			</section>
		);
	}
}
