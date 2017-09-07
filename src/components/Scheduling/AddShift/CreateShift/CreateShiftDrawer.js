import React, { Component } from 'react'
import Drawer from 'material-ui/Drawer';
import IconButton from 'material-ui/IconButton';
import { Image, TextArea } from 'semantic-ui-react';
import cloneDeep from 'lodash/cloneDeep';

import { closeButton } from '../../../styles';
import CircleButton from '../../../helpers/CircleButton';
import NumberOfTeamMembers from './NumberOfTeamMembers';

import './select.css';

const methodOptions = [{ key: 'standard', value: 'standard', text: 'Standard', disabled: true, selected: true }];
const workplaceOptions = [{ key: 'chao-center', value: 'chao-center', text: 'Chao Center', disabled: true, selected: true }];
const positionOptions = [{ key: 'line-cook', value: 'line-cook', text: 'Line Cook', disabled: true, selected: true }];

export default class DrawerHelper extends Component {

  constructor(props) {
    super(props);
    this.state = {
      shift: { ...cloneDeep(props.shift), shiftMethod: 'standard' }
    }
  }

  componentWillReceiveProps(nextProps) {
    const shift = cloneDeep(nextProps.shift);
    this.setState({ shift });
  }

  handleChange = (event) => {
    const { shift } = this.state;
    const { name, value } = event.target;
    shift[name] = value;
    this.setState({ shift });
  };

  updateFormState = (dataValue) => {

  };

  render() {

    const { width, open, closeDrawer, handleSubmit } = this.props;
    const { shift } = this.state;

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
              <select className="ui fluid dropdown add-shift-dropdown">
                {methodOptions && methodOptions.map(option => <option {...option} >{option.text}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="text-uppercase blue-heading">Workplace</label>
              <select className="ui fluid dropdown add-shift-dropdown">
                {workplaceOptions && workplaceOptions.map(option => <option {...option} >{option.text}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="text-uppercase blue-heading">Position</label>
              <select className="ui fluid dropdown add-shift-dropdown">
                {positionOptions && positionOptions.map(option => <option {...option} >{option.text}</option>)}
              </select>
            </div>
            <div className="form-group">
              <NumberOfTeamMembers formCallBack={this.updateFormState} />
            </div>
            <div className="performance-tagline">
              <p>At maximum, <span className="color-green">4 employees</span> will report for this shift: 2 job trainers, 2 job shadowers</p>
            </div>
            <div className="form-group">
              <NumberOfTeamMembers formCallBack={this.updateFormState} />
            </div>
            <div className="form-group ui form">
              <label className="text-uppercase blue-heading">Instructions</label>
              <TextArea rows="3" />
            </div>
            <div className="form-group">
              <label className="text-uppercase blue-heading">Advanced Options</label>
              <div className="advanced-option-content">
                <p>Allow job shadowers: <span>No</span></p>
                <p>Restrict gender: <span>Male</span></p>
                <p>Maximum Wage for Shift: <span>$21.00</span></p>
                <p>Invited Part-time Team Members</p>
                <li>Carol Brown</li>
                <p>Assigned Full-time Team Members</p>
                <li>Carol Brown</li>
              </div>
            </div>
            <div className="drawer-footer">
              <div className="buttons text-center">
                <CircleButton handleClick={closeDrawer} type="white" title="Cancel" />
                <CircleButton handleClick={() => handleSubmit(shift)} type="blue" title="Update Name" />
              </div>
            </div>
          </div>
        </div>
      </Drawer>
    );
  }
}
