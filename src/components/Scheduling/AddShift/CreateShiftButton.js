import React, { Component } from 'react';
import { Icon, Divider, Button, Modal, Header, Image} from 'semantic-ui-react';
import 'react-date-picker/index.css';
import { Provider } from 'react-redux';
import AddShiftForm from './CreateShift/AddShiftForm';
import AddEmployeeForm from './CreateShift/AddEmployeeForm';
import { createStore, combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import './styles.css';
import { NavLink } from 'react-router-dom'


export default class CreateShiftButton extends Component {
	constructor(props) {
    super(props);
        this.onButtonClick = this.onButtonClick.bind(this);
		this.onFormClose = this.onFormClose.bind(this);

		this.onEmployeeCount = this.onEmployeeCount.bind(this);
    	this.onStandard = this.onStandard.bind(this);
    	this.onStandardFormClose=this.onStandardFormClose.bind(this);

    this.state = {
      poppedOut: false,
	  employeeCount : false,
      standard:false,
      template:false, 
      modalHeight: '350px',
      modalSize: 'small'
    };
  }
	onButtonClick(e) {
		this.setState({ poppedOut: true});
	}
    onFormClose() {
		this.setState({ poppedOut: false, standard: false, 
						employeeCount: false, template: false, 
						modalHeight:'350px', modalSize: 'small' });
	}
	
	onEmployeeCount(){
	    this.setState({employeeCount:false})
	 }
	 
	 onStandard(){
	    this.setState({modalHeight: '900px', modalSize: 'medium', standard:true})
	 }

	onTemplate(){
	    this.setState({template:true})
	}

	 onStandardFormClose(){
	   this.closeFunc()
	 }
		render() {
		return (

			<Modal
			   	trigger={<Image src="/images/Assets/Icons/Buttons/create-shift-button.png" style={{ cursor: 'pointer' }} onClick={ this.onButtonClick } className="btn-image"/>}
				 open={ this.state.poppedOut }
				 size={ this.state.modalSize }
				 style={{ height: this.state.modalHeight}}
         		 onClose={ this.onFormClose }
				>
			     
			        
			        { !this.state.employeeCount && !this.state.standard && 
			          <Modal.Content>
			          <Header as='h2' style={{textAlign: 'center', color: '#0022A1',fontSize: '26px',marginLeft: '10%',padding: '2px'}} >
			           <p style={{paddingTop:'11px',float:'left',marginLeft:'30%'}}>ADD HOURS</p>
			          </Header>
			          <Divider style={{ marginTop: '8.5%' }}/>
			              <Image
			                          src="/images/Assets/Icons/Buttons/employee-count-coming.png"
			                          shape="rounded"
			                          style={{float: 'left',left: '2.5%',marginTop: '3%' , cursor: 'pointer'}}
			                          onClick={ this.onEmployeeCount }
			                           height='186.719'
			                           width='215.391'
			                         />
			               <Image
			                          src="/images/Assets/Icons/Buttons/standard-add.png"
			                          shape="rounded"
			                          style={{ float: 'left',left: '4.8%',marginTop: '3%',cursor: 'pointer' }}
			                          onClick={ this.onStandard }
			                           height='186.719'
			                           width='215.391'

			                       />
			                <Image
			                           src="/images/Assets/Icons/Buttons/add-template.png"
			                           shape="rounded"
			                           style={{ float: 'left',right: '1.8%',marginTop: '3%',cursor: 'pointer',left: '7.2%' }}
			                           as={NavLink} to="/schedule/template"
			                           height='186.719'
			                           width='215.391'

			                        />
			            </Modal.Content>
			                }
			            
			                { this.state.employeeCount && <AddEmployeeForm /> } 
			                { this.state.standard && <AddShiftForm  closeFunc={ this.onFormClose } /> } 

		  </Modal>
		);
	}
}
