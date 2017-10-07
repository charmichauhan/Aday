import React, { Component } from 'react';
import Drawer from 'material-ui/Drawer';
import IconButton from 'material-ui/IconButton';
import RaisedButton from 'material-ui/RaisedButton';
import moment from 'moment';
import { Image, TextArea, Dropdown, Grid, Button } from 'semantic-ui-react';
import { withApollo } from 'react-apollo';

import { closeButton } from '../../../styles';
import Loading from '../../../helpers/Loading';
import CircleButton from '../../../helpers/CircleButton';
import TeamMemberCard from '../../../Scheduling/ShiftWeekTable/ShiftEdit/TeamMemberCard';
import dataHelper from '../../../helpers/common/dataHelper';
import NumberOfTeamMembers from '../../../Scheduling/AddShift/CreateShift/NumberOfTeamMembers';
import UnpaidBreakInMinutes from '../../../Scheduling/AddShift/CreateShift/UnpaidBreakInMinutes';
import CreateShiftHelper from '../../../Scheduling/AddShift/CreateShift/CreateShiftHelper';
import StartToEndTimePicker from '../../../Scheduling/AddShift/CreateShift/StartToEndTimePicker';
import ShiftDaySelector from '../../../DaySelector/ShiftDaySelector.js';
import StartToEndDatePicker from '../../../Scheduling/AddShift/CreateShift/StartToEndDatePicker';

import { Tooltip } from 'rebass';

const initialState = {
  shift: {
    shiftMethod: 'standard',
    recurringShift: 0,
    unpaidBreakInMinutes: 0,
    tags: [],
    tagOptions: [],
    brandId: localStorage.getItem('brandId') || '',
    corporationId: localStorage.getItem('corporationId') || '',
    workplaceId: localStorage.getItem('workplaceId') || '',
    numberOfTeamMembers: 0,
    startTime:  null,
    endTime: null,
    startDate: null,
    endDate: null,
    teamMembers: [], 
    instructions: ""
  },
  shiftErrors: {},
  brandId: localStorage.getItem('brandId') || '',
  corporationId: localStorage.getItem('corporationId') || '',
  workplaceId: localStorage.getItem('workplaceId') || ''
};

const unassignedTeamMember = {
   id: 0,
   firstName: 'Automated Shift',
   lastName: '',
   avatarUrl: 'https://s3.us-east-2.amazonaws.com/aday-website/icons/time-lapse-red.png',
   content: 'Assign shift to override automation',
   status: 'unassigned'
 };
 

class DrawerHelper extends Component {

  constructor(props) {
    super(props);
    const workplaceId = localStorage.getItem("workplaceId");
    const brandId = props.shift && props.shift.positionByPositionId && props.shift.positionByPositionId.brandByBrandId && props.shift.positionByPositionId.brandByBrandId.id;
    const positionId =  props.shift && props.shift.positionByPositionId && props.shift.positionByPositionId.id;
    
    let dayHash = {}
    let weekStart = moment().startOf("week")
    for(let i = 0; i <= 6; i++) {
      dayHash[moment(weekStart).day(i).format("dddd").toUpperCase()] = moment(weekStart).day(i).format('MM-DD-YYYY')
    }
    
    let shiftDaysSelected = []
    if ( props.shift.days ){
      props.shift.days.map(function(d,i){
        shiftDaysSelected.push(dayHash[d])
      })
    }

    let teamMembers = []
    if (this.props.shift.recurringShiftAssigneesByRecurringShiftId){
      this.props.shift.recurringShiftAssigneesByRecurringShiftId.edges.map(function(t,v){
          let teamMember = {
             id: t.node.userId,
             firstName: t.node.userByUserId.firstName,
             lastName: t.node.userByUserId.lastName,
             avatarUrl: t.node.userByUserId.avatarUrl,
             content: 'shift assigned to ' + t.node.userByUserId.firstName + " " + t.node.userByUserId.lastName,
             status: 'accepted'
          };
            teamMembers.push(teamMember);
      })
    }


    let shiftStart = ""
    let shiftEnd = ""

    if (this.props.shift && this.props.shift.startTime){
      let start = this.props.shift.startTime.split(":")
      let end =  this.props.shift.endTime.split(":")
      shiftStart = moment().hour(parseInt(start[0])).minute(parseInt(start[1])) 
      shiftEnd = moment().hour(parseInt(end[0])).minute(parseInt(end[1]))
    }
    props.shift.unpaidBreakTime
    this.state = {
      ...initialState,
      shift: {
        ...initialState.shift,
        ...props.shift,
        numberOfTeamMembers: props.shift && props.shift.workerCount || 0,
        startTime:  shiftStart,
        endTime: shiftEnd,
        startDate: props.shift && moment(props.shift.startDate) || "",
        endDate: props.shift && moment(props.shift.endDate) || null,
        advance: { allowShadowing: true },
        teamMembers: teamMembers, 
        workplaceId,
        brandId,
        positionId,
        instructions: props.shift.instructions || ""
      },
      edit: this.props.edit,
      selectedDate: shiftDaysSelected || "",
      weekStart: props.weekStart,
      workplaceId,
      brandId,
      positionId,
      users: []
    };
  }

  componentWillMount() {
    this.validateShift(this.state.shift);
  }

  componentDidMount() {
    this.getWorkplaces();
    this.getPositions();
    this.getUsers();
  }

  getUsers = () => {
     dataHelper.getUsers()
       .then(users => this.setState({ users }))
        .catch(err => console.error(err));
    };

  componentWillReceiveProps(nextProps) {

    if (nextProps.open !== this.props.open) {
      this.setState((state) => ({
        shift: {
          ...state.shift,
          advance: nextProps.shift.advance
        }
      }));
    }

    if (nextProps.open !== this.props.open) {
         this.setState((state) => ({
           shift: {
             ...state.shift,
             advance: nextProps.shift.advance
           }
         }));
     } else {
       if (nextProps.open !== this.props.open) {
         this.setState((state) => ({
           shift: {
            ...initialState.shift,
             ...nextProps.shift
           }
         }));
       }
    }
  }

  getWorkplaces = () => {
    dataHelper.getCurrentWorkplaces()
      .then((workplaces) => this.setState({ workplaces }))
      .catch(err => console.error(err));
  };


  getPositions = (workplaceId = this.state.shift.workplaceId) => {
    if (workplaceId) {
      CreateShiftHelper.getRelevantPositions(workplaceId)
        .then((positions) => this.setState({ positions }))
        .catch(err => console.error(err));
    }
  };

  handleChange = (event) => {
    const { shift } = this.state;
    const { name, value } = event.target;
    shift[name] = value;
    if (name === 'tags') shift.tagOptions = shift.tags.map((text) => ({ text, value: text, key: text }));
    this.setState({ shift });
    if (name === 'workplaceId') this.getPositions(value);
    this.validateShift(shift);
  };

  handleAddTeamMember = () => {
     const { shift } = this.state;
     if (!shift.teamMembers) shift.teamMembers = [];
       shift.teamMembers.push(unassignedTeamMember);
      this.setState({ shift });
  };

  handleNowSelect = () => {
    this.setState({ selectedDate: moment().format('MM-DD-YYYY') });
  };

  handleShiftSubmit = (shift) => {
    const { handleSubmit } = this.props;
    if (handleSubmit) handleSubmit(shift, this.props.recurringId);
    this.setState(initialState);
  };

  updateFormState = (dataValue) => {
    let selectedDate = this.state.selectedDate;
    if (dataValue.unpaidBreakInMinutes) {
      const hours = Math.floor(dataValue.unpaidBreakInMinutes / 60);
      let minutes = dataValue.unpaidBreakInMinutes % 60;
      if (minutes < 10) {
        minutes = '0' + minutes;
      }
      dataValue.unpaidBreak = hours + ':' + minutes;
    }
    if (dataValue.shiftDaysSelected) selectedDate = '';
    const shift = Object.assign(this.state.shift, dataValue);
    this.setState({ shift, selectedDate });
    this.validateShift(shift);
  };

  closeShiftDrawer = () => {
    const { closeDrawer } = this.props;
     this.setState({ ...initialState, isShiftInvalid: true }, () => {
      if (closeDrawer) closeDrawer();
     });
   };

  borderColor = status => {
     if (status === 'accepted') return 'green';
     if (status === 'unassigned') return 'red';
     if (status === 'pending') return 'orange';
     return 'orange';
   };
 
   removeTeamMember = (i) => {
     const { teamMembers } = this.state.shift;
     teamMembers.splice(i, 1);
     this.setState((state) => ({ shift: { ...state.shift, teamMembers } }));
   };
 
    setTeamMember = (user, index) => {
     const { teamMembers } = this.state.shift;
     if (user.id) {
       teamMembers[index] = {
         ...teamMembers[index],
         ...user,
         content: '',
         status: 'accepted'
       }
     } else {
       teamMembers[index] = { ...unassignedTeamMember };
     }
     this.setState((state) => ({ shift: { ...state.shift, teamMembers } }));
    };

  validateShift = (shift) => {
    let shiftErrors = {};
    if (!shift.workplaceId) shiftErrors['workplaceId'] = true;
    if (!shift.brandId) shiftErrors['brandId'] = true;
    if (!shift.corporationId) shiftErrors['corporationId'] = true;
    if (!shift.positionId) shiftErrors['positionId'] = true;
    if (!shift.startTime) shiftErrors['startTime'] = true;
    if (!shift.endTime) shiftErrors['endTime'] = true;
    if (!shift.numberOfTeamMembers) shiftErrors['NumberOfTeamMembers'] = true;
    this.setState({ shiftErrors });
  };

  isShiftValid = () => {
    const { shiftErrors } = this.state;
    return Object.keys(shiftErrors).length > 0;
  };

  render() {

    const { width, open, handleAdvance } = this.props;
    const { shift, workplaces, users, positions, workplaceId, isEdit, isShiftInvalid } = this.state;
    let positionOptions = [{ key: 'select', value: 0, text: 'SELECT WORKPLACE TO SEE AVAILABLE POSITIONS' }];
   
    if (!workplaces) {
      return (<Loading />);
    }

    const workplaceOptions = workplaces.map(workplace => ({
      key: workplace.id,
      value: workplace.id,
      text: workplace.workplaceName,
      selected: this.state.shift.workplaceId === workplace.id
    }));
    if (positions) {
      positionOptions = positions.map(position => ({
        key: position.id,
        value: position.id,
        text: position.positionName
      }));
      positionOptions.unshift({
        key: 'selected',
        value: 0,
        text: 'CHOOSE POSITION',
        disabled: true
      });
    }
    if (!workplaceId) {
      workplaceOptions.unshift({
        key: 'selected',
        value: 0,
        text: 'CHOOSE WORKPLACE',
        disabled: true
      });
    }
    const recurringOptions = [{
      key: 'select',
      value: 0,
      text: 'SELECT WHETHER TO REPEAT SHIFT.',
      disabled: true,
      selected: true
    }, {
      key: 'none',
      value: 'none',
      text: 'NO',
    }, {
      key: 'weekly',
      value: 'weekly',
      text: 'YES',
    }];

    const teamMembers = {
      total: (shift.numberOfTeamMembers * (shift.advance && shift.advance.allowShadowing && 2 || 1)),
      trainers: shift.numberOfTeamMembers,
      shadowers: shift.advance && shift.advance.allowShadowing && shift.numberOfTeamMembers || ""
    };
    const isAddTeamMemberDisabled = !localStorage.getItem("isUnion") || shift.teamMembers && shift.teamMembers.length >= shift.numberOfTeamMembers;
    
    let buttonTitle = this.props.edit? "Edit Shifts" : "Create Shifts"


    return (
      <Drawer
        width={width}
        openSecondary={true}
        docked={false}
        className="shift-section"
        onRequestChange={this.closeShiftDrawer} open={open}>
        <div className="drawer-section edit-drawer-section">
          <div className="drawer-heading col-md-12" style={{
            display: 'flex',
            flexDirection: 'row',
            backgroundColor: 'ghostwhite',
            borderBottom: '1px solid #DCDCDC'
          }}>

            <div style={{ flex: 3, alignSelf: 'center', marginLeft: 5 }}>
              <IconButton className="pull-left" style={closeButton} onClick={this.closeShiftDrawer}>
                <Image src='/images/Icons_Red_Cross.png' size="mini" />
              </IconButton>
            </div>

            <div style={{ flex: 10, alignSelf: 'center' }}>
             {this.state.edit? <span className="drawer-title">Edit Repeating Shift</span> : <span className="drawer-title"> Create Repeating Shift</span> }
            </div>
            { this.state.recurring? "" :
            <div style={{ flex: 3, alignSelf: 'center' }}>
            </div>
            }
          </div>

          <div className="col-md-12 form-div edit-drawer-content">
            <Grid columns={2}>
              <Grid.Row>
                <Grid.Column width={2} style={{ marginLeft: -5, paddingTop: 5 }}>
                  <Image src="/assets/Icons/scheduling-method.png" style={{ width: 28, height: 'auto' }}
                         className="display-inline" />
                </Grid.Column>
                <Grid.Column width={14} style={{ marginLeft: -20 }}>
                  <label className="text-uppercase blue-heading">Scheduling Method</label>
                  <Dropdown
                    name="method"
                    value='standard'
                    style={{ cursor: 'not-allowed' }}
                    fluid
                    selection
                    disabled
                    options={[{ key: 'standard', value: 'standard', text: 'STANDARD' }]} />
                </Grid.Column>
              </Grid.Row>

              <Grid.Row>
                <Grid.Column width={2} style={{ marginLeft: -5, paddingTop: 5 }}>
                  <Image src="/assets/Icons/workplace.png" style={{ width: 26, height: 'auto' }}
                         className="display-inline" />
                </Grid.Column>
                <Grid.Column width={14} style={{ marginLeft: -20 }}>
                  <label className="text-uppercase blue-heading">Workplace</label>
                  <Tooltip className="tooltip-message"
                      text=' &nbsp; This is the workplace selected in the main sidebar. &nbsp;'>
                  <Dropdown
                    name="workplaceId"
                    onChange={(_, data) => this.handleChange({ target: data })}
                    value={shift.workplaceId || 0}
                    fluid
                    selection
                    disabled
                    options={workplaceOptions} />
                    </Tooltip>
                </Grid.Column>
              </Grid.Row>

              <Grid.Row>
                <Grid.Column width={2} style={{ marginLeft: -5, paddingTop: 5 }}>
                  <Image src="/assets/Icons/certification.png" style={{ width: 25, height: 'auto' }}
                         className="display-inline" />
                </Grid.Column>
                <Grid.Column width={14} style={{ marginLeft: -20 }}>
                  <label className="text-uppercase blue-heading">Position</label>
                  <Dropdown
                    placeholder="Select Position"
                    name="positionId"
                    onChange={(_, data) => this.handleChange({ target: data })}
                    value={shift.positionId || 0}
                    fluid
                    selection
                    disabled={!positions}
                    options={positionOptions} />
                </Grid.Column>
              </Grid.Row>


              <Grid.Row>
                <Grid.Column width={2} style={{ marginLeft: -5, paddingTop: 5 }}>
                  <Image src="/assets/Icons/repeating-shifts.png" style={{ width: 36, height: 'auto' }}
                         className="display-inline" />
                </Grid.Column>
                <Grid.Column width={14} style={{ marginLeft: -20 }}>
                  <label className="text-uppercase blue-heading">Repeat Shift Weekly</label>
                  <Tooltip className="tooltip-message"
                      text=' &nbsp; A repeating shift must repeat weekly. &nbsp;'>
                    <Dropdown
                    name="recurringShift"
                    onChange={(_, data) => this.handleChange({ target: data })}
                    value={'weekly'}
                    fluid
                    selection
                    disabled
                    options={recurringOptions} />
                  </Tooltip> 
                </Grid.Column>
              </Grid.Row>

              <Grid.Row>
                <Grid.Column width={2} style={{ marginLeft: -5, paddingTop: 5 }}>
                  <Image src="/assets/Icons/shift-date.png" style={{ width: 28, height: 'auto' }}
                         className="display-inline" />
                </Grid.Column>
                <Grid.Column width={14} style={{ marginLeft: -20 }}>
                  <label className="text-uppercase blue-heading">
                    {(shift.recurringShift !== 'none' && 'THIS SHIFT REPEATS EVERY:') || 'SHIFT START DATE'}
                  </label>
                  <ShiftDaySelector selectedDate={this.state.selectedDate} isRecurring={true}
                                    startDate={moment().startOf('week')} formCallBack={this.updateFormState} />
                </Grid.Column>
              </Grid.Row> 



              <Grid.Row>
                <Grid.Column width={2} style={{ marginLeft: -5, paddingTop: 5 }}>
                  <Image src="/assets/Icons/shift-time.png" style={{ width: 33, height: 'auto' }}
                         className="display-inline" />
                </Grid.Column>
                <Grid.Column width={14} style={{ marginLeft: -20 }}>
                                     <StartToEndTimePicker isEdit={this.state.edit} startTime={shift.startTime} endTime={shift.endTime}
                                        onNowSelect={this.handleNowSelect} formCallBack={this.updateFormState} />
                </Grid.Column>
              </Grid.Row>


              <Grid.Row>
                <Grid.Column width={2} style={{ marginLeft: -5, paddingTop: isEdit && 5 || 10 }}>
                  <Image src="/assets/Icons/shift-date.png" style={{ width: 28, height: 'auto' }}
                         className="display-inline" />
                </Grid.Column>
                <Grid.Column width={14} style={{ marginLeft: -20 }}>
                  <StartToEndDatePicker startDate={shift.startDate} formCallBack={this.updateFormState} />
                </Grid.Column>
              </Grid.Row>

              <Grid.Row>
                <Grid.Column width={2} style={{ marginLeft: -5, paddingTop: 5 }}>
                  <Image src="/assets/Icons/team-members.png" style={{ width: 30, height: 'auto' }}
                         className="display-inline" />
                </Grid.Column>
                <Grid.Column width={14} style={{ marginLeft: -20 }}>
                  <NumberOfTeamMembers numberOfTeamMembers={shift.numberOfTeamMembers}
                                       formCallBack={this.updateFormState} />
                  <div className="performance-tagline">
                    <p>
                      {/* At maximum, <span className="color-green">{teamMembers.total} employees </span>
                      will report for this shift: {teamMembers.trainers} job trainers, {teamMembers.shadowers} job
                      shadowers */}
                    </p>
                  </div>
                </Grid.Column>
              </Grid.Row>

              <Grid.Row>
                <Grid.Column width={2} style={{ marginLeft: -5, paddingTop: 5 }}>
                  <Image src="/assets/Icons/scheduled-break.png" style={{ width: 29, height: 'auto' }}
                         className="display-inline" />
                </Grid.Column>
                <Grid.Column width={14} style={{ marginLeft: -20 }}>
                  <UnpaidBreakInMinutes unpaidBreakInMinutes={shift.unpaidBreakInMinutes}
                                        formCallBack={this.updateFormState} />
                </Grid.Column>
              </Grid.Row>

              <Grid.Row>
                <Grid.Column width={2} style={{ marginLeft: -5, paddingTop: 5 }}>
                  <Image src="/assets/Icons/add-user.png" style={{ width: 29, height: 'auto' }}
                         className="display-inline" />
                </Grid.Column>
                <Grid.Column width={14} style={{ marginLeft: -20 }}>
                  <label className="text-uppercase blue-heading">Assign Team Member</label>
                  { isAddTeamMemberDisabled
                    && <Tooltip className="tooltip-message" text=' &nbsp; The number of team members is equal to the number selected above. &nbsp;'>
                    <RaisedButton label="Add Team Member" disabled={isAddTeamMemberDisabled} />
                  </Tooltip> || <RaisedButton label="Add Team Member" onClick={this.handleAddTeamMember} />}

                
             
                 <br/>
                  <div className="member-list">
                    { shift.teamMembers && shift.teamMembers.map((tm, i) => <TeamMemberCard
                      avatarUrl={tm.avatarUrl}
                      firstName={tm.firstName}
                      lastName={tm.lastName}
                      content={tm.content}
                      users={users}
                      color={this.borderColor(tm.status) + 'Border'}
                      key={i}
                      id={i}
                      handleRemove={() => this.removeTeamMember(i)}
                      onSelectChange={this.setTeamMember}
                    />)}
                  </div>

                </Grid.Column>
              </Grid.Row>

              <Grid.Row>
                <Grid.Column width={2} style={{ marginLeft: -5, paddingTop: 5 }}>
                  <Image src="/assets/Icons/tags.png" style={{ width: 30, height: 'auto' }}
                         className="display-inline" />
                </Grid.Column>
                <Grid.Column className="tag-dropdown" width={14} style={{ marginLeft: -20 }}>
                  <label className="text-uppercase blue-heading">Tags</label>
                  <Dropdown
                    multiple
                    name="tags"
                    fluid
                    placeholder='Add tags'
                    search
                    selection
                    allowAdditions
                    options={shift.tagOptions}
                    onChange={(_, data) => this.handleChange({ target: data })} />
                </Grid.Column>
              </Grid.Row>

              <Grid.Row>
                <Grid.Column width={2} style={{ marginLeft: -5, paddingTop: 5 }}>
                  <Image src="/assets/Icons/instructions.png" style={{ width: 30, height: 'auto' }}
                         className="display-inline" />
                </Grid.Column>
                <Grid.Column width={14} style={{ marginLeft: -20 }}>
                  <label className="text-uppercase blue-heading">Instructions</label>
                  <TextArea className="form-control" name="instructions" value={shift.instructions}
                            onChange={(_, data) => this.handleChange({ target: data })} rows="3" />
                </Grid.Column>
              </Grid.Row>
            </Grid>

            <div className="drawer-footer">
              <div className="buttons text-center">
                <CircleButton handleClick={this.closeShiftDrawer} type="white" title="Cancel" />
                <CircleButton handleClick={() => this.handleShiftSubmit(shift)}
                              type="blue" title={ buttonTitle } />
              </div>
            </div>
          </div>
        </div>

      </Drawer>
    );
  }
}

export default withApollo(DrawerHelper);