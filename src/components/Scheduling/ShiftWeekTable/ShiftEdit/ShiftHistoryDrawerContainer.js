import React, { Component } from 'react';
import ShiftHistoryDrawer from './ShiftHistoryDrawer';

export default class ShiftHistoryDrawerContainer extends Component {
	constructor(props) {
	    super(props);
	 }

	render() {
	if (this.props.open){
		return (
			<ShiftHistoryDrawer
	          shift={this.props.shift}
	          users={this.props.users}
	          open={this.props.open}
            handleBack={this.props.handleBack}
	          handlerClose={this.props.handlerClose}
	          handleHistory={this.props.handleHistory} />
			)
		}else {
			return (
					<div> </div>
				)
		}
	}
}

