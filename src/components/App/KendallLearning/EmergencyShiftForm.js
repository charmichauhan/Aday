import React, { Component } from 'react';
import moment from 'moment';
import { Icon, Button,Image,Modal,Header,Segment,Input,TextArea,Form} from 'semantic-ui-react';
import {Scrollbars} from 'react-custom-scrollbars';
import TimePicker from '../../TimePicker/TimePicker';
import NumberOfMemberSelector from '../../NumberOfMemberSelector/NumberOfMemberSelector';
import ShiftDaySelector from '../../DaySelector/ShiftDaySelector';
import './EmergencyShiftForm.css';

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
            onClick={this.props.closeFunc}
          />
        </Header>
         <Segment raised style ={{marginTop:'2%'}}>
          <Scrollbars
             style = {{height:'72.4vh',marginBottom:'20px',paddingBottom:'20px'}} >
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
             <p style={{fontSize:'20px',fontStyle:'normal',color:'rgba(0, 0, 0, 0.87)'}}>SHIFT DATE(S)</p>
             <ShiftDaySelector />
            </div>
            <div>
              <TimePicker />
            </div>
            <div style={{marginTop:'32%'}}>
               <p style={{fontSize:'20px',fontStyle:'normal',color:'rgba(0, 0, 0, 0.87)'}}>NUMBER OF TEAM MEMBERS</p>
              <NumberOfMemberSelector />
            </div>
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
                src="/images/Assets/Icons/Buttons/emergency-shift.png"
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
