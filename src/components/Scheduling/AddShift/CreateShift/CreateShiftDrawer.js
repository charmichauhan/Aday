import React, { Component } from 'react'
import Drawer from 'material-ui/Drawer';
import IconButton from 'material-ui/IconButton';
import RaisedButton from 'material-ui/RaisedButton';
import moment from 'moment';
import { Tooltip } from 'rebass';
import { find, pick, times } from 'lodash';
import { Image, TextArea, Dropdown, Grid } from 'semantic-ui-react';
import { withApollo } from 'react-apollo';
import uuidv4 from 'uuid/v4';

import { BASE_API } from '../../../../constants';
import WorkplaceSelector from '../../AddShift/CreateShift/workplaceSelector'
import ShiftDaySelector from '../../../DaySelector/ShiftDaySelector.js';
import { closeButton } from '../../../styles';
import Loading from '../../../helpers/Loading';
import CircleButton from '../../../helpers/CircleButton';
import dataHelper from '../../../helpers/common/dataHelper';
import TeamMemberCard from '../../ShiftWeekTable/ShiftEdit/TeamMemberCard';
import CreateShiftHelper from './CreateShiftHelper';
import NumberOfTeamMembers from './NumberOfTeamMembers';
import UnpaidBreakInMinutes from './UnpaidBreakInMinutes';
import StartToEndTimePicker from './StartToEndTimePicker';
import StartToEndDatePicker from './StartToEndDatePicker';
import ShiftHistoryDrawerContainer from '../../ShiftWeekTable/ShiftEdit/ShiftHistoryDrawerContainer';
import RecurringShiftSelect from './recurringShiftSelect';

import './select.css';

var rp = require('request-promise');

const initialState = {
  shift: {
    shiftMethod: 'standard',
    corporationId: localStorage.getItem('corporationId') || '',
    brandId: localStorage.getItem('brandId') || '',
    workplaceId: localStorage.getItem('workplaceId') || '',
    positionId: '',
    recurringShift: '',
    shiftDaysSelected: {},
    numberOfTeamMembers: 1,
    unpaidBreakInMinutes: 0,
    tags: [],
    tagOptions: [],
    duration: { hours: 0, minutes: 0 },
    phoneTree: [],
    recurringEdit: false
  },
  shiftErrors: {},
  shiftHistoryDrawer: false,
  brandId: localStorage.getItem('brandId') || '',
  corporationId: localStorage.getItem('corporationId') || '',
  workplaceId: localStorage.getItem('workplaceId') || ''
};

/**
 * When the shift is to be assigned via automation, the data below represents this to the user
 */
const unassignedTeamMember = {
  id: 0,
  firstName: '',
  lastName: 'Automated Shift',
  avatarUrl: 'https://s3.us-east-2.amazonaws.com/aday-website/icons/time-lapse-red.png',
  content: 'Assign shift to override automation',
  status: 'unassigned'
};

const unassignedManager = {
  id: 0,
  firstName: 'Select Manager',
  lastName: '',
  avatarUrl: 'https://s3.us-east-2.amazonaws.com/aday-website/anonymous-profile.png',
  content: 'Assign shift to a manager',
  status: 'unassigned'
};

/**
 * [shift description]
 * @author Raj Kapoor
 * @since Sep 15, 2017
 */
class DrawerHelper extends Component {

  constructor(props) {
    super(props);
    let shift = { ...initialState.shift, ...props.shift, advance: { allowShadowing: true } };
    shift.startTime = moment(shift.startTime);
    shift.endTime = moment(shift.endTime);
    if (shift.id) {
      if (shift.shiftTagsByShiftId && shift.shiftTagsByShiftId.nodes) {
        shift.tags = shift.shiftTagsByShiftId.nodes.map(({ tagByTagId: { id, name } }) => ({ id, name }));
      }
      if (shift.workersAssigned) {
        shift.teamMembers = shift.workersAssigned.map((id) => {
          let foundWorker = find(props.users, { id });
          if (!foundWorker) foundWorker = unassignedTeamMember;
          return {
            ...pick(foundWorker, ['id', 'avatarUrl', 'firstName', 'lastName']),
            status: 'accepted',
            content: ''
          };
        });
        const diff = shift.workersRequestedNum - shift.workersAssigned.length;
        if (diff) times(diff, () => shift.teamMembers.push(unassignedTeamMember));
      } else {
        shift.teamMembers = shift.workersRequestedNum && times(shift.workersRequestedNum, () => unassignedTeamMember);
      }
      shift.recurringShift = shift.recurringShiftId && 'weekly' || 'none';
      shift.recurringEdit = !!props.recurringEdit;
      if ([null, undefined, ''].indexOf(shift.unpaidBreakTime) !== -1) {
        shift.unpaidBreakInMinutes = 0;
      } else {
        const [hours, mins] = shift.unpaidBreakTime.split(':').map(val => parseInt(val));
        shift.unpaidBreakInMinutes = (hours * 60 + mins) || 0;
      }
      shift.weekPublishedId = this.props.weekPublishedId || '';
    }
    this.state = {
      ...initialState,
      shift,
      isEdit: !!shift.id,
      weekStart: props.weekStart,
      users: props.users
    };
  }

  componentWillMount() {
    const { shift } = this.state;
    this.validateShift(shift);
    if (shift.recurringShiftId) this.getRecurringShiftDetails(shift.recurringShiftId);
  }

  componentDidMount() {
    this.getWorkplaces();
    this.getWorkplacePositions();
    this.getAllTags();
    this.filterManagers(this.state.shift.workplaceId);
  }

  componentWillReceiveProps(nextProps) {
    if (!this.state.isEdit) {
      if (nextProps.weekStart.valueOf() !== this.props.weekStart.valueOf()) {
        this.setState({ weekStart: nextProps.weekStart });
      }
      const workplaceId = localStorage.getItem('workplaceId');
      if (workplaceId !== (this.state.shift && this.state.shift.workplaceId)) {
        const shift = {
          ...this.state.shift,
          workplaceId
        };
        this.setState({ shift });
      }
      if (nextProps.open !== this.props.open) {
        this.setState((state) => ({
          shift: {
            ...state.shift,
            advance: nextProps.shift.advance
          }
        }));
      }
    } else {
      if (nextProps.open !== this.props.open) {
        let shift = {
          ...initialState.shift,
          ...this.state.shift,
          ...nextProps.shift
        };
        this.setState({ shift });
        this.validateShift(shift);
      }
    }

    if (nextProps.users && !this.state.users) {
      this.setState({ users: nextProps.users });
    }

    if (nextProps.managers && !this.state.managers) {
      const managers = nextProps.managers.map(manager => {
        const { id, workplaceId, userByUserId } = manager;
        return {
          id,
          workplaceId,
          userId: userByUserId.id,
          avatarUrl: userByUserId.avatarUrl,
          firstName: userByUserId.firstName,
          lastName: userByUserId.lastName
        };
      });
      this.setState({
        managers,
        filteredManagers: managers
      });
    }
  }

  getWorkplaces = () => {
    dataHelper.getCurrentWorkplaces()
      .then(workplaces => this.setState({ workplaces }))
      .catch(err => console.error(err));
  };

  getAllTags = () => {
    CreateShiftHelper.getAllTags()
      .then(tags => {
        const allTags = tags && tags.length && tags.map(({ id, name }) => ({ id, name })) || [];
        const tagOptions = allTags.map(({ id, name }) => ({ text: name, value: { id, name }, key: id }));
        this.setState((state) => ({ shift: { ...state.shift, tagOptions }, allTags }));
      }).catch(err => console.error(err));
  };

  getWorkplacePositions = (workplaceId = this.state.shift.workplaceId) => {
    if (workplaceId) {
      CreateShiftHelper.getRelevantPositions(workplaceId)
        .then((positions) => this.setState({ positions }))
        .catch(err => console.error(err));
    }
  };

  getRecurringShiftDetails = (recurringShiftId) => {
    if (recurringShiftId) {
      CreateShiftHelper.getRecurringShiftById(recurringShiftId)
        .then((recurringShift) => {
          const { shift } = this.state;
          shift.startDate = moment(recurringShift.startDate);
          shift.endDate = recurringShift.expiration && moment(recurringShift.expiration) || null;
          this.setState({ shift });
        })
        .catch(err => console.error(err));
    }
  };

  getAllPositionsForUser = (userId) => {
    return CreateShiftHelper.getAllPositionsForUser(userId)
      .then(userPositions => userPositions)
      .catch(err => console.error(err));
  };

  handleChange = (event) => {
    const { shift } = this.state;
    const { name, value } = event.target;
    if (name === 'tags') {
      let lastIndex = value.length - 1;
      if (typeof value[lastIndex] === 'string') {
        value[lastIndex] = { id: uuidv4(), name: value[lastIndex].trim(), isNew: true };
        shift.tagOptions.unshift({
          text: value[lastIndex].name,
          value: value[lastIndex],
          key: new Date().getTime()
        });
      }
    }
    shift[name] = value;
    if (name === 'workplaceId') {
      this.getWorkplacePositions(value);
      this.filterManagers(value);
    }
    if (name === 'positionId') {
      this.filterManagers(shift.workplaceId);
      if (shift.teamMembers) {
        shift.teamMembers = shift.teamMembers.map((manager) => {
          if (manager.id == 0) {
            if (value === 'manager') return unassignedManager;
            else return unassignedTeamMember;
          }
          return manager;
        });
      }
    }
    if (name === 'recurringShift') shift.shiftDaysSelected = {};
    this.setState({ shift });
    this.validateShift(shift);
  };

  handleTags = (shift) => {
    const { allTags } = this.state;

    const newTags = shift.tags.filter(({ isNew }) => !!isNew);
    if (newTags.length) {
      const promises = newTags.map(({ id, name }) => CreateShiftHelper.createTag(id, name));
      return Promise.all(promises).then((tags) => {
        allTags.concat(tags);
        const tagOptions = allTags.map(({ id, name }) => ({ text: name, value: { id, name }, key: id }));
        this.setState((state) => ({ shift: { ...state.shift, tagOptions }, allTags }));
        return shift;
      });
    }
    return Promise.resolve(shift);
  };

  handleAddTeamMember = () => {
    const { shift } = this.state;
    if (!shift.teamMembers) shift.teamMembers = [];
    if (shift.positionId === 'manager') {
      shift.teamMembers.push(unassignedManager);
    } else {
      shift.teamMembers.push(unassignedTeamMember);
    }
    this.setState({ shift });
  };

  handleNowSelect = () => {
    this.setState(state => ({
      selectedDate: moment().format('MM-DD-YYYY'),
      shift: { ...state.shift, recurringShift: 'none' }
    }));
  };

  openEditSubmit = (shift) => {
    this.handleTags(shift).then((shift) => {
      const { handleSubmit } = this.props;
      if (handleSubmit) handleSubmit(shift); });
      this.setState(initialState);
  }

  handleShiftSubmit = (drawerShift) => {
    this.handleTags(drawerShift).then((shift) => {
      const { handleSubmit } = this.props;
      if (handleSubmit) handleSubmit(shift);
    });
    this.setState(initialState);
  };

  filterManagers = (workplaceId) => {
    const { managers } = this.state;
    if (managers) {
      if (!workplaceId) return this.setState({ filteredManagers: managers });
      let filteredManagers = managers.filter(manager => manager.workplaceId === workplaceId);
      this.setState({ filteredManagers });
    }
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
    const startTime = dataValue.startTime || this.state.shift.startTime;
    const endTime = dataValue.endTime || this.state.shift.endTime;
    if (startTime && startTime.isValid() && endTime && endTime.isValid()) {
      let minDiff = endTime.diff(startTime, 'minutes');
      // Checking if the end time is smaller then the start time.
      if (minDiff < 0) {
        endTime.add(1, 'days');
        minDiff = endTime.diff(startTime, 'minutes');
        dataValue.endTime = endTime;
      }
      if (minDiff > 0) {
        dataValue.duration = {
          hours: (minDiff - (minDiff % 60) ) / 60,
          minutes: minDiff % 60
        };
      }
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

  phoneTreeCallBack = (phoneTree) => {
    this.setState((state) => ({ shift: { ...state.shift, phoneTree: phoneTree } }));
  };

  openShiftHistory = () => {
    // will need the position id, workplace id ,
    //number of workers needed, workers assigned (in order to make the difference,
    //the unpaid time and of course the start/end in order to open the shift drawer
    //will be a request to server
    const { shift } = this.state;

    let day = Object.keys(shift.shiftDaysSelected)[0];
    console.log(day);
    const shiftDay = moment.utc(day, 'MM-DD-YYYY');
    console.log(shiftDay);

    const shiftDate = shiftDay.date();
    const shiftMonth = shiftDay.month();
    const shiftYear = shiftDay.year();

    var startTime = moment(shift.startTime).date(shiftDate).month(shiftMonth).year(shiftYear).second(0);
    var endTime = moment(shift.endTime).date(shiftDate).month(shiftMonth).year(shiftYear).second(0);

    console.log(startTime);
    console.log(endTime);

    const _this = this

    const uri = `${BASE_API}/api/phoneTreeList`;
    console.log(this.props.weekPublishedId)
    var options = {
      uri: uri,
      method: 'POST',
      json: {
        'positionId': shift.positionId,
        'workplaceId': shift.workplaceId,
        'workerNumCount': String(shift.numberOfTeamMembers),
        'unpaidBreakTime': String(shift.unpaidBreakInMinutes),
        'startTime': startTime.format('YYYY-MM-DD HH:mm:ss') + '+00',
        'endTime': endTime.format('YYYY-MM-DD HH:mm:ss') + '+00',
        'weekPublishedId': this.props.weekPublishedId
      }
    };
    rp(options)
      .then(function (response) {
        console.log(response);
        _this.setState((state) => ({ shift: { ...state.shift, phoneTree: response } }));
        _this.setState({ shiftHistoryDrawer: true })
      }).catch((error) => {
      console.log('there was an error sending the query', error);
    });
  };

  handleNewShiftDrawerClose = () => {
    this.setState({ shiftHistoryDrawer: false })
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
    const { teamMembers, positionId } = this.state.shift;
    if (user.id) {
      teamMembers[index] = {
        ...teamMembers[index],
        ...user,
        content: '',
        status: 'accepted',
      };
      this.setState((state) => ({ shift: { ...state.shift, teamMembers } }));

      // Checking for user position to exist

      // this.getAllPositionsForUser(user.id).then((userPositions) => {
      //   const isPositionAssigned = find(userPositions, { id: positionId });
      //   if (isPositionAssigned) {
      //     teamMembers[index] = {
      //       ...teamMembers[index],
      //       ...user,
      //       content: '',
      //       status: 'accepted'
      //     };
      //     this.setState((state) => ({ shift: { ...state.shift, teamMembers } }));
      //   } else {
      //     // TODO : Show popup to user for notifying that the user does not have relevent positions in the profile.
      //     console.log('// TODO : Show popup to user for notifying that the user does not have relevent positions in the profile.');
      //   }
      // });
    } else {
      teamMembers[index] = { ...unassignedTeamMember };
      this.setState((state) => ({ shift: { ...state.shift, teamMembers } }));
    }
  };

  validateShift = (shift) => {
    let shiftErrors = {};
    if (!shift.workplaceId) shiftErrors['workplaceId'] = true;
    if (!shift.brandId) shiftErrors['brandId'] = true;
    if (!shift.corporationId) shiftErrors['corporationId'] = true;
    if (!shift.positionId) shiftErrors['positionId'] = true;
    if (!shift.recurringShift && !this.state.isEdit) shiftErrors['recurringShift'] = true;
    if (shift.recurringShift && shift.recurringShift.toLowerCase() === 'weekly') {
      if ((this.state.isEdit && shift.recurringEdit) || !this.state.isEdit) {
        if (!shift.startDate) shiftErrors['recurringShiftStartDate'] = true;
        if (shift.endDate === undefined) shiftErrors['recurringShiftEndDate'] = true;
      }
    }
    if (!shift.startTime) shiftErrors['startTime'] = true;
    if (!shift.endTime) shiftErrors['endTime'] = true;
    if (!shift.numberOfTeamMembers) shiftErrors['NumberOfTeamMembers'] = true;
    if (shift.unpaidBreakInMinutes !== 0 && !shift.unpaidBreakInMinutes) shiftErrors['unpaidBreakInMinutes'] = true;
    if (!this.state.isEdit) {
      if (!shift.shiftDaysSelected) {
        shiftErrors['shiftDaysSelected'] = true;
      } else if (typeof shift.shiftDaysSelected === 'object') {
        if (!Object.values(shift.shiftDaysSelected).filter(value => value).length) {
          shiftErrors['shiftDaysSelected'] = true;
        }
      }
    }
    console.log(shiftErrors);
    this.setState({ isShiftInvalid: Object.keys(shiftErrors).length });
  };

  handleWorkplaceChange = (e) => {
    this.setState((state) => ({ shift: { ...state.shift, workplaceId: e.workplace } }));
    this.getWorkplacePositions(e.workplace);
  };

  render() {

    const { width, open, weekStart } = this.props;
    const {
      shift,
      positions,
      selectedDate,
      filteredManagers,
      users,
      isEdit,
      isShiftInvalid
    } = this.state;

    let positionOptions;

    if (positions) {
      positionOptions = positions.map(position => ({
        key: position.id,
        value: position.id,
        text: position.positionName,
        selected: shift.positionId === position.id
      }));
    }
    const recurringOptions = [{
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
      shadowers: shift.advance && shift.advance.allowShadowing && shift.numberOfTeamMembers || 0
    };

    const isRecurring = shift.recurringShift !== 'none';
    const isTeamMembersFull = shift.teamMembers && shift.teamMembers.length >= shift.numberOfTeamMembers;
    const addTeamMemberTooltip = (isTeamMembersFull && `${shift.numberOfTeamMembers} Team member(s) are already assigned to shift, increase number of team members to add more.`);

    return (
      <Drawer
        width={width}
        className="shift-section"
        openSecondary={true}
        docked={false}
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
              <span className="drawer-title">{isEdit ? 'Edit Hours' : 'Add Hours' }</span>
            </div>

            <div style={{ flex: 3, alignSelf: 'center' }}>
            {/*  <button className="semantic-ui-button" style={{ borderRadius: 5 }} onClick={() => handleAdvance(shift)}
                      color='red'>Advanced
              </button> */}
            </div>
          </div>

          <div className="col-md-12 form-div edit-drawer-content">


            <Grid columns={2}>
              {/*
               * Removed by Rahkeem, will re-introduce once new scheduling method is implemented
               <Grid.Row>
               <Grid.Column width={2} style={{ marginLeft: -5, paddingTop: isEdit && 5 || 10 }}>
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
               */}
              <Grid.Row>
                <Grid.Column width={2} style={{ marginLeft: -5, paddingTop: isEdit && 5 || 10 }}>
                  <Image src="/assets/Icons/workplace.png" style={{ width: 26, height: 'auto' }}
                         className="display-inline" />
                </Grid.Column>
                <Grid.Column width={14} style={{ marginLeft: -20 }}>
                  <label className="text-uppercase blue-heading">Workplace</label>
                  <WorkplaceSelector workplace={shift.workplaceId} overRideCurrent={true}
                                     formCallBack={ this.handleWorkplaceChange } />
                </Grid.Column>
              </Grid.Row>

              <Grid.Row>
                <Grid.Column width={2} style={{ marginLeft: -5, paddingTop: isEdit && 5 || 10 }}>
                  <Image src="/assets/Icons/certification.png" style={{ width: 25, height: 'auto' }}
                         className="display-inline" />
                </Grid.Column>
                <Grid.Column width={14} style={{ marginLeft: -20 }}>
                  <label className="text-uppercase blue-heading">Position</label>
                  <Dropdown
                    placeholder={
                      shift.workplaceId && 'WHICH POSITION CERTIFICATION MUST THE TEAM MEMBER HAVE?'
                      || 'SELECT WORKPLACE TO SEE AVAILABLE POSITIONS'
                    }
                    selectOnBlur={false}
                    forceSelection={false}
                    disabled={!positions || !shift.workplaceId}
                    fluid
                    selection
                    value={shift.positionId}
                    name="positionId"
                    options={positionOptions}
                    onChange={(_, data) => this.handleChange({ target: data })} />
                </Grid.Column>
              </Grid.Row>

              <Grid.Row>
                <Grid.Column width={2} style={{ marginLeft: -5, paddingTop: isEdit && 5 || 10 }}>
                  <Image src="/assets/Icons/repeating-shifts.png" style={{ width: 36, height: 'auto' }}
                         className="display-inline" />
                </Grid.Column>
                <Grid.Column width={14} style={{ marginLeft: -20 }}>
                  <label className="text-uppercase blue-heading">Repeat Shift Weekly</label>
                  <Dropdown
                    fluid
                    selection
                    name="recurringShift"
                    placeholder="WILL YOU HAVE TO SCHEDULE THESE WORKING HOURS EVERY WEEK?"
                    onChange={(_, data) => this.handleChange({ target: data })}
                    value={shift.recurringShift}
                    selectOnBlur={false}
                    disabled={isEdit}
                    forceSelection={false}
                    options={recurringOptions} />
                </Grid.Column>
              </Grid.Row>

              <Grid.Row>
                <Grid.Column width={2} style={{ marginLeft: -5, paddingTop: isEdit && 5 || 10 }}>
                  <Image src="/assets/Icons/shift-time.png" style={{ width: 33, height: 'auto' }}
                         className="display-inline" />
                </Grid.Column>
                <Grid.Column width={14} style={{ marginLeft: -20 }}>
                  <StartToEndTimePicker isEdit={isEdit} startTime={shift.startTime} endTime={shift.endTime}
                                        onNowSelect={this.handleNowSelect} formCallBack={this.updateFormState} />
                  <div className="performance-tagline">
                    <p>Shift Length: {shift.duration.hours} Hours {shift.duration.minutes} Minutes</p>
                  </div>
                </Grid.Column>
              </Grid.Row>

              {!isEdit && <Grid.Row>
                <Grid.Column width={2} style={{ marginLeft: -5, paddingTop: isEdit && 5 || 10 }}>
                  <Image src="/assets/Icons/shift-date.png" style={{ width: 28, height: 'auto' }}
                         className="display-inline" />
                </Grid.Column>
                <Grid.Column width={14} style={{ marginLeft: -20 }}>
                  <label className="text-uppercase blue-heading">
                    {(shift.recurringShift !== 'none' && 'REPEAT THIS SHIFT EVERY:') || 'SHIFT START DATE'}
                  </label>
                  <ShiftDaySelector selectedDate={selectedDate} isRecurring={shift.recurringShift !== 'none'}
                                    startDate={weekStart} formCallBack={this.updateFormState}
                                    isPublished={this.props.isPublished} />
                </Grid.Column>
              </Grid.Row>}

              { shift.recurringEdit && <Grid.Row>
                <Grid.Column width={2} style={{ marginLeft: -5, paddingTop: isEdit && 5 || 10 }}>
                  <Image src="/assets/Icons/shift-date.png" style={{ width: 28, height: 'auto' }}
                         className="display-inline" />
                </Grid.Column>
                <Grid.Column width={14} style={{ marginLeft: -20 }}>
                  <label className="text-uppercase blue-heading">
                    {'THIS SHIFT REPEATS THIS EVERY:'}
                  </label>
                  <RecurringShiftSelect recurringShift={shift.recurringShiftId} selectedDate={selectedDate}
                                        startDate={weekStart} formCallBack={this.updateFormState} calendarOffset={this.props.calendarOffset} />
                </Grid.Column>
              </Grid.Row>}

              {((shift.recurringShift === 'weekly' && shift.recurringEdit) || (!isEdit && shift.recurringShift === 'weekly')) &&
              <Grid.Row>
                <Grid.Column width={2} style={{ marginLeft: -5, paddingTop: isEdit && 5 || 10 }}>
                  <Image src="/assets/Icons/startend-dates.png" style={{ width: 28, height: 'auto' }}
                         className="display-inline" />
                </Grid.Column>
                <Grid.Column width={14} style={{ marginLeft: -20 }}>
                  <StartToEndDatePicker isEdit={isEdit} startDate={shift.startDate || weekStart} endDate={shift.endDate} formCallBack={this.updateFormState} />
                </Grid.Column>
              </Grid.Row>}

              <Grid.Row>
                <Grid.Column width={2} style={{ marginLeft: -5, paddingTop: isEdit && 5 || 10 }}>
                  <Image src="/assets/Icons/team-members.png" style={{ width: 30, height: 'auto' }}
                         className="display-inline" />
                </Grid.Column>
                <Grid.Column width={14} style={{ marginLeft: -20 }}>
                  <NumberOfTeamMembers numberOfTeamMembers={shift.numberOfTeamMembers}
                                       formCallBack={this.updateFormState} />
                  <div className="performance-tagline">
                    <p>
                      At maximum, <span className="color-green">{teamMembers.total} employees </span>
                      will report for this shift: {teamMembers.trainers} job trainers, {teamMembers.shadowers} job
                      shadowers
                    </p>
                  </div>
                </Grid.Column>
              </Grid.Row>

              <Grid.Row>
                <Grid.Column width={2} style={{ marginLeft: -5, paddingTop: isEdit && 5 || 10 }}>
                  <Image src="/assets/Icons/scheduled-break.png" style={{ width: 29, height: 'auto' }}
                         className="display-inline" />
                </Grid.Column>
                <Grid.Column width={14} style={{ marginLeft: -20 }}>
                  <UnpaidBreakInMinutes unpaidBreakInMinutes={shift.unpaidBreakInMinutes}
                                        formCallBack={this.updateFormState} />
                </Grid.Column>
              </Grid.Row>

              <Grid.Row>
                <Grid.Column width={2} style={{ marginLeft: -5, paddingTop: isEdit && 5 || 10 }}>
                  <Image src="/assets/Icons/add-user.png" style={{ width: 29, height: 'auto' }}
                         className="display-inline" />
                </Grid.Column>
                <Grid.Column width={14} style={{ marginLeft: -20 }}>
                  <label className="text-uppercase blue-heading">Assign Team Member</label>
                  {this.props.isPublished && shift.recurringShift == 'weekly' && !isEdit &&
                  <div> When adding recurring shifts to a published week, we will not start a phone tree on all created
                    shifts.
                    You may individually edit these shifts after creation to start phone trees. </div>
                  }
                  <div className="add-hours-member member-list"
                       style={{ display: (this.props.isPublished && shift.recurringShift != 'weekly') || (shift.teamMembers && !shift.teamMembers.length) && 'none' || 'block' }}>


                    { (this.props.isPublished && shift.recurringShift != 'weekly') || shift.teamMembers && shift.teamMembers.length && shift.teamMembers.map((tm, i) =>
                      <TeamMemberCard
                        avatarUrl={tm.avatarUrl}
                        firstName={tm.firstName}
                        lastName={tm.lastName}
                        seniority={tm.seniority}
                        ytd={tm.ytd}
                        content={tm.content}
                        isManager={shift.positionId === 'manager'}
                        users={shift.positionId === 'manager' && filteredManagers || users}
                        position={shift.positionId}
                        color={this.borderColor(tm.status) + 'Border'}
                        key={i}
                        id={i}
                        handleRemove={() => this.removeTeamMember(i)}
                        onSelectChange={this.setTeamMember}
                      />)
                    }

                  </div>


                  { (this.props.isPublished == true) && shift.recurringShift != 'weekly' &&
                  <div>
                    {( isShiftInvalid)
                      &&  <Tooltip className="tooltip-message" text={"Fill Out Shift Information To Generate Phone Tree"}>
                        <RaisedButton label="View Phone Tree" disabled={ true} />
                      </Tooltip> || <RaisedButton label="View Phone Tree" onClick={this.openShiftHistory} />   }
                  </div>
                  }

                  { (!this.props.isPublished || shift.recurringShift == 'weekly') &&
                  <div>
                    {( isTeamMembersFull)
                    && <Tooltip className="tooltip-message" text={addTeamMemberTooltip}>
                      <RaisedButton label="Add Team Member" disabled={ isTeamMembersFull} />
                    </Tooltip> || <RaisedButton label="Add Team Member" disabled={isTeamMembersFull}
                                                onClick={this.handleAddTeamMember} />}
                  </div>
                  }
                </Grid.Column>
              </Grid.Row>

              <Grid.Row>
                <Grid.Column width={2} style={{ marginLeft: -5, paddingTop: isEdit && 5 || 10 }}>
                  <Image src="/assets/Icons/tags.png" style={{ width: 30, height: 'auto' }}
                         className="display-inline" />
                </Grid.Column>
                <Grid.Column className="tag-dropdown" width={14} style={{ marginLeft: -20 }}>
                  <label className="text-uppercase blue-heading">Tags</label>
                  <Dropdown
                    options={shift.tagOptions}
                    placeholder='Add Tags'
                    search
                    selection
                    fluid
                    multiple
                    allowAdditions
                    additionLabel='Add New Tag: '
                    value={shift.tags}
                    name="tags"
                    onChange={(_, data) => this.handleChange({ target: data })} />
                </Grid.Column>
              </Grid.Row>

              <Grid.Row>
                <Grid.Column width={2} style={{ marginLeft: -5, paddingTop: isEdit && 5 || 10 }}>
                  <Image src="/assets/Icons/instructions.png" style={{ width: 30, height: 'auto' }}
                         className="display-inline" />
                </Grid.Column>
                <Grid.Column width={14} style={{ marginLeft: -20 }}>
                  <label className="text-uppercase blue-heading">Instructions</label>
                  <TextArea className="form-control" name="instructions"
                            onChange={(_, data) => this.handleChange({ target: data })} rows="3" />
                </Grid.Column>
              </Grid.Row>
            </Grid>

            <div className="drawer-footer">
              <div className="buttons text-center">
                <CircleButton handleClick={this.closeShiftDrawer} type="white" title="Cancel" />
                { isEdit ? 
                      <CircleButton disabled={isShiftInvalid} handleClick={() => this.openEditSubmit(this.state.shift)}
                        type="blue" title={'Edit Hours'} /> :
                      <CircleButton disabled={isShiftInvalid} handleClick={() => this.handleShiftSubmit(this.state.shift)}
                        type="blue" title={'Add Hours'} />
                }
              </div>
            </div>
          </div>
        </div>
        <ShiftHistoryDrawerContainer
          isSorted={true}
          shift={this.state.shift}
          users={this.state.shift.phoneTree}
          open={this.state.shiftHistoryDrawer}
          handleBack={this.handleNewShiftDrawerClose}
          handleHistory={this.handleNewShiftDrawerClose}
          phoneTree={this.phoneTreeCallBack} />
      </Drawer>
    );
  }
}

export default withApollo(DrawerHelper)
