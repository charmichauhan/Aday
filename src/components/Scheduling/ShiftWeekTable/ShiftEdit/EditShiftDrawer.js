import React, { Component } from 'react'
import Drawer from 'material-ui/Drawer';
import IconButton from 'material-ui/IconButton';
import RaisedButton from 'material-ui/RaisedButton';
import Modal from '../../../helpers/Modal';
import { Image, Input, Divider } from 'semantic-ui-react';
import { graphql, compose } from 'react-apollo';
import moment from 'moment';
import { find, pick } from 'lodash';
import {
  allUsersQuery,
  deleteShiftMutation,
  updateShiftMutation,
  allShiftMarkets,
  updateShiftMarket,
  createShiftMarket
} from './EditShiftDrawer.graphql';
import TeamMemberCard from './TeamMemberCard';
import { leftCloseButton } from '../../../styles';
import CircleButton from '../../../helpers/CircleButton';
const uuidv4 = require('uuid/v4');
import './shift-edit.css';
var rp = require('request-promise');


const unassignedTeamMember = {
  user: {
    id: 0,
    firstName: 'Automated Shift',
    lastName: '',
    avatarUrl: 'https://s3.us-east-2.amazonaws.com/aday-website/icons/time-lapse-red.png',
  },
  content: 'Assign shift to override automation',
  status: 'unassigned'
};

const unassignedJobShadower = { ...unassignedTeamMember };

const initialState = {
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
    this.state = {
      ...initialState,
      teamMembers: this.getInitialData(this.props),
      deleteModalPopped: false
    };
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
    this.setState({ deleteModalPopped: true });
  };

  handleSaveShift = () => {
     const shiftPatch = {}
      shiftPatch['workersAssigned'] = []
      shiftPatch['workersRequestedNum'] = this.state.teamMembers.length
      const teamMembersAdded = []
      this.state.teamMembers.map((value) => {
        if(value.user.id != 0 && shiftPatch['workersAssigned'].indexOf(value)==-1){
              shiftPatch['workersAssigned'].push(value.user.id)
              if (this.props.shift.workersAssigned.indexOf(value) ==-1 ) {
                  teamMembersAdded.push(value.user.id)
              }

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
              if (this.props.shiftMarkets.allMarkets){
                this.props.shiftMarkets.allMarkets.edges.map( (v,i) => {
                  if (v.node.workerId == value){
                    marketId = v.node.id;
                  }
                })
              }
                 
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



       var shift = this.props.shift
        /*
        if ((moment(shift.startTime).diff(moment().format(), 'days')) <= 14 ){
          var uriRemoved = 'https://20170808t142850-dot-forward-chess-157313.appspot.com/api/cancellationCall'

              var options = {
                  uri: uriRemoved,
                  method: 'POST',
                  json: {data: {
                      "sec": "QDVPZJk54364gwnviz921",
                      "shiftDay": moment(shift.startTime).format("Do,  MMMM  YYYY"),
                      "shiftStartHour": moment(shift.startTime).format("h:mm a"),
                      "shiftEndHour": moment(shift.endTime).format("h:mm a"),
                      "workersAssigned": removedUsers,
                      "workplaceLocation": shift.workplaceByWorkplaceId.workplaceName,
                      "workplaceAddress": shift.workplaceByWorkplaceId.address,
                      "position": shift.positionByPositionId.positionName,
                      "brand": shift.positionByPositionId.brandByBrandId.brandName
                  }}
              };
              rp(options)
                .then(function(response) {              
                }).catch((error) => {
                   console.log('there was an error sending the query for delete cancellation call', error);
              });
        }
        */
        /*
        if ((moment(shift.startTime).diff(moment().format(), 'days')) <= 14 ){
             var uriAdded = 'https://20170808t142850-dot-forward-chess-157313.appspot.com/api/userAdded'
              var options = {
                  uri: uriAdded,
                  method: 'POST',
                  json: {data: {
                      "sec": "QDVPZJk54364gwnviz921",
                      "shiftDay": moment(shift.startTime).format("Do,  MMMM  YYYY"),
                      "shiftStartHour": moment(shift.startTime).format("h:mm a"),
                      "shiftEndHour": moment(shift.endTime).format("h:mm a"),
                      "workersAssigned": teamMembersAdded,
                      "workplaceLocation": shift.workplaceByWorkplaceId.workplaceName,
                      "workplaceAddress": shift.workplaceByWorkplaceId.address,
                      "position": shift.positionByPositionId.positionName,
                      "brand": shift.positionByPositionId.brandByBrandId.brandName
                  }}
              };
              rp(options)
                .then(function(response) {              
                }).catch((error) => {
                   console.log('there was an error sending the query for delete cancellation call', error);
              });
        }*/
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
    let shift = this.props.shift
    let that = this;
    that.props.deleteShiftById(uuidv4(), id)
      .then(({ data }) => {
        console.log('Delete Data', data);
      }).catch((error) => {
      console.log('there was an error sending the query', error);
    });
    that.setState({ deleteModalPopped: false });
    this.handleCloseDrawer();
    /*
    if ((moment(shift.startTime).diff(moment().format(), 'days')) <=7 ){
        var uri = 'https://20170808t142850-dot-forward-chess-157313.appspot.com/api/cancellationCall'

        var options = {
            uri: uri,
            method: 'POST',
            json: {data: {
                "sec": "QDVPZJk54364gwnviz921",
                "shiftDay": moment(shift.startTime).format("Do,  MMMM  YYYY"),
                "shiftStartHour": moment(shift.startTime).format("h:mm a"),
                "shiftEndHour": moment(shift.endTime).format("h:mm a"),
                "workersAssigned": shift.workersAssigned,
                "workplaceLocation": shift.workplaceByWorkplaceId.workplaceName,
                "workplaceAddress": shift.workplaceByWorkplaceId.address,
                "position": shift.positionByPositionId.positionName,
                "brand": shift.positionByPositionId.brandByBrandId.brandName
            }}
        };
        rp(options)
          .then(function(response) {              
          }).catch((error) => {
             console.log('there was an error sending the query for delete cancellation call', error);
        });
    } */
 
  };

  getUserById = (id, isAssigned) => {
    const users = this.props.users;
    let foundWorker = find(users.allUsers.edges, (user) => user.node.id === id);
    if (!foundWorker) foundWorker = { node: unassignedTeamMember.user };
    return {
      user: pick(foundWorker.node, ['id', 'avatarUrl', 'firstName', 'lastName']),
      status: isAssigned ? 'accepted' : 'pending',
      content: foundWorker.node.content
    };
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
      teamMembers[index].content = '     ';
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
      jobShadowers[index].content = '     ';
      jobShadowers[index].status = 'accepted';
    } else {
      jobShadowers[index] = { ...unassignedTeamMember };
    }
    this.setState({ jobShadowers });
  };

  render() {
    console.log(this.props.teamMembers)
    if (this.props.teamMembers.loading) {
                return (<div>Loading</div>) 
    }

    const {
      shift = {},
      width = 600,
      openSecondary = true,
      docked = false,
      open
    } = this.props;
     


    const { teamMembers, jobShadowers } = this.state;

    const users = this.props.teamMembers.allJobs.edges.map(({ node }) => pick(node.userByUserId, ['id', 'avatarUrl', 'firstName', 'lastName']));

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
            <div className="drawer-right">
              <RaisedButton label="History" onClick={this.handleShiftHistoryDrawer} />
            </div>
          </div>
          <div className="drawer-content scroll-div">
            <div className="member-list">
            <div style={{marginLeft:10}}>
                <Image
                     src="https://s3.us-east-2.amazonaws.com/aday-website/icons/team-members.png"
                     size="mini"
                     floated='left'
                />
                 <h5 style={{color:'#0021A1'}}>
                        TEAM MEMBERS ({teamMembers.length})
                 </h5>
            </div>
            <br />

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
                <div style={{marginLeft: 10}}>
                    <Image
                       src="https://s3.us-east-2.amazonaws.com/aday-website/icons/copying-blue.png"
                       floated='left'
                       style={{width:40}}
                    />
                    <h5 style={{color:'#0021A1', paddingTop: 5}}>SHIFT DETAILS</h5>
                </div>
              <div className="shiftDetails">
                <p><b>Workplace</b>: <span>{shift.workplaceByWorkplaceId.workplaceName}</span></p>
                <p><b>Position</b>: <span>{shift.positionByPositionId.positionName}</span></p>
                <p><b>Shift Date</b>: <span>{moment(shift.startTime).format('dddd, MMMM Do YYYY')}</span></p>
                <p><b>Start Time</b>: <span>{moment(shift.startTime).format('hh:mm A')}</span></p>
                <p><b>End Time</b>: <span>{moment(shift.endTime).format('hh:mm A')}</span></p>
                <p><b>Unpaid break</b>: <span>{!shift.unpaidBreakTime && '00:00' || shift.unpaidBreakTime.split(":").slice(0,2).join(":")}</span></p>
                <p><b>bonus payment per hour</b>: <span>$0.00</span></p>
                <p><b>job shadowing shift</b>: <span>No</span></p>
                <br />
                <p><b>SHIFT INSTRUCTIONS:</b></p>
                <p className="dimmedText"> {!shift.instructions.length < 1? <span>{shift.instructions}</span>:<span>n/a</span>}
                </p>
              </div>
            </div>
          </div>
          <div className="drawer-footer">
            {!pastDate ?
              <div className="buttons text-center">
                {actions}
              </div> :
                 <div style={{ display: 'flex',  justifyContent: 'center'}}>
                 <Image
                      src="https://s3.us-east-2.amazonaws.com/aday-website/icons/save-update-circle-button-disabled.png"
                 />
                 </div>
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
    options: (ownProps) => ({ variables: { shiftId: ownProps.shift && ownProps.shift.id } })
  }),
  graphql(allUsersQuery, {
    name: 'teamMembers',
    options: (ownProps) => ({ variables: { positionId: ownProps.shift && ownProps.shift.positionByPositionId.id } }) 
  }))
(DrawerHelper);

export default DrawerHelperComponent;
