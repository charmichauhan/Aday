import React, { Component } from 'react'
import { List, ListItem } from 'material-ui/List';
import IconButton from 'material-ui/IconButton';
import Edit from 'material-ui/svg-icons/image/edit';
import Delete from 'material-ui/svg-icons/action/delete';
import filter from 'lodash/filter';
import { Grid, GridColumn, Progress } from 'semantic-ui-react';

import WorkplaceDrawer from './WorkplaceDrawer';
import CircleButton from '../../helpers/CircleButton/index';

const styles = {
	drawer: {
		width: 600
	},
	actionButtons: {
		margin: '0',
		float: 'right'
	},
	listItem: {
		padding: '10px 5px',
	},
	listSecondaryText: {
		height: 'auto'
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
		event.preventDefault();
		console.log('Delete button clicked');
	};

	handleDrawerSubmit = (workplace) => {
		this.setState({ open: false });
	};

	closeDrawer = (event) => {
		event.preventDefault();
		this.setState({ open: false });
	};

	openWorkplaceDrawer = (workplace) => {
		this.setState({ open: true, drawerWorkplace: workplace });
	};

	render() {
		const { workplaces } = this.props;
		const claimedWorkplaces = filter(workplaces, { 'claimed': true });
		const progressLabel = `${claimedWorkplaces.length * 100/workplaces.length}% WORKPLACES`;
		return (
			<div className="content workplaces-content">
				<div className="workplace-add-button">
					<CircleButton style={styles.circleButton} type="blue" title="Add Workplace"
					              handleClick={() => this.openWorkplaceDrawer()} />
				</div>
				<div className="workplace-progress-bar">
					<p>{progressLabel}</p>
					<Progress value={claimedWorkplaces.length} total={workplaces.length} progress='ratio'/>
				</div>
				<List>
					{workplaces && workplaces.map((workplace) =>
						<Grid key={workplace.id}>
							<GridColumn className="list-left-image-wrapper" width={2}>
								<img className="list-left-image" src={workplace.image} alt={workplace.name} />
							</GridColumn>
							<GridColumn width={14}>
								<ListItem
									innerDivStyle={styles.listItem}
									key={workplace.id}
									primaryText={workplace.name}
									secondaryText={
										<p style={styles.listSecondaryText} className="workplace-list secondary">
											<span htmlFor="type">{workplace.type}</span>
											<span className={(workplace.claimed && 'claimed') || 'unclaimed'}>
												{(workplace.claimed && 'claimed') || 'unclaimed'}
											</span>
										</p>
									}
								>
									<IconButton style={styles.actionButtons} onClick={() => this.openWorkplaceDrawer(workplace)}>
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
				<WorkplaceDrawer
					brands={this.props.brands}
					workplace={this.state.drawerWorkplace}
					width={styles.drawer.width}
					open={this.state.open}
					handleSubmit={this.handleDrawerSubmit}
					closeDrawer={this.closeDrawer} />
			</div>
		)
	}
}
