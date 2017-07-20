import React, { Component } from 'react'
import { List, ListItem } from 'material-ui/List';
import IconButton from 'material-ui/IconButton';
import Edit from 'material-ui/svg-icons/image/edit';
import Delete from 'material-ui/svg-icons/action/delete';
import { Grid, GridColumn } from 'semantic-ui-react';
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
	listItem: {
		padding: '10px 5px',
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
					<CircleButton style={styles.circleButton} type="blue" title="Add Workplace"
					              handleClick={this.openAddWorkplaceDrawer} />
				</div>
				<List>
					{this.props.workplaces &&
					this.props.workplaces.map((workplace) =>
						<Grid key={workplace.id}>
							<GridColumn width={2}>
								<img className="brand-image" src={workplace.image} alt={workplace.name} />
							</GridColumn>
							<GridColumn width={14}>
								<ListItem
									innerDivStyle={styles.listItem}
									key={workplace.id}
									primaryText={workplace.name}
									secondaryText={workplace.type}
								>
									<IconButton style={styles.actionButtons} onClick={this.openEditBrandDrawer}>
										<Edit />
									</IconButton>
									<IconButton style={styles.actionButtons} onClick={this.handleDeleteClick}>
										<Delete />
									</IconButton>
								</ListItem>
							</GridColumn>

						</Grid>
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
