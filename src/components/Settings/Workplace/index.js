import React, { Component } from 'react'
import { List, ListItem } from 'material-ui/List';
import IconButton from 'material-ui/IconButton';
import Edit from 'material-ui/svg-icons/image/edit';
import Delete from 'material-ui/svg-icons/action/delete';
import filter from 'lodash/filter';
import { Grid, GridColumn, Progress } from 'semantic-ui-react';

import WorkplaceDrawer from './WorkplaceDrawer';
import Modal from '../../helpers/Modal';
import CircleButton from '../../helpers/CircleButton';

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
  open: false,
  openDeleteModal: false
};

export default class Workplace extends Component {
  constructor(props) {
    super(props);
    this.state = initialState;
  }

  getDeleteActions = () => {
    return [
      { type: 'white', title: 'Cancel', handleClick: this.closeModal, image: false },
      { type: 'red', title: 'Delete Workplace', handleClick: this.handleDelete, image: true }
    ];
  };

  handleDeleteClick = (id) => {
    console.log('Delete button clicked');
    this.setState({ openDeleteModal: true, toDeleteWorkplace: id });
  };

  handleDelete = () => {
    this.props.onDeleteWorkplace(this.state.toDeleteWorkplace);
    this.setState({ openDeleteModal: false, toDeleteWorkplace: undefined });
  };

  closeModal = () => {
    this.setState({ openDeleteModal: false });
  };

  handleDrawerSubmit = (workplace) => {
    // Make request to server to add workplace
    this.setState({ open: false });
    this.props.addOrUpdateWorkPlace(workplace);
  };

  closeDrawer = (event) => {
    this.setState({ open: false });
  };

  openWorkplaceDrawer = (workplace) => {
    this.setState({ open: true, drawerWorkplace: workplace });
  };

  render() {
    const { workplaces } = this.props;
    const claimedWorkplaces = filter(workplaces, { 'claimed': true });
    const progressLabel = `${claimedWorkplaces.length * 100 / workplaces.length}% WORKPLACES`;
    return (
      <div className="content workplaces-content">
        <div className="workplace-add-button">
          <CircleButton style={styles.circleButton} type="blue" title="Add Workplace"
                        handleClick={() => this.openWorkplaceDrawer()} />
        </div>
        <div className="workplace-progress-bar">
          <p>{progressLabel}</p>
          <Progress value={claimedWorkplaces.length} total={workplaces.length} progress='ratio' />
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
                      <span htmlFor="type">{workplace.brand}</span>
                      <span className={(workplace.claimed && 'claimed') || 'unclaimed'}>
												{(workplace.claimed && 'claimed') || 'unclaimed'}
											</span>
                    </p>
                  }
                >
                  <IconButton style={styles.actionButtons}
                              onClick={() => this.openWorkplaceDrawer(workplace)}>
                    <Edit />
                  </IconButton>
                  <IconButton style={styles.actionButtons}
                              onClick={() => this.handleDeleteClick(workplace.id)}>
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
        <Modal
          title="Confirm Delete"
          isOpen={this.state.openDeleteModal}
          message="Are you sure that you want to delete this Workplace?"
          action={this.getDeleteActions()}
          closeAction={this.closeModal}
        />

      </div>
    )
  }
}
