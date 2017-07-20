import React, { Component } from 'react';
import moment from 'moment';
import { Icon, Button,Image,Modal,Header,Segment,Input,TextArea,Form} from 'semantic-ui-react';
import {Scrollbars} from 'react-custom-scrollbars';
import TimePicker from '../../TimePicker/TimePicker';
import NumberOfMemberSelector from '../../NumberOfMemberSelector/NumberOfMemberSelector';
import ShiftDaySelector from '../../DaySelector/ShiftDaySelector';
import './EmergencyShiftForm.css';

class EmergencyShiftForm extends Component {
  constructor(props){
    super(props);

    this.state = {
      workplace:'',
      position:'',
      shiftDaysSelected:'',
      startTime:'',
      stopTime:'',
      numberOfTeamMembers:'',
      unpaidBreak:'',
      manager:'',
      instructions:'',
      disabledButton:true
    }
    this.onWorkplace=this.onWorkplace.bind(this);
    this.onPosition=this.onPosition.bind(this);
    this.onUnpaidBreak=this.onUnpaidBreak.bind(this);
    this.onInstructions=this.onInstructions.bind(this);
    this.checkSubmitButton=this.checkSubmitButton.bind(this);
  }
  checkSubmitButton(){
    console.log("kjk");
    const { workplace,instructions,unpaidBreak,position}=this.state;
    if(workplace!==''&&instructions!==''&&unpaidBreak!==''&&position!==''){
      console.log('asdad');
      this.setState({disabledButton:false});
    }
  }
  onWorkplace(event){
    this.setState({workplace:event.target.value});
    this.checkSubmitButton();
  }
  onPosition(event){
    this.setState({position:event.target.value});
    this.checkSubmitButton();
  }
  onUnpaidBreak(event){
    this.setState({unpaidBreak:event.target.value});
    this.checkSubmitButton();
  }
  onInstructions(event){
    this.setState({instructions:event.target.value});
    this.checkSubmitButton();

  }
  render() {
    const startDate=moment().format('MM-DD-YYYY');
    return (
      <div>
       <Header as='h1' style={{ textAlign: 'center' , color: '#0022A1',fontSize: '22px' }} >
         EMERGENCY SHIFT
         <Image
           floated="left"
           src="/images/Assets/Icons/Icons/job-deck.png"
           style={{ marginTop:'0px',width:'25px' }}
         />
         <Image
           floated="right"
           src="/images/Assets/Icons/Buttons/delete-round-small.png"
           shape="circular"
           style={{ marginTop:'0px',right:'-11%',width:'35px' }}
           onClick={ this.props.closeFunc }
         />
        </Header>
         <Segment raised style={{ marginTop:'2%' }}>
          <Scrollbars
             style={{ height:'52.0vh',marginBottom:'20px'}} >
          <Form style={{marginLeft:'1%'}}>
            <div>
             <p style={{ fontSize:'18px',letterSpacing:'-1px',color:'#666666',lineHeight:'28px' }}>WORKPLACE</p>
             <Input placeholder="CHAO CENTER" icon={<Icon name="sort" />} style={{ marginTop:'-2%',width:'95%',backgroundColor:'lightgrey' }} onChange={ this.onWorkplace }/>
            </div>
            <div>
             <p style={{ fontSize:'18px',letterSpacing:'-1px',color:'#666666',lineHeight:'28px' }}>POSITION</p>
             <Input placeholder="POSITION" icon={<Icon name="sort" />} style={{ marginTop:'-2%',width:'95%',backgroundColor:'lightgrey' }} onChange={ this.onPosition } />
            </div>
            <div>
             <p style={{ fontSize:'18px',letterSpacing:'-1px',color:'#666666',lineHeight:'28px' }}>SHIFT DATE(S)</p>
             <ShiftDaySelector startDate={ startDate }/>
            </div>
            <div>
              <TimePicker />
            </div>
            <div style={{ marginTop:'32%' }}>
               <p style={{ fontSize:'18px',letterSpacing:'-1px',color:'#666666',lineHeight:'28px' }}>NUMBER OF TEAM MEMBERS</p>
              <NumberOfMemberSelector />
            </div>
           <div style={{ marginTop:'2%' }}>
             <p style={{ fontSize:'18px',letterSpacing:'-1px',color:'#666666',lineHeight:'28px' }}>UNPAID-BREAK</p>
             <Input placeholder="30 MINUTES (SET BY POLICY)" icon={<Icon name="chevron down" />} style={{ marginTop:'-2%',width:'95%',backgroundColor:'lightgrey' }} onChange={ this.onUnpaidBreak }/>
           </div>
           <div>
             <p style={{ fontSize:'18px',letterSpacing:'-1px',color:'#666666',lineHeight:'28px' }}><span style={{color:'#0022A1'}}>Maximum</span> INCENTIVE BONUS PER HOUR</p>
             <Input placeholder="$0.00" icon={<Icon name="sort" />} style={{ marginTop:'-2%',width:'95%',backgroundColor:'lightgrey' }} disabled />
           </div>
           <div>
             <p style={{ fontSize:'18px',letterSpacing:'-1px',color:'#666666',lineHeight:'28px' }}>INSTRUCTIONS - <span style={{color:'RED'}}>OPTIONAL</span></p>
             <TextArea rows={3} style={{ width:'95%' }} placeholder='ENTER ADDITIONAL INFORMATION ABOUT THE SHIFT' onChange={ this.onInstructions } />
           </div>

          </Form>
        </Scrollbars>
      </Segment>
      <div>
         <Image
           disabled={ this.state.disabledButton }
           centered
           src="/images/Assets/Icons/Buttons/emergency-shift.png"
           shape="circular"
           width="22%"
         />
      </div>
    </div>
    );
  }
}
export default EmergencyShiftForm;
