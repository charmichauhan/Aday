import React, { Component } from 'react'
import { List, ListItem } from 'material-ui/List';
import IconButton from 'material-ui/IconButton';
import Edit from 'material-ui/svg-icons/image/edit';
import Delete from 'material-ui/svg-icons/action/delete';
import { Grid, GridColumn } from 'semantic-ui-react';
import AddBrandDrawer from './AddBrandDrawer';
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

export default class Brand extends Component {
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

	openAddBrandDrawer = (event) => {
		this.setState({ open: true });
	};

	render() {
		return (
			<div className="content brands-content">
				<div className="brand-add-button">
					<CircleButton type="blue" title="Add Brand" handleClick={this.openAddBrandDrawer} />
				</div>
				<List>
					{this.props.brands &&
					this.props.brands.map((brand) =>
						<Grid key={brand.id}>
							<GridColumn width={2}>
								<img className="brand-image" src={brand.image} alt={brand.name} />
							</GridColumn>
							<GridColumn width={14}>
								<ListItem
									key={brand.id}
									primaryText={brand.name}
								>
									<IconButton style={styles.actionButtons} onClick={this.handleEditClick}>
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
				<AddBrandDrawer
					width={styles.drawer.width}
					open={this.state.open}
					handleSubmit={this.handleSubmit}
					closeDrawer={this.closeDrawer} />
			</div>
		)
	}
}
