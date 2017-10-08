import React, { Component } from 'react';
import { Icon, Divider, Button, Modal, Header, Image} from 'semantic-ui-react';
import DrawerHelper from './CreateShiftDrawer';
	
export default class EditShiftDrawerContainer extends Component {
	constructor(props) {
	    super(props);
	 }

	render() {
	if (this.props.open){
		return (
			<DrawerHelper
		      width={this.props.width}
	          open={this.props.open}
	          shift={this.props.shift}
	          users={this.props.users}
	          managers={this.props.managers}
	          weekStart={this.props.weekStart}
	          handleSubmit={this.props.handleSubmit}
	          handleAdvance={this.props.handleAdvance}
	          closeDrawer={this.props.closeDrawer} />
			)
		} else {
			return (
					<div> </div>
				)
		}	
	}
}