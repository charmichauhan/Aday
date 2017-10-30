import React,{Component} from 'react';
import { gql, graphql, compose } from 'react-apollo';
import uuidv1 from 'uuid/v1';
import {Header,Image,Button,Divider,Segment, Modal, Label,Dropdown,Input,Icon,Form,TextArea,Loader} from 'semantic-ui-react';
import {Scrollbars} from 'react-custom-scrollbars';
import ReactScrollbar from 'react-scrollbar-js';
import moment from 'moment';

import { BASE_API } from '../../../constants';
import ShiftDaySelector from '../../DaySelector/ShiftDaySelector.js';
import TimePicker from '../../TimePicker/TimePicker.js';
import NumberOfTeamMembers from '../AddShift/CreateShift/NumberOfTeamMembers';
import ToggleButton from '../AddShift/CreateShift/ToggleButton';
import ManagerSelectOption from '../AddShift/CreateShift/ManagerSelectOption';
import PositionSelector  from '../AddShift/CreateShift/positionSelector'
import WorkplaceSelector  from '../AddShift/CreateShift/workplaceSelector'
import '../AddShift/CreateShift/styles.css';
var rp = require('request-promise');
var Halogen = require('halogen');

export class UpdateShiftForm extends Component{
 static propTypes = {
  router: React.PropTypes.object.isRequired,
  updateShift: React.PropTypes.func.isRequired,
}

  constructor(props){
    super(props);
    const data = this.props.data
    let manager = null
    if (data.managersOnShift){
      manager = data.managersOnShift[0]
    }

    this.state = {
      workplace: data.workplaceByWorkplaceId.id || '',
      position: data.positionByPositionId.id || '',
      shiftDaysSelected:'',
      startTime: moment(data.startTime).format("hh:mm a") || '',
      stopTime: moment(data.endTime).format("hh:mm a") || '',
      numberOfTeamMembers: data.workersRequestedNum || 0,
      unpaidBreak: data.unpaidBreakTime || 'Enter Time In Minutes',
      managerValue: manager || null,
      instructions: data.instructions,
      jobShadowingOpportunity: data.traineesRequestedNum || 0,
      loading: false
    }

    this.onWorkplace=this.onWorkplace.bind(this);
    this.onUnpaidBreak=this.onUnpaidBreak.bind(this);
    this.onInstructions=this.onInstructions.bind(this);
    this.updateFormState=this.updateFormState.bind(this);
    this.handleCloseFunc=this.handleCloseFunc.bind(this);
    this.handleSave=this.handleSave.bind(this);
    this.formatDays=this.formatDays.bind(this);
    this.onTrainee=this.onTrainee.bind(this);
  }

  onWorkplace(event){
    this.setState({workplace:event.target.value})
  }

  onUnpaidBreak(event){
      const hours = Math.floor(event.target.value / 60)
      let minutes = event.target.value % 60
      if ( minutes < 10 ){
          minutes = 0 + minutes
      }
      const finalTime = hours + ":" + minutes
      this.setState({unpaidBreak: finalTime});
  }

    onTrainee(event){
      if (event.jobShadowingOpportunity){
        this.setState({jobShadowingOpportunity: this.state.numberOfTeamMembers})
      } else {
        this.setState({jobShadowingOpportunity: 0})
      }

    }
    onInstructions(event){
      this.setState({instructions:event.target.value});
    }
    updateFormState(dataValue){
      this.setState(dataValue);
    }
    handleCloseFunc(){
      this.props.closeFunc();
    }

    handleSave(){
        this.setState({loading: true})
        const times = this.formatDays(this.props.data.startTime)
        this.udpateShift(times[0], times[1]);
    }

  udpateShift(startTime, endTime){
      const shiftPatch = {}
        shiftPatch['workplaceId'] = this.state.workplace;
        shiftPatch['positionId'] = this.state.position;
        shiftPatch['startTime'] = moment(startTime).format();
        shiftPatch['endTime'] = moment(endTime).format();
        shiftPatch['workersRequestedNum'] = this.state.numberOfTeamMembers;
        shiftPatch['instructions'] = this.state.instructions;
        shiftPatch['managersOnShift'] = [this.state.managerValue];
        shiftPatch['unpaidBreakTime'] = this.state.unpaidBreak;
        shiftPatch['traineesRequestedNum'] = this.state.jobShadowingOpportunity;

         this.props.updateShift({
          variables: { data:
                    {id: this.props.data.id, shiftPatch: shiftPatch }
                }
              })
              .then(({ data }) => {
                  this.props.closeFunc();
                  console.log('got update data', data);
              }).catch((error) => {
                  console.log('there was an error sending the query', error);
              });

          // only update employees if shift is less than a week away
          /*
          if ((moment(startTime).diff(moment().format(), 'days')) <=7 ){
              var uri = `${BASE_API}/api/updatedCall`
              var options = {
                  uri: uri,
                  method: 'POST',
                  json: {data: {
                      "sec": "QDVPZJk54364gwnviz921",
                        "workersAssigned": this.props.data.workersAssigned,
                        "newWorkplaceId":  this.state.workplace,
                        "shiftDate": moment(startTime).format("Do, MMMM YYYY"),
                        "shiftDateOld": moment(this.props.data.startTime).format("Do, MMMM YYYY"),
                        "shiftLocationOld": this.props.data.workplaceByWorkplaceId.workplaceName,
                        "shiftRoleId": this.state.position,
                        "shiftRoleOld": this.props.data.positionByPositionId.positionName,
                        "shiftAddressOld": this.props.data.workplaceByWorkplaceId.address,
                        "shiftStartHour":  moment(startTime).format("h:mm a"),
                        "shiftStartHourOld":  moment(this.props.data.startTime).format("h:mm a"),
                        "shiftEndHour":  moment(endTime).format("h:mm a"),
                        "shiftEndHourOld":  moment(this.props.data.endTime).format("h:mm a"),
                        "shiftReward": "",
                        "shiftRewardOld": ""
                  }}
              };
              rp(options)
                .then(function(response) {
                }).catch((error) => {
                   console.log('there was an error sending the query for delete cancellation call', error);
                });
          }
          */
  }

  formatDays(day){
       // formatting time
        let startTime = "";
        let endTime = "";

        if (this.state.startTime) {
          const start = this.state.startTime.split(":")
          let hour  = start[0]
          const minute = start[1].split(" ")[0]
            if (start[1].split(" ")[1]  == 'pm'){
              if (hour != 12){
               hour =  parseInt(hour) + 12
              }
            } else if (hour == 12){
                hour = 0
            }
            startTime = moment(day).hour(parseInt(hour)).minute(parseInt(minute))
          }
        if (this.state.stopTime) {
            const stop = this.state.stopTime.split(":")
            let hour  = stop[0]
            const minute = stop[1].split(" ")[0]
            if (stop[1].split(" ")[1]  == 'pm'){
              if (hour != 12){
               hour =  parseInt(hour) + 12
              }
            } else if (hour == 12){
                hour = 0
            }
            endTime = moment(day).hour(hour).minute(parseInt(minute))
        }
      return [startTime, endTime]
    }

    render(){
      const header = (
        <Header as='h1' style={{ textAlign: 'center' , color: '#0022A1', fontSize: '22px', marginTop: '10px', height: "40px"}} >
        <div style={{width: '33%', float: 'left'}}>
          <Image
            src="/images/Assets/Icons/Icons/job-deck.png"
            style={{ width:'30px', marginLeft: '10px'}}
          />
        </div>
        { !this.props.editMode &&
         <div style={{width: '33%', float: 'left'}}>
            ADD SHIFT
         </div>
        }
        { this.props.editMode &&
         <div style={{width: '33%', float: 'left'}}>
            EDIT SHIFT
         </div>
        }
        <div style={{width: '33%', float: 'left'}}>
        <Image
          src="/images/Assets/Icons/Buttons/delete-round-small.png"
          shape="circular"
          onClick={ this.handleCloseFunc }
          style={{marginLeft: '250px', width:'45px' }}
        />
        </div>
      </Header>
        )

    const date=moment();
    const startDate=this.props.start
    const pastDate = date.diff(this.props.data.startTime) > 0;
    const data = this.props.data

    let saveImage = "/images/Assets/Icons/Buttons/save-shift-button.png";

    if(this.state.loading){
      return(
        <div>
          { header }
          <Form>
            <div className="outside-add-shift">
             <div className="inside-add-shift">
              <div><Halogen.SyncLoader color='#00A863'/></div>
              </div>
             </div>
          </Form>
        </div>
      )
    }
    let trainees = false;
    if (this.state.jobShadowingOpportunity > 0){
        trainees = true;
    }

    return(
      <div>
        { header }
        <Form>
          <div className="outside-add-shift">
           <div className="inside-add-shift">
           <div>
           <div>
              <p className="shift-form-title">WORKPLACE</p>
              <WorkplaceSelector formCallBack={ this.updateFormState } workplace={ this.state.workplace }/>
           </div>
           <div style={{marginTop:'15px'}} >
              <PositionSelector formCallBack={ this.updateFormState } workplaceId={ this.state.workplace } position={ this.state.position } />
            </div>
              {!this.props.editMode && (
                   <div style={{marginTop:'30px'}} >
                  <p className="shift-form-title">SHIFT DAY(S) OF THE WEEK</p>
                  <ShiftDaySelector startDate={startDate} formCallBack={ this.updateFormState } />
                  </div>
                  ) }

              { this.props.editMode && ( <div style={{marginTop:'30px'}} >
                      <p className="shift-form-title"> This Shift Is On { moment(this.props.data.startTime).format("dddd MMMM Do, YYYY") } </p>
                    </div>
                    )
              }
            <div style={{marginTop:'15px'}} >
               <TimePicker formCallBack={ this.updateFormState } start={ this.state.startTime } stop={ this.state.stopTime}/>
            </div>
            <div style={{marginTop: '15px'}} >
               <NumberOfTeamMembers formCallBack={ this.updateFormState }  numRequested={ this.state.numberOfTeamMembers }/>
            </div>
            <div style={{marginTop:'30px', height: '80px', width: '100%'}} >
               <p className="shift-form-title" style={{marginBottom: "0"}}>JOB SHADOWING OPPORTUNITY</p>
               <ToggleButton formCallBack={ this.onTrainee } trainees={ trainees }/>
            </div>
            <div style={{marginTop:'15px', height: '80px', width: '100%'}} >
              <p className="shift-form-title">UNPAID-BREAK- <span style={{ color:'RED' }}>OPTIONAL</span></p>
              <Input type="number" min="0" fluid placeholder={data.unpaidBreakTime} icon={<Icon name="sort" />} style={{ marginTop:'-2%',backgroundColor:'lightgrey' }} onChange={this.onUnpaidBreak} />
            </div>
            <div style={{marginTop:'10px', height: '80px', width: '100%'}} >
              <p className="shift-form-title">MANAGER - <span style={{ color:'RED' }}>OPTIONAL</span></p>
              <ManagerSelectOption formCallBack={ this.updateFormState } manager={ this.state.managerValue }/>
            </div>
             <div style={{marginTop:'10px', height: '130px', width: '100%'}} >
              <p className="shift-form-title">INSTRUCTIONS - <span style={{ color:'RED' }}>OPTIONAL</span></p>
              <TextArea rows={3} style={{width:'100%'}} value={ this.state.instructions } onChange={this.onInstructions} />
             </div>
             </div>
             </div>
             </div>
            </Form>
         <div>
          <Image.Group style={{ marginLeft:'36%',float:'left',marginBottom:'4px'}}>
           <Image
             src="/images/Assets/Icons/Buttons/cancel-shift.png"
             shape="circular"
             width="42%"
             onClick={ this.handleCloseFunc }
           />
           <Image
              src={ saveImage }
              shape="circular"
              width="42%"
              onClick={() => {if(!pastDate){this.handleSave()}}}
           />
          </Image.Group>
        </div>
      </div>
    );
  }
}


const updateShiftMutation = gql`
  mutation updateShiftById($data:UpdateShiftByIdInput!){
    updateShiftById(input:$data)
    {
      shift{
        id
        startTime
        endTime
        workersInvited
        workersAssigned
        workersRequestedNum
        instructions
        traineesRequestedNum
        managersOnShift
        unpaidBreakTime
        recurringShiftId
        positionByPositionId{
          id
          positionName
          positionIconUrl
          brandByBrandId {
            id
            brandName
          }
        }
        workplaceByWorkplaceId{
          id
          workplaceName
        }
      }
    }
  }`;

const UpdateShift = graphql(updateShiftMutation,
  { name: 'updateShift' })(UpdateShiftForm);

export default UpdateShift;
