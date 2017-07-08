import { DatePickerForm, TimePickerForm } from './datePickerForm';
import React, { Component } from 'react';
import { Field } from 'redux-form';
import { Slider, SelectField } from 'redux-form-material-ui';
import { Icon, Button,Image,Modal,Header,Segment,Input,TextArea,Form} from 'semantic-ui-react';
import MenuItem from 'material-ui/MenuItem';
import './EmergencyShiftForm.css';
import moment from 'moment';
import {Scrollbars} from 'react-custom-scrollbars';
import TimePicker from './TimePicker/TimePicker';
import NumberOfEmployeeSelector from './NumberOfEmployeeSelector';

class EmergencyShiftForm extends Component {
  render() {
    const { handleSubmit, numMembers, pristine, reset, submitting } = this.props;
    return (
      <div>
        <Header as = 'h1' style={{textAlign: 'center' , color: '#0022A1'}} >
          EMERGENCY SHIFT
          <Image
            floated="left"
            src="/images/Assets/Icons/Icons/job-deck.png"
            style= {{marginTop:'0px',width:'35px'}}
          />
          <Image
            floated="right"
            src="/images/Assets/Icons/Buttons/delete-round-small.png"
            shape="circular"
          style={{marginTop:'0px',right:'-11%',width:'50px'}}
          />
        </Header>
         <Segment raised style ={{marginTop:'2%'}}>
          <Scrollbars
             style = {{height:'550px',marginBottom:'20px',paddingBottom:'20px'}} >
          <Form>
           <div>
             <p style = {{fontSize:'20px',fontStyle:'normal',color:'rgba(0, 0, 0, 0.87)'}}>WORKPLACE</p>
             <Input placeholder="CHAO CENTER" icon = {<Icon name = "sort" />} style={{marginTop:'-2%',width:'95%',backgroundColor:'lightgrey'}} />
           </div>
           <div>
             <p style = {{fontSize:'20px',fontStyle:'normal',color:'rgba(0, 0, 0, 0.87)'}}>SELECT TEMPLATE</p>
             <Input placeholder="SELECT TEMPLATE" icon = {<Icon name = "sort" />} style={{marginTop:'-2%',width:'95%',backgroundColor:'lightgrey'}} />
           </div>
           <div>
             <p style = {{fontSize:'20px',fontStyle:'normal',color:'rgba(0, 0, 0, 0.87)'}}>POSITION</p>
             <Input placeholder="POSITION" icon = {<Icon name = "sort" />} style={{marginTop:'-2%',width:'95%',backgroundColor:'lightgrey'}} />
           </div>
           <div>
             <p style={{fontSize:'20px',fontStyle:'normal',color:'rgba(0, 0, 0, 0.87)'}}>SHIFT DATE</p>
             <Input placeholder={moment().format('MM-DD-YYYY')} icon = {<Icon name = "calendar" />} style={{marginTop:'-2%',width:'95%',backgroundColor:'lightgrey'}} />
           </div>
            <TimePicker />
            <NumberOfEmployeeSelector />
           <div style={{marginTop:'2%'}}>
             <p style = {{fontSize:'20px',fontStyle:'normal',color:'rgba(0, 0, 0, 0.87)'}}>UNPAID-BREAK</p>
             <Input placeholder="30 MINUTES (SET BY POLICY)" icon = {<Icon name = "chevron down" />} style={{marginTop:'-2%',width:'95%',backgroundColor:'lightgrey'}} />
           </div>
           <div>
             <p style = {{fontSize:'20px',fontStyle:'normal',color:'rgba(0, 0, 0, 0.87)'}}><span style={{color:'#0022A1'}}>Maximum</span> INCENTIVE BONUS PER HOUR</p>
             <Input placeholder="$0.00" icon = {<Icon name = "sort" />} style={{marginTop:'-2%',width:'95%',backgroundColor:'lightgrey'}} />
           </div>
           <div>
             <p style = {{fontSize:'20px',fontStyle:'normal',color:'rgba(0, 0, 0, 0.87)'}}>INSTRUCTIONS - <span style={{color:'RED'}}>OPTIONAL</span></p>
             <TextArea rows={3} style={{width:'95%'}} placeholder='ENTER ADDITIONAL INFORMATION ABOUT THE SHIFT' />

           </div>
           <div>
              <Image
                centered
                src="/images/Assets/Icons/Buttons/confirm-button.png"
                shape="circular"
              />
           </div>
           </Form>
           </Scrollbars>
         </Segment>
      </div>
     );
  }


}
export default EmergencyShiftForm;
