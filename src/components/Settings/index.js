import React, { Component } from 'react';
import { Tabs, Tab } from 'material-ui/Tabs';
import Company from './Company';

const styles = {
	headline: {
		fontSize: 24,
		paddingTop: 16,
		marginBottom: 12,
		fontWeight: 400,
	},
};

const initState = {
	value: 'company',
	companies: [{
		id: 1,
		name: 'Compass Group, USA',
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
			<section>
				<Tabs value={this.state.value} onChange={this.handleChange}>
					<Tab label="Personal" value="personal">
						<div>
							<h2 style={styles.headline}>Personal</h2>
						</div>
					</Tab>
					<Tab label="Workplace" value="workplace">
						<div>
							<h2 style={styles.headline}>Workplace</h2>
						</div>
					</Tab>
					<Tab label="Brand" value="brand">
						<div>
							<h2 style={styles.headline}>Brand</h2>
						</div>
					</Tab>
					<Tab label="Company" value="company">
						<Company companies={this.state.companies} />
					</Tab>
				</Tabs>
			</section>
		);
	}
}
