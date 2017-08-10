import React, { Component } from 'react'
import Drawer from 'material-ui/Drawer';
import IconButton from 'material-ui/IconButton';
import RaisedButton from 'material-ui/RaisedButton';
import { Image, Input, Divider } from 'semantic-ui-react';
import { graphql, compose } from 'react-apollo';
import moment from 'moment';
import { find, pick } from 'lodash';

import { allUsersQuery, deleteShiftMutation, updateShiftMutation } from './EditShiftDrawer.graphql';
import TeamMemberCard from './TeamMemberCard';
import { leftCloseButton } from '../../../styles';
import CircleButton from '../../../helpers/CircleButton';

import './shift-edit.css';

const unassignedTeamMember = {
  user: {
    id: 0,
    firstName: 'Unassigned',
    lastName: '',
    avatarUrl: 'http://www.iiitdm.ac.in/img/bog/4.jpg',
  },
  content: 'Leave this field empty to warn app credit!',
  status: 'unassigned'
};

const unassignedJobShadower = { ...unassignedTeamMember };

const initialState = {
  teamMembers: [{
    user: {
      firstName: 'Eric',
      otherNames: 'Wise',
      avatar: 'https://pickaface.net/assets/images/slides/slide2.png',
    },
    content: 'Seniority: 0003',
    status: 'accepted'
  }, {
    ...unassignedTeamMember
  }],

  jobShadowers: [{
    user: {
      firstName: 'Eric',
      otherNames: 'Wise',
      avatar: 'https://pickaface.net/assets/images/slides/slide2.png',
    },
    content: 'Seniority: 0003 . Current hours: 37',
    status: 'accepted'
  }, {
    user: {
      firstName: 'Carol',
      otherNames: 'Brown',
      avatar: 'http://devilsworkshop.org/files/2013/01/enlarged-facebook-profile-picture.jpg',
    },
    content: 'Current hours: 20 . You\'ve earned 1 credit',
    status: 'pending'
  }],
  users: [{
    id: 1,
    firstName: 'Eric',
    otherNames: 'Wise',
    avatar: 'https://pickaface.net/assets/images/slides/slide2.png',
  }, {
    id: 2,
    firstName: 'Carol',
    otherNames: 'Brown',
    avatar: 'http://devilsworkshop.org/files/2013/01/enlarged-facebook-profile-picture.jpg',
  }, {
    id: 3,
    firstName: 'Werner',
    otherNames: 'Stroman',
    avatar: '/images/employee/1.jpg',
  }, {
    id: 4,
    firstName: 'Barton',
    otherNames: 'Schmitt',
    avatar: '/images/employee/2.jpg',
  }, {
    id: 5,
    firstName: 'Mikayla',
    otherNames: 'Hessel',
    avatar: '/images/employee/3.jpg',
  }, {
    id: 6,
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
    if (status === 'accepted') return 'green';
    if (status === 'unassigned') return 'red';
    if (status === 'pending') return 'orange';
    return 'orange';
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

  getUserById = (id, isAssigned) => {
    const users = this.props.users;
    let foundWorker = find(users.allUsers.edges, (user) => user.node.id === id);
    if (!foundWorker) foundWorker = { node: unassignedTeamMember.user };
    return {
      user: pick(foundWorker.node, ['id', 'avatarUrl', 'firstName', 'lastName']),
      status: isAssigned ? 'accepted' : 'pending',
      content: foundWorker.node.content || 'CURRENT HOURS: 37'
    };
  };

  getUsers = () => {
    const usersData = this.props.users;
    return usersData.allUsers.edges.map(({ node }) => pick(node, ['id', 'avatarUrl', 'firstName', 'lastName']));
  };

  getInitialData = ({ shift: { workersAssigned = [], workersInvited = [], workersRequestedNum = 0 } }) => {
    workersAssigned = workersAssigned.map(worker => {
      if (typeof worker === 'string') return this.getUserById(worker, true);
      return unassignedTeamMember;
    });
    workersInvited = workersInvited.map(worker => {
      if (typeof worker === 'string') return this.getUserById(worker);
      return unassignedTeamMember;
    });
    const teamMembers = [...workersAssigned, ...workersInvited];
    while (teamMembers.length < workersRequestedNum) {
      teamMembers.push({ ...unassignedTeamMember });
    }
    return teamMembers;
  };

  setTeamMember = (user, index) => {
    const { teamMembers } = this.state;
    if (user.id) {
      teamMembers[index].user = user;
      teamMembers[index].content = 'Current hours: 20 . You\'ve earned 1 credit';
      teamMembers[index].status = 'accepted';
    } else {
      teamMembers[index] = { ...unassignedTeamMember };
    }
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
    if (user.id) {
      jobShadowers[index].user = user;
      jobShadowers[index].content = 'Current hours: 20 . You\'ve earned 1 credit';
      jobShadowers[index].status = 'accepted';
    } else {
      jobShadowers[index] = { ...unassignedTeamMember };
    }
    this.setState({ jobShadowers });
  };

  render() {
    const {
      shift = {},
      width = 600,
      openSecondary = true,
      docked = false,
      open
    } = this.props;

    const { jobShadowers } = this.state;
    const teamMembers = this.getInitialData(this.props);
    const users = this.getUsers();

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
            <h5 className="confirm-popup">Add Team Members</h5>
            <div className="drawer-right">
              <RaisedButton label="History" onClick={this.handleShiftHistoryDrawer} />
            </div>
          </div>
          <div className="drawer-content scroll-div">
            <div className="member-list">
              <h5>TEAM MEMBERS ({teamMembers.length})</h5>
              {teamMembers &&
              teamMembers.map((tm, i) => {
                return (
                  <TeamMemberCard
                    avatarUrl={tm.user.avatarUrl}
                    firstName={tm.user.firstName}
                    lastName={tm.user.lastName}
                    content={tm.content}
                    key={i}
                    id={i}
                    users={users}
                    color={this.borderColor(tm.status) + 'Border'}
                    handleRemove={() => this.removeTeamMember(i)}
                    onSelectChange={this.setTeamMember}
                  />
                )
              })
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
                  avatarUrl={tm.user.avatar}
                  firstName={tm.user.firstName}
                  lastName={tm.user.otherNames}
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
                <p><b>Work place</b>: {shift.workplaceByWorkplaceId.workplaceName}</p>
                <p><b>Position</b>: {shift.positionByPositionId.positionName}</p>
                <p><b>Shift Date</b>: {moment(shift.startTime).format('dddd, MMMM Do YYYY')}</p>
                <p><b>Start Time</b>: {moment(shift.startTime).format('hh:mm A')}</p>
                <p><b>End Time</b>: {moment(shift.endTime).format('hh:mm A')}</p>
                <p><b>Unpaid break (minutes)</b>: {!shift.unpaidBreakTime && '0' || shift.unpaidBreakTime} minutes</p>
                <p><b>bonus payment per hour</b>: $0.00</p>
                <p><b>job shadowing shift</b>: No</p>
              </div>

              <h5>INSTRUCTIONS</h5>
              <p className="dimmedText">{shift.instructions}</p>
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

const DrawerHelperComponent = compose(graphql(deleteShiftMutation, {
    props: ({ ownProps, mutate }) => ({
      deleteShiftById: (clientMutationId, id) => mutate({
        variables: { clientMutationId, id },
        updateQueries: {
          allShiftsByWeeksPublished: (previousQueryResult, { mutationResult }) => {
            let newEdges = [];
            previousQueryResult.allShifts.edges.map((value) => {
              if (value.node.id !== mutationResult.data.deleteShiftById.shift.id) {
                newEdges.push(value)
              }
            });
            previousQueryResult.allShifts.edges = newEdges;
            return { allShifts: previousQueryResult.allShifts };
          }
        }
      })
    })
  }),
  graphql(updateShiftMutation, { name: 'updateShift' }),
  graphql(allUsersQuery, {
    name: 'teamMembers',
    options: (ownProps) => ({ variables: { positionId: ownProps.shift && ownProps.shift.positionByPositionId.id } }),
    props: ({ teamMembers, ownProps }) => ({ teamMemberNodes: teamMembers.allJobs && teamMembers.allJobs.edges })
  }))
(DrawerHelper);

export default DrawerHelperComponent;
