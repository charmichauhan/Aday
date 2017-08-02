import AddShiftForm from '../../AddShift/CreateShift/AddShiftForm';
import React, { Component } from 'react';
import { Icon, Divider, Button, Modal, Header, Image} from 'semantic-ui-react';

	
export default class EditShiftModal extends Component {
	constructor(props) {
	    super(props);
	 }

	render() {
		return (
			<Modal
				 open={ this.props.open }
				 size={ 'medium' }
				 style={{ height: '900px'}}
         		 onClose={ this.props.onClose }
				>
					<AddShiftForm editMode={true} data={this.props.data} closeFunc={ this.props.onClose }/>
				</Modal>

		)
	}
}