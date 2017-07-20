import React,{Component} from 'react';
import {Header,Image,Button,Divider,Segment,Label,Input,Icon,Form,TextArea} from 'semantic-ui-react';
import {Scrollbars} from 'react-custom-scrollbars';
import moment from 'moment';
import ShiftDaySelector from '../../../DaySelector/ShiftDaySelector.js';
import TimePicker from '../../../TimePicker/TimePicker.js';
import NumberOfTeamMembers from './NumberOfTeamMembers';
import ToggleButton from './ToggleButton';
import ManagerSelectOption from './ManagerSelectOption';

export default class AddShiftForm extends Component{
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
      disabledSubmitButton:true
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
      this.setState({disabledSubmitButton:false});
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

  render(){

    const date=moment();
    const startDate=moment(date).startOf('week').isoWeekday(7).format('MM-DD-YYYY');
    console.log(startDate);

    return(
      <div>
      <Header as='h1' style={{ textAlign: 'center' , color: '#0022A1',fontSize: '22px' }} >
        ADD SHIFT
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
          style={{ height:'52vh',marginBottom:'20px' }} >
           <Form style={{ marginLeft:'1%'}} >
            <div>
              <p style={{ fontSize:'18px',letterSpacing:'-1px',color:'#666666',lineHeight:'28px' }}>WORKPLACE</p>
              <Input fluid placeholder="CHAO CENTER" icon={<Icon name="sort" />} style={{ marginTop:'-2%',backgroundColor:'lightgrey' }} onChange={this.onWorkplace} />
            </div>
            <div>
              <p style={{ fontSize:'18px',letterSpacing:'-1px',color:'#666666',lineHeight:'28px' }}>POSITION</p>
              <Input fluid placeholder="SELECT POSITION" icon={<Icon name="sort" />} style={{ marginTop:'-2%',backgroundColor:'lightgrey' }} onChange={this.onPosition} />
            </div>
            <div>
             <p style={{ fontSize:'18px',letterSpacing:'-1px',color:'#666666',lineHeight:'28px' }}>SHIFT DAY(S) OF THE WEEK</p>
               <ShiftDaySelector startDate={startDate} />
            </div>
            <div>
               <TimePicker />
            </div>
            <div style={{ marginTop:'32%' }}>
               <NumberOfTeamMembers />
            </div>
            <div>
               <p style={{ fontSize:'18px',letterSpacing:'-1px',color:'#666666',lineHeight:'28px' }}>JOB SHADOWING OPPORTUNITY</p>
               <ToggleButton />
            </div>
            <div style={{ marginTop:'7%' }}>
              <p style={{ fontSize:'18px',letterSpacing:'-1px',color:'#666666',lineHeight:'28px' }}>UNPAID-BREAK</p>
              <Input fluid placeholder="30 MINUTES" icon={<Icon name="sort" />} style={{ marginTop:'-2%',backgroundColor:'lightgrey' }} onChange={this.onUnpaidBreak} />
            </div>
            <div style={{ marginTop:'2%' }}>
              <p style={{ fontSize:'18px',letterSpacing:'-1px',color:'#666666',lineHeight:'28px' }}>MANAGER-OPTIONAL</p>
              <ManagerSelectOption />
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
          <Image.Group style={{ marginLeft:'33%',float:'left' }}>
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
