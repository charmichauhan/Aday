import React, { Component } from 'react'
import Drawer from 'material-ui/Drawer';
import IconButton from 'material-ui/IconButton';
import { Image, Input, Divider } from 'semantic-ui-react';
import RaisedButton from 'material-ui/RaisedButton';
import cloneDeep from 'lodash/cloneDeep';

import TeamMemberCard from './TeamMemberCard'
import { leftCloseButton, colors } from '../../../styles';
import CircleButton from '../../../helpers/CircleButton';
import './shift-edit.css';

const initialState = {
  brand: {
    id: '',
    name: '',
    image: ''
  },
  blob: null,
  team_members: [
    {
      user: {
        firstName: 'Eric',
        otherNames: 'Wise',
        avatar: 'https://pickaface.net/assets/images/slides/slide2.png',
      },
      content: 'Seniority: 0003',
      status: 'accepted'
    },
    {
      user: {
        firstName: 'Unassigned',
        otherNames: '',
        avatar: 'http://www.iiitdm.ac.in/img/bog/4.jpg',
      },
      content: 'Leave this field empty to warn app credit!',
      status: 'rejeted'
    }
  ],

  job_shadowers: [
    {
      user: {
        firstName: 'Eric',
        otherNames: 'Wise',
        avatar: 'https://pickaface.net/assets/images/slides/slide2.png',
      },
      content: 'Seniority: 0003 . Current hours: 37',
      status: 'accepted'
    },
    {
      user: {
        firstName: 'Carol',
        otherNames: 'Brown',
        avatar: 'http://devilsworkshop.org/files/2013/01/enlarged-facebook-profile-picture.jpg',
      },
      content: 'Current hours: 20 . You\'ve earned 1 credit',
      status: 'pending'
    }
  ]
};

class DrawerHelper extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ...initialState,
      brand: cloneDeep(props.brand || initialState.brand)
    };
  }

  componentWillReceiveProps(nextProps) {
    const brand = cloneDeep(nextProps.brand || initialState.brand);
    this.setState({ brand });
  }

  borderColor = status => {
    switch (status) {
      case 'accepted':
        return 'green';
      case 'rejected':
        return 'red';
      default:
        return 'orange';
    }
  };

  handleSubmitEvent = () => {
    // Resetting the field values.
    this.props.handleSubmit(this.state.brand);
    this.setState({ ...initialState });
  };

  handleCloseDrawer = () => {
    /*this.setState({ blob: undefined });*/
    this.props.handlerClose();
  };

  handleChange = (event) => {
    const { name, value } = event.target;
    const brand = Object.assign(this.state.brand, { [name]: value });
    this.setState({ brand });
  };

  handleShiftHistoryDrawer = () => {
    this.props.handlerClose();
    this.props.handleHistory();
  };

  render() {
    const {
      brand = {},
      width = 600,
      open,
      openSecondary = true,
      docked = false
    } = this.props;

    const actionTypes = [{
      type: 'white',
      title: 'Cancel',
      handleClick: function () { }
    }, {
      type: 'red',
      title: 'DELETE SHIFT',
      handleClick: function () { },
      image: '/images/modal/close.png'
    }, {
      type: 'blue',
      title: 'SAVE UPDATE',
      handleClick: function () { },
      image: '/assets/Icons/save-icon.png'
    }];

    const actions = actionTypes.map((action, index) =>
      (<CircleButton key={index} type={action.type} title={action.title} handleClick={action.handleClick}
                     image={action.image} imageSize={action.imageSize} />)
    );

    return (
      <Drawer docked={docked} width={width} openSecondary={openSecondary} onRequestChange={this.handleCloseDrawer}
              open={open}>
        <div className="drawer-section">
          <div className="drawer-heading col-md-12">
            <IconButton style={leftCloseButton} onClick={this.handleCloseDrawer}>
              <Image src="/images/Icons_Red_Cross.png" size="mini" />
            </IconButton>
            <h5 className="confirm-popup">Line Cook</h5>
            <div className="drawer-right">
              <RaisedButton label="History" onClick={this.handleShiftHistoryDrawer} />
            </div>
          </div>
          <div className="drawer-content scroll-div">
              <div className="member_list">
                <h5>TEAM MEMBERS (2)</h5>
                {this.state.team_members &&
                  this.state.team_members.map((tm, i) => (
                    <TeamMemberCard
                      avatar={tm.user.avatar}
                      firstName={tm.user.firstName}
                      otherNames={tm.user.otherNames}
                      content={tm.content}
                      color={this.borderColor(tm.status) + 'Border'}
                      key={i}
                    />
                  ))
                }
                <div className="btn-member">
                  <RaisedButton label="ADD TEAM MEMBER"/>
                </div>

              </div>
              <div className="member_list">
                <h5>JOB SHADOWERS (2)</h5>
                {this.state.job_shadowers &&
                  this.state.job_shadowers.map((tm, i) => (
                    <TeamMemberCard
                      avatar={tm.user.avatar}
                      firstName={tm.user.firstName}
                      otherNames={tm.user.otherNames}
                      content={tm.content}
                      color={this.borderColor(tm.status) + 'Border'}
                      key={i}
                    />
                  ))
                }
                <div className="btn-member">
                  <RaisedButton label="ADD JOB SHADOWER"/>
                </div>
              </div>
            <div className="shift-details">
            <Divider/>
              <div className="shift-heading">
                <img src="/assets/Icons/copying.png" />
                <h5>SHIFT DETAILS</h5>
              </div>
            <Input fluid type="text" placeholder="NAME THIS SHIFT TO SAVE IT AS A TAMPLATE"/>
            <div className="shiftDetails">
              <p><b>Work place</b>: Harvard Business School</p>
              <p>
                <b>Position</b>: Line Cook
              </p>
              <p>
                <b>Shift Date</b>: Monday, September 3 2016
              </p>
              <p>
                <b>Start Time</b>: 10:00PM
              </p>
              <p>
                <b>End Time</b>: 5:00 PM
              </p>
              <p>
                <b>Unpaid break (minutes)</b>: 30 minutes
              </p>
              <p>
                <b>bonus payment per hour</b>: $0.00
              </p>
              <p>
                <b>job shadowing shift</b>: No
              </p>
            </div>

            <h5>INSTRUCTIONS</h5>
            <p className="dimmedText">Enter additional information about this shift</p>
          </div>
          </div>
        <div className="drawer-footer">
          <div className="buttons text-center">
            {actions}
          </div>
        </div>
        </div>
      </Drawer>
    );
  };
}

export default DrawerHelper;
