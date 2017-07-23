import React,{Component} from 'react';
import {Header,Image,Button,Divider,Segment,Label,Input,Icon,Form,TextArea} from 'semantic-ui-react';
import {Scrollbars} from 'react-custom-scrollbars';
import ReactScrollbar from 'react-scrollbar-js';
import moment from 'moment';
import ShiftDaySelector from '../../../DaySelector/ShiftDaySelector.js';
import TimePicker from '../../../TimePicker/TimePicker.js';
import NumberOfTeamMembers from './NumberOfTeamMembers';
import PositionSelectOption from '../../../Position/Position.js';
import ToggleButton from './ToggleButton';
import ManagerSelectOption from './ManagerSelectOption';

export default class AddShiftForm extends Component{
  constructor(props){
    super(props);

    this.state = {
      position:'',
      shiftDaysSelected:'',
      startTime:'',
      stopTime:'',
      numberOfTeamMembers:'',
      unpaidBreak:'',
      managerValue:'',
      instructions:'',
      jobShadowingOppurtunity:'',
      disabledSubmitButton:true
    }
    this.onUnpaidBreak=this.onUnpaidBreak.bind(this);
    this.onInstructions=this.onInstructions.bind(this);
    this.checkSubmitButton=this.checkSubmitButton.bind(this);
    this.updateFormState=this.updateFormState.bind(this);
    this.handleCloseFunc=this.handleCloseFunc.bind(this);
  }
  checkSubmitButton(){
    console.log(this.state);
    const {instructions,unpaidBreak,position,shiftDaysSelected,startTime,stopTime,managerValue,numberOfTeamMembers,}=this.state;
    if(startTime!==''&&instructions!==''&&unpaidBreak!==''&&position!==''&&stopTime!==''&&managerValue!==''&&numberOfTeamMembers!==''&&shiftDaysSelected!==''){
       this.setState({disabledSubmitButton:false});
    }
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
  handleCloseFunc(){
    this.props.closeFunc();
    this.props.closeAddFun();
  }

    render(){

    const date=moment();
    const startDate=moment(date).startOf('week').isoWeekday(7).format('MM-DD-YYYY');

    return(
      <div>
      <Header as='h1' style={{ textAlign: 'center' , color: '#0022A1',fontSize: '22px' }} >
        <Image
          floated="left"
          src="/images/Assets/Icons/Icons/job-deck.png"
          style={{ marginTop:'-1px',width:'25px' }}
        />
        <p style={{marginLeft:'44%',marginTop:'-1.5%',float:'left'}}>ADD SHIFT</p>
        <Image
          floated="right"
          src="/images/Assets/Icons/Buttons/delete-round-small.png"
          shape="circular"
          style={{ marginTop:'-0.5%',right:'-11%',width:'37px',float:'right' }}
          onClick={ this.handleCloseFunc }
        />
      </Header>
      <Segment raised style={{ marginTop:'2.5%' }}>
       <Scrollbars autoHeight autoHeightMin='10vh' autoHeightMax='57vh'
          style={{marginBottom:'20px' }} >
           <Form style={{ marginLeft:'1%'}} >
            <div>
              <p style={{ fontSize:'18px',letterSpacing:'-1px',color:'#666666',lineHeight:'28px' }}>POSITION</p>
              <PositionSelectOption formCallBack={ this.updateFormState } />
            </div>
            <div>
             <p style={{ fontSize:'18px',letterSpacing:'-1px',color:'#666666',lineHeight:'28px' }}>SHIFT DAY(S) OF THE WEEK</p>
               <ShiftDaySelector startDate={startDate} formCallBack={ this.updateFormState } />
            </div>
            <div>
               <TimePicker formCallBack={ this.updateFormState } />
            </div>
            <div style={{ marginTop:'32%' }}>
               <NumberOfTeamMembers formCallBack={ this.updateFormState } />
            </div>
            <div>
               <p style={{ fontSize:'18px',letterSpacing:'-1px',color:'#666666',lineHeight:'28px' }}>JOB SHADOWING OPPORTUNITY</p>
               <ToggleButton formCallBack={ this.updateFormState } />
            </div>
            <div style={{ marginTop:'7%' }}>
              <p style={{ fontSize:'18px',letterSpacing:'-1px',color:'#666666',lineHeight:'28px' }}>UNPAID-BREAK</p>
              <Input fluid placeholder="30 MINUTES" icon={<Icon name="sort" />} style={{ marginTop:'-2%',backgroundColor:'lightgrey' }} onChange={this.onUnpaidBreak} />
            </div>
            <div style={{ marginTop:'2%' }}>
              <p style={{ fontSize:'18px',letterSpacing:'-1px',color:'#666666',lineHeight:'28px' }}>MANAGER-OPTIONAL</p>
              <ManagerSelectOption formCallBack={ this.updateFormState } />
            </div>
            <div>
              <p style={{ fontSize:'18px',letterSpacing:'-1px',color:'#666666',lineHeight:'28px' }}>MAXIMUM WAGE FOR SHIFT,INCLUDING SURGE WAGE</p>
              <Input disabled fluid placeholder="$0.00" icon={<Icon name="sort" />} style={{ marginTop:'-2%',backgroundColor:'lightgrey' }} />
             </div>
             <div>
              <p style={{  fontSize:'18px',letterSpacing:'-1px',color:'#666666',lineHeight:'28px' }}>INSTRUCTIONS - <span style={{ color:'RED' }}>OPTIONAL</span></p>
              <TextArea rows={3} style={{ width:'95%' }} placeholder='ENTER ADDITIONAL INFORMATION ABOUT THE SHIFT' onChange={this.onInstructions} />
             </div>
            </Form>
           </Scrollbars>
          </Segment>
         <div>
          <Image.Group style={{ marginLeft:'36%',float:'left',marginBottom:'4px'}}>
           <Image
             src="/images/Assets/Icons/Buttons/cancel-shift.png"
             shape="circular"
             width="42%"
           />
           <Image
             src="/images/Assets/Icons/Buttons/add-shift.png"
             shape="circular"
             width="42%"
             disabled={this.state.disabledSubmitButton}
           />
          </Image.Group>
        </div>
      </div>
    );
  }
}
