import React, { Component } from 'react'
import { List, ListItem } from 'material-ui/List';
import Edit from 'material-ui/svg-icons/image/edit';
import IconButton from 'material-ui/IconButton';
import Drawer from '../components/Drawer';

const styles = {
	icons: {
		mediumIcon: {
			width: 48,
			height: 48,
		},
		medium: {
			width: 96,
			height: 96,
			padding: 24,
		}
	},
	drawer: {
		width: 400
	}
};

const initialState = {
	open: false
};

export default class Company extends Component {
	constructor(props) {
		super(props);
		this.state = initialState;
	}

	handleClick = (event) => {
		this.setState({ open: true });
	};

	handleSubmit = (event) => {
		this.setState({ open: false });
	};

	closeDrawer = (event) => {
		this.setState({ open: false });
	};

	render() {
		return (
			<div className="App-content">
				<List>
					{this.props.companies &&
					this.props.companies.map((company) =>
						<ListItem
							key={company.id}
							primaryText={company.name}
							rightIconButton={
								<IconButton
									iconStyle={styles.mediumIcon}
									style={styles.medium}
									onClick={this.handleClick}
								>
									<Edit />
								</IconButton>
							}
						/>
					)}
				</List>
				<Drawer
					width={styles.drawer.width}
					open={this.state.open}
					handleSubmit={this.handleSubmit}
					closeDrawer={this.closeDrawer} />
			</div>
		)
	}
}
