import React, { Component } from 'react'
import { Image } from 'semantic-ui-react';
import { Table, TableBody, TableRow, TableRowColumn } from 'material-ui/Table';
import Edit from 'material-ui/svg-icons/image/edit';
import Delete from 'material-ui/svg-icons/action/delete';
import DeviceAccessTime from 'material-ui/svg-icons/device/access-time';

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
    margin: '5px 6px',
    width: 36,
    height: 36
  },
  noBorder: {
    border: 'none'
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

  handleEditClick = (event) => {
    console.log('Edit button clicked');
  };

  handleClick = (event) => {
    console.log('Time button clicked');
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
              <TableRow style={styles.noBorder} key={position.id}>
                <TableRowColumn style={styles.noBorder}>
                  <i className="icon-circle-td"><Image src="/images/Sidebar/positions.png" size="mini" /></i>
                </TableRowColumn>
                <TableRowColumn style={styles.noBorder}>
                  <h6>{position.type}</h6><p>{position.teamMembers.length} Team Members</p>
                </TableRowColumn>
                <TableRowColumn style={styles.noBorder}>
                  <h6>{position.workplaces.length}</h6><span>WORKPLACES</span>
                </TableRowColumn>
                <TableRowColumn style={styles.noBorder}>
                  <h6>{position.trainingHours}</h6><span>TRAINING HOURS</span>
                </TableRowColumn>
                <TableRowColumn style={styles.noBorder}
                                className={!position.trainingTracks && 'positions-icon-column-red'}>
                  <h6>{position.trainingTracks}</h6><span>TRAINING TRACKS</span>
                </TableRowColumn>
                <TableRowColumn style={styles.noBorder} className="grid-actions">
                  <DeviceAccessTime style={styles.iconStyles} onClick={this.handleClick} color="gray" />
                  <Edit style={styles.iconStyles} onClick={this.handleEditClick} color="gray" />
                  <Delete style={styles.iconStyles} onClick={this.handleDeleteClick} color="gray" />
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
