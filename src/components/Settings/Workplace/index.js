import React, { Component } from 'react'
import { List, ListItem } from 'material-ui/List';
import IconButton from 'material-ui/IconButton';
import Edit from 'material-ui/svg-icons/image/edit';
import Delete from 'material-ui/svg-icons/action/delete';
import AddWorkplaceDrawer from './AddWorkplaceDrawer';
import CircleButton from '../../helpers/CircleButton/index';

const styles = {
	drawer: {
		width: 600
	},
	actionButtons: {
		margin: '-15px -10px 0 0',
		float: 'right'
	},
	circleButton: {
		fontSize: 18,
		padding: '6px 5px',
		fontWeight: 'bold'
	}
};

const initialState = {
	open: false
};

export default class Workplace extends Component {
	constructor(props) {
		super(props);
		this.state = initialState;
	}

	handleEditClick = (event) => {
		console.log('Edit button clicked');
	};

	handleDeleteClick = (event) => {
		console.log('Delete button clicked');
	};

	handleSubmit = (event) => {
		this.setState({ open: false });
	};

	closeDrawer = (event) => {
		this.setState({ open: false });
	};

	openAddWorkplaceDrawer = (event) => {
		this.setState({ open: true });
	};

	render() {
		return (
			<div className="content workplaces-content">
				<div className="workplace-add-button">
					<CircleButton style={styles.circleButton} type="blue" title="Add Workplace" handleClick={this.openAddWorkplaceDrawer} />
				</div>
				<List>
					{this.props.workplaces &&
					this.props.workplaces.map((workplace) =>
						<ListItem
							key={workplace.id}
							primaryText={workplace.name}
							secondaryText={workplace.type}
						>
							<IconButton style={styles.actionButtons} onClick={this.handleEditClick} >
								<Edit />
							</IconButton>
							<IconButton style={styles.actionButtons} onClick={this.handleDeleteClick} >
								<Delete />
							</IconButton>
						</ListItem>
					)}
				</List>
				<AddWorkplaceDrawer
					brands={this.props.brands}
					width={styles.drawer.width}
					open={this.state.open}
					handleSubmit={this.handleSubmit}
					closeDrawer={this.closeDrawer} />
			</div>
		)
	}
}
