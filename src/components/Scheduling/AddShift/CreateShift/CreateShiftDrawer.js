import React, { Component } from 'react'
import Drawer from 'material-ui/Drawer';
import IconButton from 'material-ui/IconButton';
import { Image, TextArea, Dropdown } from 'semantic-ui-react';
import { withApollo } from 'react-apollo';
import moment from 'moment';

import ShiftDaySelector from '../../../DaySelector/ShiftDaySelector.js';
import { closeButton } from '../../../styles';
import Loading from '../../../helpers/Loading';
import CircleButton from '../../../helpers/CircleButton';
import dataHelper from '../../../helpers/common/dataHelper';
import NumberOfTeamMembers from './NumberOfTeamMembers';
import UnpaidBreakInMinutes from './UnpaidBreakInMinutes';
import CreateShiftHelper from './CreateShiftHelper';
import StartToEndTimePicker from './StartToEndTimePicker';
// import StartToEndDatePicker from './StartToEndDatePicker';

import './select.css';

const methodOptions = [{ key: 'standard', value: 'standard', text: 'Standard', disabled: true, selected: true }];

const initialState = {
  shift: {
    shiftMethod: 'standard',
    recurringShift: 'none',
    tags: [],
    tagOptions: [],
    brandId: localStorage.getItem('brandId') || '',
    corporationId: localStorage.getItem('corporationId') || '',
    workplaceId: localStorage.getItem('workplaceId') || ''
  },
  brandId: localStorage.getItem('brandId') || '',
  corporationId: localStorage.getItem('corporationId') || '',
  workplaceId: localStorage.getItem('workplaceId') || ''
};

class DrawerHelper extends Component {

  constructor(props) {
    super(props);
    let shift = { ...initialState.shift, ...props.shift };
    this.state = {
      ...initialState,
      ...shift,
      weekStart: props.weekStart
    };
  }

  componentDidMount() {
    this.getWorkplaces();
    this.getPositions();
  }

  componentWillReceiveProps(nextProps) {
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

  getWorkplaces = () => {
    dataHelper.getCurrentWorkplaces()
      .then((workplaces) => this.setState({ workplaces }))
      .catch(err => console.error(err));
  };

  getPositions = (workplaceId = this.state.workplaceId) => {
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
  };

  handleShiftSubmit = (shift) => {
    const { handleSubmit } = this.props;
    if (handleSubmit) handleSubmit(shift);
    this.setState(initialState);
  };

  updateFormState = (dataValue) => {
    if (dataValue.unpaidBreakInMinutes) {
      const hours = Math.floor(dataValue.unpaidBreakInMinutes / 60);
      let minutes = dataValue.unpaidBreakInMinutes % 60;
      if (minutes < 10){
        minutes = '0' + minutes;
      }
      dataValue.unpaidBreak = hours + ":" + minutes;
    }
    const shift = Object.assign(this.state.shift, dataValue);
    this.setState({ shift });
  };

  closeShiftDrawer = () => {
    const { closeDrawer } = this.props;
    this.setState(initialState);
    if (closeDrawer) closeDrawer();
  };

  render() {

    const { width, open } = this.props;
    const { shift, workplaces, positions, workplaceId, weekStart } = this.state;
    let positionOptions = [{ key: 'select', value: 0, text: 'Select Workplace'}];

    if (!workplaces) {
      return (<Loading />);
    }

    const workplaceOptions = workplaces.map(workplace => ({
      key: workplace.id,
      value: workplace.id,
      text: workplace.workplaceName,
      selected: this.state.workplaceId === workplace.id
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
        text: 'Select Position',
        disabled: true
      });
    }
    if (!workplaceId) {
      workplaceOptions.unshift({
        key: 'selected',
        value: 0,
        text: 'Select Workplace',
        disabled: true
      });
    }
    const recurringOptions = [{
      key: 'none',
      value: 'none',
      text: 'DOES NOT REPEAT',
    }, {
      key: 'weekly',
      value: 'weekly',
      text: 'WEEKLY',
    }];
    return (
      <Drawer
        width={width}
        openSecondary={true}
        docked={false}
        onRequestChange={this.closeShiftDrawer} open={open}>
        <div className="drawer-section edit-drawer-section">
          <div className="drawer-heading col-md-12">
            <IconButton style={closeButton} onClick={this.closeShiftDrawer}>
              <Image src='/images/Icons_Red_Cross.png' size="mini" />
            </IconButton>
            <h2 className="text-center text-uppercase">Add Hours</h2>
          </div>
          <div className="col-md-12 form-div edit-drawer-content">
            <div className="form-group">
              <label className="text-uppercase blue-heading">Scheduling Method</label>
              <select disabled className="ui fluid dropdown add-shift-dropdown">
                {methodOptions && methodOptions.map(option => <option {...option} >{option.text}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="text-uppercase blue-heading">Workplace</label>
              <Dropdown
                name="workplaceId"
                onChange={(_, data) => this.handleChange({ target: data })}
                value={shift.workplaceId || 0}
                fluid
                selection
                options={workplaceOptions} />
            </div>
            <div className="form-group">
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
            </div>
            <div className="form-group">
              <StartToEndTimePicker formCallBack={this.updateFormState} />
            </div>
            <div className="form-group">
              <label className="text-uppercase blue-heading">Recurring Shift</label>
              <Dropdown
                name="recurringShift"
                onChange={(_, data) => this.handleChange({ target: data })}
                value={shift.recurringShift}
                fluid
                selection
                options={recurringOptions} />
            </div>
            <div className="form-group">
              <ShiftDaySelector startDate={weekStart} formCallBack={this.updateFormState} />
            </div>
            {/*<div className="form-group">
              <StartToEndDatePicker formCallBack={this.updateFormState} />
            </div>*/}
            <div className="form-group">
              <NumberOfTeamMembers formCallBack={this.updateFormState} />
              <div className="performance-tagline">
                <p>
                  At maximum, <span className="color-green">{shift.numberOfTeamMembers * 2} employees </span>
                  will report for this shift: {shift.numberOfTeamMembers || 0} job trainers, {shift.numberOfTeamMembers || 0} job shadowers
                </p>
              </div>
            </div>
            <div className="form-group">
              <UnpaidBreakInMinutes formCallBack={this.updateFormState} />
            </div>
            <div className="form-group">
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
            </div>
            <div className="form-group ui form">
              <label className="text-uppercase blue-heading">Instructions</label>
              <TextArea name="instructions" onChange={(_, data) => this.handleChange({ target: data })} rows="3" />
            </div>
            <div className="drawer-footer">
              <div className="buttons text-center">
                <CircleButton handleClick={this.closeShiftDrawer} type="white" title="Cancel" />
                <CircleButton handleClick={() => this.handleShiftSubmit(shift)} type="blue" title="Add Shift" />
              </div>
            </div>
          </div>
        </div>
      </Drawer>
    );
  }
}

export default withApollo(DrawerHelper);
