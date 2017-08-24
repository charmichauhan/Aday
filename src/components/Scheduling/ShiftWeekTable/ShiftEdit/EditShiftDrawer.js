import React, { Component } from 'react'
import Drawer from 'material-ui/Drawer';
import IconButton from 'material-ui/IconButton';
import RaisedButton from 'material-ui/RaisedButton';
import Modal from '../../../helpers/Modal';
import { Image, Input, Divider } from 'semantic-ui-react';
import { graphql, compose } from 'react-apollo';
import moment from 'moment';
import { find, pick } from 'lodash';
import { allUsersQuery, deleteShiftMutation, updateShiftMutation, allShiftMarkets, updateShiftMarket, createShiftMarket} from './EditShiftDrawer.graphql';
import TeamMemberCard from './TeamMemberCard';
import { leftCloseButton } from '../../../styles';
import CircleButton from '../../../helpers/CircleButton';
const uuidv4 = require('uuid/v4');
import './shift-edit.css';

const unassignedTeamMember = {
  user: {
    id: 0,
    firstName: 'Unassigned',
    lastName: '',
    avatarUrl: 'http://www.iiitdm.ac.in/img/bog/4.jpg',
  },
  content: 'There is currenlty an open position',
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
    content: '',
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
    this.state = {...initialState,
                  teamMembers: this.getInitialData(this.props),
                  deleteModalPopped: false,};
  }

  deleteModalClose = () => {
    this.setState({
      deleteModalPopped: false
    });
  };

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
    this.setState({deleteModalPopped: true});
  };

  handleSaveShift = () => {

      const shiftPatch = {}
      shiftPatch['workersAssigned'] = []
      shiftPatch['workersRequestedNum'] = this.state.teamMembers.length
    
      this.state.teamMembers.map((value) => {
        if(value.user.id != 0 && shiftPatch['workersAssigned'].indexOf(value)==-1){
              shiftPatch['workersAssigned'].push(value.user.id)
        }
      })
      this.props.updateShift({
          variables: { data:
                    {id: this.props.shift.id, shiftPatch: shiftPatch }
                }
      }).then(({ data }) => {
        this.props.handlerClose();
        console.log('update shift', data);
      }).catch((error) => {
        console.log('there was an error sending the query', error);
      });

      let removedUsers = []
      this.props.shift.workersAssigned.map((value) => {
        if (shiftPatch['workersAssigned'].includes(value)){
        } else{
          removedUsers.push(value)
        }
      })
      //UPDATE UNASSIGNED USERS
      removedUsers.map((value) => {
        let marketId = null
        this.props.shiftMarkets.allMarkets.edges.map( (v,i) => {
                if (v.node.workerId == value){
                  marketId = v.node.id;
                }
        })
        if(marketId) {         
              this.props.updateMarket({
                  variables: { data:
                      { id: marketId, marketPatch: {isBooked: false, workerResponse: "NONE", clockInDate: null, clockOutDate: null} }
                    }
                  }).then(({ data }) => {
                    console.log('update market', data);
                  }).catch((error) => {
                    console.log('there was an error sending the query', error);
                  });
        }
      })  
      //UPDATE ASSIGNED USERS
      shiftPatch['workersAssigned'].map((value) => {
              let marketId = null
              //seeing if shift's markets has this user 
              this.props.shiftMarkets.allMarkets.edges.map( (v,i) => {
                if (v.node.workerId == value){
                  marketId = v.node.id;
                }
              })
                 
              // market exists
              if(marketId) {        
              this.props.updateMarket({
                  variables: { data:
                      { id: marketId, marketPatch: {isBooked: true, workerResponse: "NONE"} }
                    }
                  })
              } else {
                this.props.createMarket({
                  variables: 
                    { data:
                        {market:
                          { id: uuidv4(), 
                            shiftId: this.props.shift.id,
                            workerId: value,
                            isEmailed: false,
                            isCalled: false,
                            isTexted: false,
                            isBooked: true,
                            workerResponse: "NONE"
                          }}
                        }
                  })
                  
              }
      })
  }

  addTeamMember = () => {
    const { teamMembers } = this.state;
    teamMembers.push({ ...unassignedTeamMember });
    this.setState({ teamMembers });
  };

  removeTeamMember = (i) => {
    const { teamMembers } = this.state;
    teamMembers.splice(i, 1);
    this.setState({ teamMembers });
  };

  deleteShift = () => {
    let id = this.props.shift.id;
    let that = this;
    that.props.deleteShiftById(uuidv4(), id)
    .then(({ data }) => {
      console.log('Delete Data', data);
    }).catch((error) => {
      console.log('there was an error sending the query', error);
    });
    that.setState({ deleteModalPopped: false });
    this.handleCloseDrawer();
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
      teamMembers[index].content = '';
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
      jobShadowers[index].content = '';
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

    const { teamMembers, jobShadowers } = this.state;
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
    let deleteShiftAction = [{ type: 'white', title: 'Cancel', handleClick: this.handleClose, image: false },
      { type: 'red', title: 'Delete Shift', handleClick: this.deleteShift, image: '/images/modal/close.png' }];
    let pastDate = moment().diff(this.props.shift.startTime) > 0;
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

          </div>
          <div className="drawer-content scroll-div">
            <div className="member-list">
              <h5>TEAM MEMBERS ({teamMembers.length})</h5>
              {teamMembers && teamMembers.map((tm, i) => (
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
              ))}
              <div className="btn-member">
                <RaisedButton label="ADD TEAM MEMBER" onClick={this.addTeamMember} />
              </div>

            </div>

            <div className="shift-details">
              <Divider />
              <div className="shift-heading">
                <img src="/assets/Icons/copying.png" />
                <h5>SHIFT DETAILS</h5>
              </div>
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
            {!pastDate ?
             <div className="buttons text-center">
               {actions}
             </div> :
             <h5><p className="dimmedText">Editing Disabled for Past Shifts</p></h5>
            }
            <Modal
              title="Confirm"
              isOpen={this.state.deleteModalPopped}
              message="Are you sure that you want to delete this shift?"
              action={deleteShiftAction}
              closeAction={this.deleteModalClose} />
            </div>
        </div>
      </Drawer>
    );
  };
}


/* Hidden Components Until They Are Connected

              <div className="drawer-right">
              <RaisedButton label="History" onClick={this.handleShiftHistoryDrawer} />
            </div>

      <div className="member-list">
              <h5>JOB SHADOWERS ({jobShadowers.length})</h5>
              {jobShadowers && jobShadowers.map((tm, i) => (
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
              ))}
              <div className="btn-member">
                <RaisedButton label="ADD JOB SHADOWER" onClick={this.addJobShadower} />
              </div>
            </div>
*/

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
  graphql(updateShiftMarket, { name: 'updateMarket' }),
  graphql(createShiftMarket, { name: 'createMarket' }),
  graphql(allShiftMarkets, {
    name: 'shiftMarkets',
    options: (ownProps) => ({ variables: { shiftId: ownProps.shift && ownProps.shift.id }})
  }),
  graphql(allUsersQuery, {
    name: 'teamMembers',
    options: (ownProps) => ({ variables: { positionId: ownProps.shift && ownProps.shift.positionByPositionId.id } }),
    props: ({ teamMembers, ownProps }) => ({ teamMemberNodes: teamMembers.allJobs && teamMembers.allJobs.edges })
  }))
(DrawerHelper);

export default DrawerHelperComponent;
