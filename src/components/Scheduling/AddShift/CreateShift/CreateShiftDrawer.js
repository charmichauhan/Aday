import React, { Component } from 'react'
import Drawer from 'material-ui/Drawer';
import IconButton from 'material-ui/IconButton';
import { Image, TextArea, Dropdown, Grid, Button } from 'semantic-ui-react';
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
            <IconButton className="pull-left" style={closeButton} onClick={this.closeShiftDrawer}>
              <Image src='/images/Icons_Red_Cross.png' size="mini" />
            </IconButton>
            <h2 className="text-center text-uppercase">Add Hours</h2>
            <Button className="pull-right advance-options">Advanced
            </Button>
          </div>
          <div className="col-md-12 form-div edit-drawer-content">
            <Grid columns={2}>
              <Grid.Row>
                <Grid.Column width={2}>
                  <Image src="/assets/Icons/scheduling-method.png" size="mini" className="display-inline" />
                </Grid.Column>
                <Grid.Column width={14}>
                  <label className="text-uppercase blue-heading">Scheduling Method</label>
                  <select disabled className="ui fluid dropdown add-shift-dropdown">
                    {methodOptions && methodOptions.map(option => <option {...option} >{option.text}</option>)}
                  </select>
                </Grid.Column>
              </Grid.Row>

              <Grid.Row>
                <Grid.Column width={2}>
                  <Image src="/assets/Icons/workplace.png" size="mini" className="display-inline" />
                </Grid.Column>
                <Grid.Column width={14}>
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
                <Grid.Column width={2}>
                  <Image src="/assets/Icons/certification.png" size="mini" className="display-inline" />
                </Grid.Column>
                <Grid.Column width={14}>
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
                <Grid.Column width={2}>
                  <Image src="/assets/Icons/shift-time.png" size="mini" className="display-inline" />
                </Grid.Column>
                <Grid.Column width={14}>
                  <StartToEndTimePicker formCallBack={this.updateFormState} />
                </Grid.Column>
              </Grid.Row>

              <Grid.Row>
                <Grid.Column width={2}>
                  <Image src="/assets/Icons/repeating-shifts.png" size="mini" className="display-inline" />
                </Grid.Column>
                <Grid.Column width={14}>
                  <label className="text-uppercase blue-heading">Recurring Shift</label>
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
                <Grid.Column width={2}>
                  <Image src="/assets/Icons/shift-date.png" size="mini" className="display-inline" />
                </Grid.Column>
                <Grid.Column width={14}>
                  <ShiftDaySelector startDate={weekStart} formCallBack={this.updateFormState} />
                </Grid.Column>
              </Grid.Row>

              <Grid.Row>
                <Grid.Column width={2}>
                  <Image src="/assets/Icons/team-members.png" size="mini" className="display-inline" />
                </Grid.Column>
                <Grid.Column width={14}>
                  <NumberOfTeamMembers formCallBack={this.updateFormState} />
                  <div className="performance-tagline">
                    <p>
                      At maximum, <span className="color-green">{shift.numberOfTeamMembers * 2} employees </span>
                      will report for this shift: {shift.numberOfTeamMembers || 0} job trainers, {shift.numberOfTeamMembers || 0} job shadowers
                    </p>
                  </div>
                </Grid.Column>
              </Grid.Row>

              <Grid.Row>
                <Grid.Column width={2}>
                  <Image src="/assets/Icons/scheduled-break.png" size="mini" className="display-inline" />
                </Grid.Column>
                <Grid.Column width={14}>
                  <UnpaidBreakInMinutes formCallBack={this.updateFormState} />
                </Grid.Column>
              </Grid.Row>

              <Grid.Row>
                <Grid.Column width={2}>
                  <Image src="/assets/Icons/tags.png" size="mini" className="display-inline" />
                </Grid.Column>
                <Grid.Column width={14}>
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
                <Grid.Column width={2}>
                  <Image src="/assets/Icons/instructions.png" size="mini" className="display-inline" />
                </Grid.Column>
                <Grid.Column width={14}>
                  <label className="text-uppercase blue-heading">Instructions</label>
                  <TextArea className="form-control" name="instructions" onChange={(_, data) => this.handleChange({ target: data })} rows="3" />
                </Grid.Column>
              </Grid.Row>
            </Grid>

            <div className="drawer-footer">
              <div className="buttons text-center">
                <CircleButton handleClick={this.closeShiftDrawer} type="white" title="Cancel" />
                <CircleButton type="green" title="Assign Shift" />
                <CircleButton handleClick={() => this.handleShiftSubmit(shift)} type="blue" title="Add Hours" />
              </div>
            </div>
          </div>
        </div>
      </Drawer>
    );
  }
}

export default withApollo(DrawerHelper);
