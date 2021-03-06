import React, { Component } from 'react';
import DrawerHelperComponent from './EditShiftDrawer';

export default class EditShiftDrawerContainer extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    if (this.props.open) {
      return (
        <DrawerHelperComponent
          shift={this.props.shift}
          users={this.props.users}
          open={this.props.open}
          handlerClose={this.props.handlerClose}
          handleHistory={this.props.handleHistory} />
      )
    } else {
      return (
        <div></div>
      )
    }
  }
}
