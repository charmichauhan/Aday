import React, { Component } from 'react';
import { Icon, Button,Modal,Header,Image} from 'semantic-ui-react';
import 'react-date-picker/index.css';
import EmergencyShiftForm from './EmergencyShiftFormContainer';
import { Provider } from 'react-redux';
import { createStore, combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import {ModalContainer, ModalDialog} from 'react-modal-dialog';

function shiftReducer(state={}, action) {
	switch (action.type) {
		case 'SUBMIT_EMERGENCY_SHIFT':
			return Object.assign({}, state, {
				shifts: [
					...(state.shifts || []),
					{
						date: action.date,
						workplace: action.workplace,
						template: action.template,
						certification: action.certification,
						start: action.start,
						end: action.end
					}
				]
			})
		default:
			return state
	}
}

export default class EmergencyShiftButton extends Component {

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
		this.setState({ poppedOut: false});
	}
	onConfirmClick(e) {
		this.setState({ confirmPop: false});
	}
	onSubmit(values, dispatch, props) {
		if (values) {
			var ret = Object.assign({}, values);
			if (values['start']) {
				let start = values['start'];
				Object.assign(ret, {'start': start.format("hh:mm a")});
			}
			if (values['end']) {
				let end = values['end'];
				Object.assign(ret, {'end': end.format("hh:mm a")});
			}
			console.log(ret);
      dispatch({type: 'SUBMIT_EMERGENCY_SHIFT', ...ret});
			props.reset();
			this.setState({ confirmPop: true});
    }
  }


	  render(){

		const reducer = combineReducers ({ form: formReducer, shifts: shiftReducer});
		// there should be 1 more layer of component so store isn't being remade
		const store = createStore(reducer, {shifts: []});
		let unsubscribe = store.subscribe(() =>
		  console.log(store.getState())
		)


	return(
		 <Provider store={store} >
		  <Modal
			   trigger={<Image
					            src="/images/Assets/Icons/Buttons/emergency-shfit-button.png"
											onClick={this.onButtonClick}
											style={{cursor:'pointer'}}
									 />}
				 open={this.state.poppedOut}
				 style={{marginTop:'0px', left:'53%',top: '5%',padding: '1.0%',bottom: '5%'}}
				 size="large"
			 >
			  <EmergencyShiftForm closeFunc={this.onFormClose}/>
			</Modal>
		 </Provider>
		 );
	 }
}
