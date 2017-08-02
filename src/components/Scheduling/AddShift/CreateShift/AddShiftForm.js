import React,{Component} from 'react';
import { gql, graphql, compose } from 'react-apollo';
import uuidv1 from 'uuid/v1';
import {Header,Image,Button,Divider,Segment, Modal, Label,Dropdown,Input,Icon,Form,TextArea,Loader} from 'semantic-ui-react';
import {Scrollbars} from 'react-custom-scrollbars';
import ReactScrollbar from 'react-scrollbar-js';
import moment from 'moment';
import ShiftDaySelector from '../../../DaySelector/ShiftDaySelector.js';
import TimePicker from '../../../TimePicker/TimePicker.js';
import NumberOfTeamMembers from './NumberOfTeamMembers';
import PositionSelectOption from '../../../Position/Position.js';
import ToggleButton from './ToggleButton';
import ManagerSelectOption from './ManagerSelectOption';
import PositionSelector  from './positionSelector'
import WorkplaceSelector  from './workplaceSelector'
import '../styles.css';

export class AddShiftForm extends Component{
 static propTypes = {
  router: React.PropTypes.object.isRequired,
  createShift: React.PropTypes.func.isRequired,
  updateShift: React.PropTypes.func.isRequired,
  createWeekPublished: React.PropTypes.func.isRequired
}

  constructor(props){
    super(props);
    this.state = {
      workplace: '',
      position:'',
      shiftDaysSelected:'',
      startTime:'',
      stopTime:'',
      numberOfTeamMembers:'',
      unpaidBreak:'',
      managerValue: null,
      instructions:'',
      jobShadowingOppurtunity:'',
      weekPublishedId:'',
      loading: false
    }

    this.onWorkplace=this.onWorkplace.bind(this);
    this.onUnpaidBreak=this.onUnpaidBreak.bind(this);
    this.onInstructions=this.onInstructions.bind(this);
    this.updateFormState=this.updateFormState.bind(this);
    this.handleCloseFunc=this.handleCloseFunc.bind(this);
    this.handleSave=this.handleSave.bind(this);
    this.saveShift=this.saveShift.bind(this);
    this.formatDays=this.formatDays.bind(this);
  }
  
  onWorkplace(event){
    this.setState({workplace:event.target.value})
  }

  onUnpaidBreak(event){
    this.setState({unpaidBreak:event.target.value});
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

  saveShift(startTime, endTime, weekPublishedId){
      this.props.createShift({
          variables: { data: 
                  {shift:
                    { id: uuidv1(), workplaceId: this.state.workplace, 
                      positionId: this.state.position, workersRequestedNum: this.state.numberOfTeamMembers,
                      creatorId: "5a01782c-c220-4927-b059-f4f22d01c230", 
                      managersOnShift: this.state.managerValue,
                      startTime: startTime, endTime: endTime, 
                      shiftDateCreated: moment().format(), weekPublishedId: weekPublishedId}} },
                updateQueries: {
                    allShiftsByWeeksPublished: (previousQueryResult, { mutationResult }) => {
                      const shiftHash = mutationResult.data.createShift.shift;
                      previousQueryResult.allShifts.edges = 
                      [...previousQueryResult.allShifts.edges, {"node": shiftHash, '__typename': "ShiftsEdge"}]
                      return {
                        allShifts: previousQueryResult.allShifts
                      };
                    },
                },
              })
              .then(({ data }) => {
                  this.props.closeFunc();
                  console.log('got data', data);
              }).catch((error) => {
                  console.log('there was an error sending the query', error);
              });
  }

  udpateShift(startTime, endTime){
      const shiftPatch = {}
      if (this.state.workplace){
        shiftPatch['workplaceId'] = this.state.workplace
      }

      this.props.updateShift({
          variables: { data: 
                    {id: this.props.data.id, shiftPatch:
                    { shiftPatch }}}
              })
              .then(({ data }) => {
                  this.props.closeFunc();
                  console.log('got update data', data);
              }).catch((error) => {
                  console.log('there was an error sending the query', error);
              });
  }

  formatDays(day){
       // formatting time 
        let startTime = "";
        let endTime = "";
        
        if (this.state.startTime) {
          const start = this.state.startTime.split(":")
          const hour  = start[0]
          const minute = start[1].split(" ")[0]
            if (start[1].split(" ")[1]  == 'pm'){
               hour =  parseInt(hour) + 12
            }
            startTime = moment(day).hour(parseInt(hour)).minute(parseInt(minute))
          }
        if (this.state.stopTime) {
            const stop = this.state.stopTime.split(":")
            const hour  = stop[0]
            const minute = stop[1].split(" ")[0]
            if (stop[1].split(" ")[1]  == 'pm'){
               hour =  parseInt(hour) + 12
            }
            endTime = moment(day).hour(hour).minute(parseInt(minute))
        }
      return [startTime, endTime]
  }
  
  handleSave(){
      this.setState({loading: true})
      if (this.props.editMode) {
          const times = this.formatDays(this.props.startTime)
          this.udpateShift(times[0], times[1]);
      } else {
          const days = Object.keys(this.state.shiftDaysSelected)
          const _this = this
          const brandId = this.props.brandId
          let weekPublishedId = this.props.weekPublishedId

          // get selected week's published ID
          _this.props.data.allWeekPublisheds.edges.map((value,index) => {
            if ((moment(days[0]).isAfter(moment(value.node.start)) && moment(days[0]).isBefore(moment(value.node.end)))
                ||  (moment(days[0]).isSame(moment(value.node.start), 'day'))
                || (moment(days[0]).isSame(moment(value.node.end), 'day'))
                ){
                  weekPublishedId = value.node.id;
              }
          })
          
          // if it doesn't exist create and then create shifts
          if(!weekPublishedId) {
             weekPublishedId = uuidv1();
             _this.props.createWeekPublished({
                    variables: { data: 
                                    {weekPublished:
                                      { id: weekPublishedId, 
                                        start: moment(days[0]).startOf('week').format(), 
                                        end: moment(days[0]).endOf('week').format(),
                                        published: false, datePublished: moment().format(),
                                        brandId: brandId }
                                }},
               /*     updateQueries: {
                        allShiftsByWeeksPublished: (previousQueryResult, { mutationResult }) => {
                          const returnHash = {};
                          const weekPublishedHash = mutationResult.data.createWeekPublished.weekPublished;
                          weekPublishedHash['__typename'] = "WeekPublished"
                          returnHash['nodes'] = [ weekPublishedHash ]
                          returnHash['__typename'] = "WeekPublishedByDateConnection"
                          return {
                            weekPublishedByDate: returnHash
                          };
                        },
                    },*/
                })
                .then(({ data }) => {
                     days.forEach(function(day){
                        const times = _this.formatDays(day)
                        _this.saveShift(times[0], times[1], weekPublishedId);
                      })
                  }).catch((error) => {
                      console.log('there was an error sending the query', error);
                  });

            }
            // else create all shifts with existing week published
            else {
                days.forEach(function(day){
                  const times = _this.formatDays(day)
                  _this.saveShift(times[0], times[1], weekPublishedId);
                })
            }
      }
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
    const data = this.props.data
    let workplace = "";
    let position = "";
    let start = "";
    let end = "";
    let numWorkers = 1;
    if (data){
      if (data.workplaceByWorkplaceId){
        workplace = data.workplaceByWorkplaceId.id
      }
      if (data.positionByPositionId){
        position = data.positionByPositionId.id
      }
      if (data.startTime && data.endTime){
        start = moment(data.startTime).format("hh:mm a")
        end = moment(data.endTime).format("hh:mm a")
      }
      numWorkers = data.workersRequestedNum
    }
    let disabled = false;
    let saveImage = "/images/Assets/Icons/Buttons/save-shift-button.png";
    if (!this.props.editMode){
      saveImage = "/images/Assets/Icons/Buttons/add-shift-button.png";
      disabled = (this.state.workplace==""||this.state.startTime==""||this.state.position==""
             ||this.state.stopTime==""||this.state.numberOfTeamMembers==""||this.state.shiftDaysSelected=="")
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
              <WorkplaceSelector formCallBack={ this.updateFormState } workplace={ workplace }/>
           </div>
           <div style={{marginTop:'15px'}} >
              <PositionSelector formCallBack={ this.updateFormState } position={ position } />
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
               <TimePicker formCallBack={ this.updateFormState } start={ start } stop={ end }/>
            </div>
            <div style={{marginTop: '15px'}} >
               <NumberOfTeamMembers formCallBack={ this.updateFormState }  numRequested={ numWorkers }/>
            </div>
            <div style={{marginTop:'30px', height: '80px', width: '100%'}} >
               <p className="shift-form-title" style={{marginBottom: "0"}}>JOB SHADOWING OPPORTUNITY</p>
               <ToggleButton formCallBack={ this.updateFormState } />
            </div>
            <div style={{marginTop:'15px', height: '80px', width: '100%'}} >
              <p className="shift-form-title">UNPAID-BREAK - <span style={{ color:'RED' }}>OPTIONAL</span></p>
              <Input type="number" min="0" fluid placeholder="0 MINUTES" icon={<Icon name="sort" />} style={{ marginTop:'-2%',backgroundColor:'lightgrey' }} onChange={this.onUnpaidBreak} />
            </div>
            <div style={{marginTop:'10px', height: '80px', width: '100%'}} >
              <p className="shift-form-title">MANAGER - <span style={{ color:'RED' }}>OPTIONAL</span></p>
              <ManagerSelectOption formCallBack={ this.updateFormState } />
            </div>
             <div style={{marginTop:'10px', height: '130px', width: '100%'}} >
              <p className="shift-form-title">INSTRUCTIONS - <span style={{ color:'RED' }}>OPTIONAL</span></p>
              <TextArea rows={3} style={{width:'100%'}} placeholder='ENTER ADDITIONAL INFORMATION ABOUT THE SHIFT' onChange={this.onInstructions} />
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
             disabled={ disabled }
             onClick={this.handleSave}
           />
          </Image.Group>
        </div>
      </div>
    );
  }
}


/*
             <div style={{marginTop:'10px', height: '80px', width: '100%'}} >
              <p className="shift-form-title">MAXIMUM WAGE FOR SHIFT,INCLUDING SURGE WAGE</p>
              <Input type="number" min="0" disabled fluid placeholder="$0.00" icon={<Icon name="sort" />} style={{ marginTop:'-2%',backgroundColor:'lightgrey' }} />
             </div>
*/



const createShiftMutation = gql`
 mutation createShift($data:CreateShiftInput!){
  createShift(input:$data)
  {
    shift{
      id
      startTime
      endTime
      workersInvited
      workersAssigned
      workersRequestedNum
      positionByPositionId{
        positionName
        positionIconUrl
        brandByBrandId {
              brandName
        }
      }
      workplaceByWorkplaceId{
        workplaceName
      }
    }
  }
}`


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
      positionByPositionId{
        positionName
        positionIconUrl
        brandByBrandId {
              brandName
        }
      }
      workplaceByWorkplaceId{
        workplaceName
      }
    }
  }
}`

const createWeekPublishedMutation = gql`
 mutation createWeekPublished($data:CreateWeekPublishedInput!){
  createWeekPublished(input:$data)
    {
    weekPublished{
      id
      shiftsByWeekPublishedId{
          edges {
            node {
              id
            }
        }
      }
    }
  }
}`

const AddShift = compose(
  graphql(createShiftMutation, {
    name : 'createShift'
  }),
  graphql(updateShiftMutation, {
    name : 'updateShift'
  }),
  graphql(createWeekPublishedMutation, {
    name : 'createWeekPublished'
  }))(AddShiftForm)
export default AddShift
