import React, { Component } from 'react';
import ShiftHistoryDrawer from './ShiftHistoryDrawer';
import ShiftHistoryNonSortDrawer from './ShiftHistoryNonSortDrawer';

export default class ShiftHistoryDrawerContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    if (this.props.open) {
      const { isSorted } = this.props;
      return (
        isSorted ?
          <ShiftHistoryDrawer
            shift={this.props.shift}
            users={this.props.users}
            open={this.props.open}
            handleBack={this.props.handleBack}
            handlerClose={this.props.handlerClose}
            handleHistory={this.props.handleHistory}
            phoneTree={this.props.phoneTree} />
           :
          <ShiftHistoryNonSortDrawer
            open={this.props.open}
            shift={this.props.shift}
            users={this.props.users}
            handleBack={this.props.handleBack}
            handlerClose={this.props.handlerClose}
            handleHistory={this.props.handleHistory}
            MarketsData={this.state.MarketsData}/>
      )
    } else {
      return (
        <div></div>
      )
    }
  }
}
