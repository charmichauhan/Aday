import React, { Component } from 'react';
import { Icon, Button,Modal,Image} from 'semantic-ui-react';
import 'react-date-picker/index.css';
import { Provider } from 'react-redux';
import { createStore, combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import CreateShiftSelectionForm from './CreateShiftSelectionForm';
import './styles.css';



export default class CreateShiftButton extends Component {
	constructor(props) {
    super(props);
    this.onButtonClick = this.onButtonClick.bind(this);
		this.onFormClose = this.onFormClose.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
		this.onConfirmClick = this.onConfirmClick.bind(this);
    this.state = {
      poppedOut: false,
			confirmPop: false
    };
  }
	onButtonClick(e) {
				this.setState({ poppedOut: true});
	}
  onFormClose() {
		console.log("sdasdjkjk");
		this.setState({ poppedOut: false});
	}
	onConfirmClick(e) {
		this.setState({ confirmPop: false});
	}
	onSubmit() {
		this.setState({ confirmPop: true});
  }
	render() {
		return (

			<Modal
			   trigger={<Image src="/images/Assets/Icons/Buttons/create-shift-button.png" style={{ cursor: 'pointer' }} onClick={ this.onButtonClick } />}
				 open={ this.state.poppedOut }
				 size="small"
				 style={{ marginTop: '-12%',width:'57%', height: '50%',left:'50%' }}
         onClose={ this.onFormClose }
				>
				<CreateShiftSelectionForm closeFunc={ this.onFormClose } />
		 </Modal>
		);
	}
}
