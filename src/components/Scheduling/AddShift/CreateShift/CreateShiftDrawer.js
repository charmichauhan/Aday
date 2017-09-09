import React, { Component } from 'react'
import Drawer from 'material-ui/Drawer';
import IconButton from 'material-ui/IconButton';
import TimePicker from 'material-ui/TimePicker';
import { Image, TextArea, Dropdown } from 'semantic-ui-react';
import cloneDeep from 'lodash/cloneDeep';
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

import './select.css';

const methodOptions = [{ key: 'standard', value: 'standard', text: 'Standard', disabled: true, selected: true }];
const startDate = moment().startOf('week');

class DrawerHelper extends Component {

  constructor(props) {
    super(props);
    this.state = {
      shift: {
        ...cloneDeep(props.shift),
        shiftMethod: 'standard',
        tags: [],
        tagOptions: [],
        brandId: localStorage.getItem('brandId'),
        corporationId: localStorage.getItem('corporationId'),
        workplaceId: localStorage.getItem('workplaceId')
      },
      brandId: localStorage.getItem('brandId'),
      corporationId: localStorage.getItem('corporationId'),
      workplaceId: localStorage.getItem('workplaceId')
    }
  }

  componentDidMount() {
    this.getWorkplaces();
    this.getPositions();
  }

  getWorkplaces = () => {
    dataHelper.getCurrentWorkplaces()
      .then((workplaces) => this.setState({ workplaces }))
      .catch(err => console.error(err));
  };

  getPositions = (workplaceId = this.state.workplaceId) => {
    CreateShiftHelper.getRelevantPositions(workplaceId)
      .then((positions) => this.setState({ positions }))
      .catch(err => console.error(err));
  };

  handleChange = (event) => {
    const { shift } = this.state;
    const { name, value } = event.target;
    shift[name] = value;
    if (name === 'tags') shift.tagOptions = shift.tags.map((text) => ({ text, value: text, key: text }));
    this.setState({ shift });
    if (name === 'workplaceId') this.getPositions(value);
  };

  updateFormState = (dataValue) => {
    if (dataValue.unpaidBreakInMinutes) {
      const hours = Math.floor(dataValue.unpaidBreakInMinutes / 60);
      let minutes = dataValue.unpaidBreakInMinutes % 60;
      if (minutes < 10){
        minutes = 0 + minutes;
      }
      const finalTime = hours + ":" + minutes;
      dataValue.unpaidBreak = finalTime;
    }
    const shift = Object.assign(this.state.shift, dataValue);
    this.setState({ shift });
  };

  render() {

    const { width, open, closeDrawer, handleSubmit } = this.props;
    const { shift, workplaces, positions } = this.state;

    if (!workplaces || !positions) {
      return (<Loading />);
    }

    const workplaceOptions = workplaces.map(workplace => ({
      key: workplace.id,
      value: workplace.id,
      text: workplace.workplaceName,
      selected: this.state.workplaceId === workplace.id
    }));
    const positionOptions = positions.map(position => ({
      key: position.id,
      value: position.id,
      text: position.positionName
    }));
    return (
      <Drawer
        width={width}
        openSecondary={true}
        docked={false}
        onRequestChange={closeDrawer} open={open}>
        <div className="drawer-section edit-drawer-section">
          <div className="drawer-heading col-md-12">
            <IconButton style={closeButton} onClick={closeDrawer}>
              <Image src='/images/Icons_Red_Cross.png' size="mini" />
            </IconButton>
            <h2 className="text-center text-uppercase">Add Shift</h2>
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
                value={shift.workplaceId}
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
                value={shift.positionId}
                fluid
                selection
                options={positionOptions} />
            </div>
            <div className="form-group">
              <div className="time-wrapper">
                <label className="text-uppercase blue-heading">Start Time</label>
                <TimePicker
                  hintText="Start Time"
                  minutesStep={15}
                  onChange={(_, date) => this.handleChange({ target: { name: 'startTime', value: date.toUTCString() }})} />
              </div>
              <div className="time-wrapper">
                <label className="text-uppercase blue-heading">End Time</label>
                <TimePicker
                  hintText="End Time"
                  minutesStep={15}
                  onChange={(_, date) => this.handleChange({ target: { name: 'endTime', value: date.toUTCString() }})} />
              </div>
            </div>
            <div className="form-group">
              <ShiftDaySelector startDate={startDate} formCallBack={this.updateFormState} />
            </div>
            <div className="form-group">
              <NumberOfTeamMembers formCallBack={this.updateFormState} />
            </div>
            <div className="performance-tagline">
              <p>At maximum, <span className="color-green">4 employees</span> will report for this shift: 2 job
                trainers, 2 job shadowers</p>
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
                <CircleButton handleClick={closeDrawer} type="white" title="Cancel" />
                <CircleButton handleClick={() => handleSubmit(shift)} type="blue" title="Add Shift" />
              </div>
            </div>
          </div>
        </div>
      </Drawer>
    );
  }
}

export default withApollo(DrawerHelper);
