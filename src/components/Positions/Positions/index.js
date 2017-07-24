import React, { Component } from 'react'
import { Table,	TableBody, TableRow, TableRowColumn } from 'material-ui/Table';
import IconButton from 'material-ui/IconButton';
import Edit from 'material-ui/svg-icons/image/edit';
import Delete from 'material-ui/svg-icons/action/delete';
import Watch from 'material-ui/svg-icons/action/watch-later';

import CircleButton from '../../helpers/CircleButton/index';

const styles = {
	drawer: {
		width: 600
	},
	actionButtons: {
		margin: '-15px -10px 0 0',
		float: 'right'
	}
};

const initialState = {
	open: false
};

export default class Position extends Component {
	constructor(props) {
		super(props);
		this.state = initialState;
	}

	handleDeleteClick = (event) => {
		console.log('Delete button clicked');
	};

	handleDrawerSubmit = (event) => {
		this.setState({ open: false });
	};

	closeDrawer = (event) => {
		this.setState({ open: false });
	};

	openPositionDrawer = (position) => {
		this.setState({ open: true, drawerPosition: position });
	};

	render() {
		const { positions } = this.props;
		return (
			<div className="content positions-content">
				<div className="position-add-button">
					<CircleButton type="blue" title="Add Position" handleClick={() => this.openPositionDrawer()} />
				</div>
				<Table className="table list-grid">
					<TableBody displayRowCheckbox={false}>
						{positions && positions.map((position) => (
							<TableRow key={position.id}>
								<TableRowColumn><p>{position.type}</p><p>{position.teamMembers.length} Team Members</p></TableRowColumn>
								<TableRowColumn><p>{position.workplaces.length}</p><p>WORKPLACES</p></TableRowColumn>
								<TableRowColumn><p>{position.trainingHours}</p><p>TRAINING HOURS</p></TableRowColumn>
								<TableRowColumn><p>{position.trainingTracks}</p><p>TRAINING TRACKS</p></TableRowColumn>
								<TableRowColumn className="grid-actions">
									<Watch onClick={this.handleClick} />
									<Edit onClick={this.handleClick} />
									<Delete onClick={this.handleClick} />
								</TableRowColumn>
							</TableRow>))
						}
					</TableBody>
				</Table>
				{/*<PositionDrawer*/}
					{/*width={styles.drawer.width}*/}
					{/*open={this.state.open}*/}
					{/*position={this.state.drawerPosition}*/}
					{/*handleSubmit={this.handleDrawerSubmit}*/}
					{/*closeDrawer={this.closeDrawer} />*/}
			</div>
		)
	}
}
