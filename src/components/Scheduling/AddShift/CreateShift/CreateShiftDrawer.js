import React, { Component } from 'react'
import Drawer from 'material-ui/Drawer';
import IconButton from 'material-ui/IconButton';
import RaisedButton from 'material-ui/RaisedButton';
import moment from 'moment';
import { Image, TextArea, Dropdown, Grid, Button } from 'semantic-ui-react';
import { withApollo } from 'react-apollo';

import ShiftDaySelector from '../../../DaySelector/ShiftDaySelector.js';
import { closeButton } from '../../../styles';
import Loading from '../../../helpers/Loading';
import CircleButton from '../../../helpers/CircleButton';
import dataHelper from '../../../helpers/common/dataHelper';
import NumberOfTeamMembers from './NumberOfTeamMembers';
import UnpaidBreakInMinutes from './UnpaidBreakInMinutes';
import CreateShiftHelper from './CreateShiftHelper';
import StartToEndTimePicker from './StartToEndTimePicker';
import StartToEndDatePicker from './StartToEndDatePicker';
import { Tooltip } from 'rebass';
//import Tooltip from 'react-toolbox/lib/tooltip';

import './select.css';

const initialState = {
  shift: {
    shiftMethod: 'standard',
    recurringShift: 0,
    numberOfTeamMembers: 1,
    unpaidBreakInMinutes: 0,
    tags: [],
    tagOptions: [],
    brandId: localStorage.getItem('brandId') || '',
    corporationId: localStorage.getItem('corporationId') || '',
    workplaceId: localStorage.getItem('workplaceId') || ''
  },
  shiftErrors: {},
  brandId: localStorage.getItem('brandId') || '',
  corporationId: localStorage.getItem('corporationId') || '',
  workplaceId: localStorage.getItem('workplaceId') || ''
};

class DrawerHelper extends Component {

  constructor(props) {
    super(props);
    let shift = { ...initialState.shift, ...props.shift, advance: { allowShadowing: true } };
    shift.startTime = moment(shift.startTime);
    shift.endTime = moment(shift.endTime);
    this.state = {
      ...initialState,
      shift,
      isEdit: !!shift.id,
      weekStart: props.weekStart
    };
  }

  componentWillMount() {
    this.validateShift(this.state.shift);
  }

  componentDidMount() {
    this.getWorkplaces();
    this.getPositions();
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
    }
    if (nextProps.open !== this.props.open) {
      this.setState((state) => ({
        shift: {
          ...state.shift,
          advance: nextProps.shift.advance
        }
      }));
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

  };

  handleNowSelect = () => {
    this.setState({ selectedDate: moment().format('MM-DD-YYYY') });
  };

  handleShiftSubmit = (shift) => {
    const { handleSubmit } = this.props;
    if (handleSubmit) handleSubmit(shift);
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
    this.setState(initialState);
    if (closeDrawer) closeDrawer();
  };

  validateShift = (shift) => {
    let shiftErrors = {};
    if (!shift.workplaceId) shiftErrors['workplaceId'] = true;
    if (!shift.brandId) shiftErrors['brandId'] = true;
    if (!shift.corporationId) shiftErrors['corporationId'] = true;
    if (!shift.positionId) shiftErrors['positionId'] = true;
    if (!shift.recurringShift) shiftErrors['recurringShift'] = true;
    if (!shift.startTime) shiftErrors['startTime'] = true;
    if (!shift.endTime) shiftErrors['endTime'] = true;
    if (!shift.numberOfTeamMembers) shiftErrors['NumberOfTeamMembers'] = true;
    if (!shift.unpaidBreakInMinutes) shiftErrors['unpaidBreakInMinutes'] = true;
    if (!this.state.isEdit) {
      if (!shift.shiftDaysSelected) {
        shiftErrors['shiftDaysSelected'] = true;
      } else if (typeof shift.shiftDaysSelected === 'object') {
        if (!Object.values(shift.shiftDaysSelected).filter(value => value).length) {
          shiftErrors['shiftDaysSelected'] = true;
        }
      }
    }
    this.setState({ shiftErrors });
  };

  isShiftValid = () => {
    const { shiftErrors } = this.state;
    return Object.keys(shiftErrors).length > 0;
  };

  render() {

    const { width, open, handleAdvance } = this.props;
    const { shift, workplaces, positions, workplaceId, weekStart, selectedDate, isEdit } = this.state;
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
        text: position.positionName,
        selected: this.state.shift.positionId === position.id
      }));
      positionOptions.unshift({
        key: 'manager',
        value: 'manager',
        text: 'Manager',
        disabled: true
      });
      positionOptions.unshift({
        key: 'selected',
        value: 0,
        text: 'WHICH POSITION CERTIFICATION MUST THE TEAM MEMBER HAVE?',
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
      text: 'WILL YOU HAVE TO SCHEDULE THESE WORKING HOURS EVERY WEEK?',
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
      shadowers: shift.advance && shift.advance.allowShadowing && shift.numberOfTeamMembers || 0
    };

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
              <span className="drawer-title">Add Hours</span>
            </div>

            <div style={{ flex: 3, alignSelf: 'center' }}>
              <button className="semantic-ui-button" style={{ borderRadius: 5 }} onClick={() => handleAdvance(shift)}
                      color='red'>Advanced
              </button>
            </div>
          </div>

          <div className="col-md-12 form-div edit-drawer-content">
            <Grid columns={2}>
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

              <Grid.Row>
                <Grid.Column width={2} style={{ marginLeft: -5, paddingTop: isEdit && 5 || 10 }}>
                  <Image src="/assets/Icons/workplace.png" style={{ width: 26, height: 'auto' }}
                         className="display-inline" />
                </Grid.Column>
                <Grid.Column width={14} style={{ marginLeft: -20 }}>
                  <label className="text-uppercase blue-heading">Workplace</label>
                  <Dropdown
                    name="workplaceId"
                    onChange={(_, data) => this.handleChange({ target: data })}
                    value={shift.workplaceId || 0}
                    fluid
                    selection
                    options={workplaceOptions} />
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
                <Grid.Column width={2} style={{ marginLeft: -5, paddingTop: isEdit && 5 || 10 }}>
                  <Image src="/assets/Icons/repeating-shifts.png" style={{ width: 36, height: 'auto' }}
                         className="display-inline" />
                </Grid.Column>
                <Grid.Column width={14} style={{ marginLeft: -20 }}>
                  <label className="text-uppercase blue-heading">Repeat Shift Weekly</label>
                  <Dropdown
                    name="recurringShift"
                    onChange={(_, data) => this.handleChange({ target: data })}
                    value={shift.recurringShift}
                    fluid
                    selection
                    options={recurringOptions} />
                </Grid.Column>
              </Grid.Row>

              <Grid.Row>
                <Grid.Column width={2} style={{ marginLeft: -5, paddingTop: isEdit && 5 || 10 }}>
                  <Image src="/assets/Icons/shift-time.png" style={{ width: 33, height: 'auto' }}
                         className="display-inline" />
                </Grid.Column>
                <Grid.Column width={14} style={{ marginLeft: -20 }}>
                  <StartToEndTimePicker startTime={shift.startTime} endTime={shift.endTime}
                                        onNowSelect={this.handleNowSelect} formCallBack={this.updateFormState} />
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
                                    startDate={weekStart} formCallBack={this.updateFormState} />
                </Grid.Column>
              </Grid.Row>}

              {shift.recurringShift === 'weekly' && <Grid.Row>
                <Grid.Column width={2} style={{ marginLeft: -5, paddingTop: isEdit && 5 || 10 }}>
                  <Image src="/assets/Icons/shift-date.png" style={{ width: 28, height: 'auto' }}
                         className="display-inline" />
                </Grid.Column>
                <Grid.Column width={14} style={{ marginLeft: -20 }}>
                  <StartToEndDatePicker startDate={weekStart} formCallBack={this.updateFormState} />
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
                  {shift.recurringShift !== 'none' && <Tooltip className="tooltip-message"
                                                               text=' &nbsp; Creating recurring shifts and adding team members cannot be done at the same time &nbsp;'>
                    <RaisedButton label="Add Team Member" disabled={shift.recurringShift !== 'none'}
                                  onClick={this.handleAddTeamMember} />
                  </Tooltip> || <RaisedButton label="Add Team Member" disabled={shift.recurringShift !== 'none'}
                                              onClick={this.handleAddTeamMember} />}
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
                <CircleButton disabled={this.isShiftValid(shift)} handleClick={() => this.handleShiftSubmit(shift)}
                              type="blue" title="Add Hours" />
              </div>
            </div>
          </div>
        </div>

      </Drawer>
    );
  }
}

export default withApollo(DrawerHelper);
