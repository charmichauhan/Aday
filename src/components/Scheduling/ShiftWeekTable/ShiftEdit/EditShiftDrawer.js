import React, { Component } from 'react'
import Drawer from 'material-ui/Drawer';
import IconButton from 'material-ui/IconButton';
import { Image, Input, Divider } from 'semantic-ui-react';
import RaisedButton from 'material-ui/RaisedButton';

import TeamMemberCard from './TeamMemberCard'
import { leftCloseButton } from '../../../styles';
import CircleButton from '../../../helpers/CircleButton';

import './shift-edit.css';

const unassignedTeamMember = {
  user: {
    firstName: 'Unassigned',
    otherNames: '',
    avatar: 'http://www.iiitdm.ac.in/img/bog/4.jpg',
  },
  content: 'Leave this field empty to warn app credit!',
  status: 'unassigned'
};

const unassignedJobShadower = { ...unassignedTeamMember };

const initialState = {
  teamMembers: [
    {
      user: {
        firstName: 'Eric',
        otherNames: 'Wise',
        avatar: 'https://pickaface.net/assets/images/slides/slide2.png',
      },
      content: 'Seniority: 0003',
      status: 'accepted'
    },
    { ...unassignedTeamMember }
  ],

  jobShadowers: [
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
  ],
  users: [{
    firstName: 'Eric',
    otherNames: 'Wise',
    avatar: 'https://pickaface.net/assets/images/slides/slide2.png',
  }, {
    firstName: 'Carol',
    otherNames: 'Brown',
    avatar: 'http://devilsworkshop.org/files/2013/01/enlarged-facebook-profile-picture.jpg',
  }, {
    firstName: 'Werner',
    otherNames: 'Stroman',
    avatar: '/images/employee/1.jpg',
  }, {
    firstName: 'Barton',
    otherNames: 'Schmitt',
    avatar: '/images/employee/2.jpg',
  }, {
    firstName: 'Mikayla',
    otherNames: 'Hessel',
    avatar: '/images/employee/3.jpg',
  }, {
    firstName: 'Sydnie',
    otherNames: 'Wehner',
    avatar: '/images/employee/4.jpg',
  }]

};

class DrawerHelper extends Component {

  constructor(props) {
    super(props);
    this.state = { ...initialState };
  }

  borderColor = status => {
    switch (status) {
      case 'accepted':
        return 'green';
        break;
      case 'unassigned':
        return 'red';
        break;
      case 'pending':
        return 'orange';
        break;
      default:
        return 'orange';
    }
  };

  handleCloseDrawer = () => {
    this.props.handlerClose();
  };

  handleShiftHistoryDrawer = () => {
    this.props.handlerClose();
    this.props.handleHistory();
  };

  handleDeleteShift = () => {
    // Shift delete code to be done here
  };

  handleSaveShift = () => {
    // Shift save/update code to be done here
  };

  addTeamMember = () => {
    const { teamMembers } = this.state;
    teamMembers.push({ ...unassignedTeamMember });
    this.setState({ teamMembers });
  };

  removeTeamMember = (i) => {
    const { teamMembers } = this.state;
    // teamMembers[i] = unassignedTeamMember;
    teamMembers.splice(i, 1);
    this.setState({ teamMembers });
  };

  setTeamMember = (user, index) => {
    const { teamMembers } = this.state;
    teamMembers[index].user = user;
    this.setState({ teamMembers });
  };

  addJobShadower = () => {
    const { jobShadowers } = this.state;
    jobShadowers.push({ ...unassignedJobShadower });
    this.setState({ jobShadowers });
  };

  removeJobShadower = (i) => {
    const { jobShadowers } = this.state;
    // teamMembers[i] = unassignedTeamMember;
    jobShadowers.splice(i, 1);
    this.setState({ jobShadowers });
  };

  setJobShadower = (user, index) => {
    const { jobShadowers } = this.state;
    jobShadowers[index].user = user;
    this.setState({ jobShadowers });
  };

  render() {
    const {
      width = 600,
      openSecondary = true,
      docked = false,
      open
    } = this.props;

    const { teamMembers, jobShadowers, users } = this.state;
    const actionTypes = [{
      type: 'white',
      title: 'Cancel',
      handleClick: this.handleCloseDrawer
    }, {
      type: 'red',
      title: 'DELETE SHIFT',
      handleClick: this.handleDeleteShift,
      image: '/images/modal/close.png'
    }, {
      type: 'blue',
      title: 'SAVE UPDATE',
      handleClick: this.handleSaveShift,
      image: '/assets/Icons/save-icon.png'
    }];

    const actions = actionTypes.map((action, index) =>
      (<CircleButton key={index} type={action.type} title={action.title} handleClick={action.handleClick}
                     image={action.image} imageSize={action.imageSize} />)
    );

    return (
      <Drawer docked={docked} width={width}
              openSecondary={openSecondary}
              onRequestChange={this.handleCloseDrawer}
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
            <div className="member-list">
              <h5>TEAM MEMBERS ({teamMembers.length})</h5>
              {teamMembers &&
              teamMembers.map((tm, i) => (
                <TeamMemberCard
                  avatar={tm.user.avatar}
                  firstName={tm.user.firstName}
                  otherNames={tm.user.otherNames}
                  content={tm.content}
                  key={i}
                  id={i}
                  users={users}
                  color={this.borderColor(tm.status) + 'Border'}
                  handleRemove={() => this.removeTeamMember(i)}
                  onSelectChange={this.setTeamMember}
                />
              ))
              }
              <div className="btn-member">
                <RaisedButton label="ADD TEAM MEMBER" onClick={this.addTeamMember} />
              </div>

            </div>
            <div className="member-list">
              <h5>JOB SHADOWERS ({jobShadowers.length})</h5>
              {jobShadowers &&
              jobShadowers.map((tm, i) => (
                <TeamMemberCard
                  avatar={tm.user.avatar}
                  firstName={tm.user.firstName}
                  otherNames={tm.user.otherNames}
                  content={tm.content}
                  key={i}
                  id={i}
                  users={users}
                  color={this.borderColor(tm.status) + 'Border'}
                  handleRemove={() => this.removeJobShadower(i)}
                  onSelectChange={this.setJobShadower}
                />
              ))
              }
              <div className="btn-member">
                <RaisedButton label="ADD JOB SHADOWER" onClick={this.addJobShadower} />
              </div>
            </div>
            <div className="shift-details">
              <Divider />
              <div className="shift-heading">
                <img src="/assets/Icons/copying.png" />
                <h5>SHIFT DETAILS</h5>
              </div>
              <Input fluid type="text" placeholder="NAME THIS SHIFT TO SAVE IT AS A TAMPLATE" />
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
