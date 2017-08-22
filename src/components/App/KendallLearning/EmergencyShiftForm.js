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
      instructions:'',
      disabledSubmitButton:true
    }
    this.onWorkplace=this.onWorkplace.bind(this);
    this.onUnpaidBreak=this.onUnpaidBreak.bind(this);
    this.onInstructions=this.onInstructions.bind(this);
    this.checkSubmitButton=this.checkSubmitButton.bind(this);
    this.updateFormState=this.updateFormState.bind(this);
  }
  checkSubmitButton(){
    console.log(this.state);
    const { workplace,instructions,unpaidBreak,position,startTime,stopTime,shiftDaysSelected,numberOfTeamMembers}=this.state;
    if(workplace!==''&&instructions!==''&&unpaidBreak!==''&&position!==''&&startTime!==''&&stopTime!==''&&shiftDaysSelected!==''&&numberOfTeamMembers!==''){
       this.setState({disabledSubmitButton:false});
    }else{
       this.setState({disabledSubmitButton:true});
    }
  }
  onWorkplace(event){
    this.setState({workplace:event.target.value});
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
  updateFormState(dataValue){
    this.setState(dataValue);
    this.checkSubmitButton();
  }
  render() {
    const startDate=moment().format('MM-DD-YYYY');
    return (
      <div>
      <Header as='h1' style={{ textAlign: 'center' , color: '#0022A1',fontSize: '22px' }} >
        <Image
          floated="left"
          src="/images/Assets/Icons/Icons/job-deck.png"
          style={{ marginTop:'-1px',width:'25px' }}
        />
        <p style={{marginLeft:'40%',marginTop:'-1.5%',float:'left'}}>EMERGENCY SHIFT</p>
        <Image
          floated="right"
          src="/images/Assets/Icons/Buttons/delete-round-small.png"
          shape="circular"
          style={{ marginTop:'-0.5%',right:'-11%',width:'37px',float:'right' }}
          onClick={ this.props.closeFunc }
        />
      </Header>
         <Segment raised style={{ marginTop:'2.5%',boxShadow:'inset 0 2px 4px 0 rgba(34,36,38,.12), inset 0 2px 10px 0 rgba(34,36,38,.15)' }}>
          <Scrollbars autoHide autoHeight autoHeightMin='10vh' autoHeightMax='57vh'
             style={{ marginBottom:'20px'}} >
          <Form style={{marginLeft:'1%'}}>
            <div>
             <p style={{ fontSize:'18px',letterSpacing:'-1px',color:'#666666',lineHeight:'28px' }}>WORKPLACE</p>
             <Input disabled fluid placeholder="WORKPLACE" icon={<Icon name="sort" />} style={{ marginTop:'-2%',backgroundColor:'lightgrey' }} onChange={ this.onWorkplace } />
            </div>
            <div>
             <p style={{ fontSize:'18px',letterSpacing:'-1px',color:'#666666',lineHeight:'28px' }}>POSITION</p>
            </div>
            <div>
             <p style={{ fontSize:'18px',letterSpacing:'-1px',color:'#666666',lineHeight:'28px' }}>SHIFT DATE(S)</p>
             <ShiftDaySelector startDate={ startDate } formCallBack={this.updateFormState} />
            </div>
            <div>
              <TimePicker formCallBack={this.updateFormState} />
            </div>
            <div style={{ marginTop:'32%' }}>
               <p style={{ fontSize:'18px',letterSpacing:'-1px',color:'#666666',lineHeight:'28px' }}>NUMBER OF TEAM MEMBERS</p>
              <NumberOfMemberSelector formCallBack={this.updateFormState} />
            </div>
           <div style={{ marginTop:'2%' }}>
             <p style={{ fontSize:'18px',letterSpacing:'-1px',color:'#666666',lineHeight:'28px' }}>UNPAID-BREAK</p>
             <Input fluid placeholder="30 MINUTES (SET BY POLICY)" icon={<Icon name="chevron down" />} style={{ marginTop:'-2%',backgroundColor:'lightgrey' }} onChange={ this.onUnpaidBreak }/>
           </div>
           <div>
             <p style={{ fontSize:'18px',letterSpacing:'-1px',color:'#666666',lineHeight:'28px' }}><span style={{color:'#0022A1'}}>Maximum</span> INCENTIVE BONUS PER HOUR</p>
             <Input placeholder="$0.00" icon={<Icon name="sort" />} style={{ marginTop:'-2%',width:'95%',backgroundColor:'lightgrey' }} disabled />
           </div>
           <div>
             <p style={{ fontSize:'18px',letterSpacing:'-1px',color:'#666666',lineHeight:'28px' }}>INSTRUCTIONS - <span style={{color:'RED'}}>OPTIONAL</span></p>
             <TextArea rows={3} fluid  placeholder='ENTER ADDITIONAL INFORMATION ABOUT THE SHIFT' onChange={ this.onInstructions } />
           </div>

          </Form>
        </Scrollbars>
      </Segment>
      <div>
         <Image
           disabled={ this.state.disabledSubmitButton }
           centered
           src="/images/Assets/Icons/Buttons/emergency-shift.png"
           shape="circular"
           width="20%"
         />
      </div>
    </div>
    );
  }
}
export default EmergencyShiftForm;
