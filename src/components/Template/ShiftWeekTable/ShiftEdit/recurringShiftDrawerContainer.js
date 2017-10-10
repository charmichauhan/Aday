import React, { Component } from 'react';
import { Icon, Divider, Button, Modal, Header, Image} from 'semantic-ui-react';
import DrawerHelper from './EditShiftDrawer';
	
export default class EditShiftDrawerContainer extends Component {
	constructor(props) {
	    super(props);
	 }

	render() {
	if (this.props.open){
		return (
			<DrawerHelper
	          		width={this.props.width }
                    open={this.props.open }
                    shift={this.props.shift }
                    weekStart={this.props.weekStart }
                    handleSubmit={this.props.handleSubmit }
                    closeDrawer={this.props.closeDrawer }
                    recurringId={ this.props.recurringId }
                    edit={ this.props.edit } />
			)
		} else {
			return (
					<div> </div>
				)
		}	
	}
}