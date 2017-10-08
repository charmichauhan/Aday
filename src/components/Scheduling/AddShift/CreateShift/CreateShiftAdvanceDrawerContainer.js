import React, { Component } from 'react';
import { Icon, Divider, Button, Modal, Header, Image} from 'semantic-ui-react';
import DrawerHelper from './CreateShiftAdvanceDrawer';
	
export default class EditShiftDrawerContainer extends Component {
	constructor(props) {
	    super(props);
	 }

	render() {
	if (this.props.open){
		return (
			<DrawerHelper
		      width={this.props.width}
         	  shift={this.props.shift}
          	  open={this.props.open}
              handleBack={this.props.handleBack} />
			)
		} else {
			return (
					<div> </div>
				)
		}	
	}
}