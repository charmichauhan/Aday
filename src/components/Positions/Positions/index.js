import React, { Component } from 'react'
import { Image } from 'semantic-ui-react';
import { Table, TableBody, TableRow, TableRowColumn } from 'material-ui/Table';
import IconButton from 'material-ui/IconButton';
import Edit from 'material-ui/svg-icons/image/edit';
import Delete from 'material-ui/svg-icons/action/delete';
import Watch from 'material-ui/svg-icons/action/watch-later';
import PositionDrawer from './PositionDrawer';
import Modal from '../../helpers/Modal';

import CircleButton from '../../helpers/CircleButton/index';

const styles = {
  drawer: {
    width: 600
  },
  actionButtons: {
    margin: '-15px -10px 0 0',
    float: 'right'
  },
  iconStyles: {
    margin: '5px 8px',
    color: 'rgba(74, 74, 74, 0.7)',
    width: '36px',
    height: '36px',
    cursor : "pointer"
  },
  noBorder: {
    border: 'none',
  }
};

const initialState = {
  open: false,
  openDeleteModal:false
};

export default class Position extends Component {
  constructor(props) {
    super(props);
    this.state = initialState;
  }
  getDeleteActions = () => {
    return [
      { type: 'white', title: 'Cancel', handleClick: this.closeModal, image: false },
      { type: 'red', title: 'Delete Position', handleClick: this.handleDelete, image: false }
    ];
  };

  handleDeleteClick = (id) => {
     this.setState({ openDeleteModal: true, toDeletePosition: id });
  };

  handleDrawerSubmit = (position) => {
    this.setState({ open: false });
    this.props.addOrUpdatePosition(position);
  };

  closeDrawer = (event) => {
    this.setState({ open: false });
  };

  closeModal = () => {
    this.setState({ openDeleteModal: false });
  };
  openPositionDrawer = (position) => {
    this.setState({ open: true, drawerPosition: position });
  };
  handleDelete = () => {
    this.props.onDeletePosition(this.state.toDeletePosition);
    this.setState({ openDeleteModal: false, toDeleteWorkplace: undefined });
  };

  render() {
    const { positions } = this.props;
   // console.log(positions);

    return (
      <div className="content positions-content">
        <div className="position-add-button">
          <CircleButton type="blue" title="Add Position" handleClick={() => this.openPositionDrawer()} />
        </div>
        <Table className="table list-grid">
          <TableBody displayRowCheckbox={false}>
            {positions.map((position) => (
             <TableRow style={styles.noBorder} key={position.id}>
                <TableRowColumn style={{border:"none",width:"70px",padding:"4px 10px"}}>
                  <i className="icon-circle-td"><Image src={position.positionIconUrl} size="mini" /></i>
                </TableRowColumn>
                <TableRowColumn style={styles.noBorder}>
                  <h6>{position.positionName}</h6><p>{position.jobsByPositionId.nodes.length} Team Members</p>
                </TableRowColumn>
                <TableRowColumn style={styles.noBorder}>
                  <h6>{position.opportunitiesByPositionId.nodes.length}</h6><span>WORKPLACES</span>
                </TableRowColumn>
                <TableRowColumn style={styles.noBorder}>
                  <h6>{position.traineeHours}</h6><span>TRAINING HOURS</span>
                </TableRowColumn>
                <TableRowColumn style={styles.noBorder}>
                  <h6>{position.trainingTracks}</h6><span>TRAINING TRACKS</span>
                </TableRowColumn>
                <TableRowColumn style={styles.noBorder} className="grid-actions">
                  <Watch style={styles.iconStyles} onClick={this.handleClick} />
                  <Edit style={styles.iconStyles} onClick={() => this.openPositionDrawer(position)} />
                  <Delete style={styles.iconStyles} onClick={() => this.handleDeleteClick(position.id)} />
                </TableRowColumn>
              </TableRow>))
            }
          </TableBody>
        </Table>
        <PositionDrawer
        width={styles.drawer.width}
        open={this.state.open}
        position={this.state.drawerPosition}
        handleSubmit={this.handleDrawerSubmit}
        closeDrawer={this.closeDrawer} />
         <Modal
          title="Confirm Delete"
          isOpen={this.state.openDeleteModal}
          message="Are you sure that you want to delete this Position?"
          action={this.getDeleteActions()}
          closeAction={this.closeModal}
        />
      </div>
    )
  }
}
