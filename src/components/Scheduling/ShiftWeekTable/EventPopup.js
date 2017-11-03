import React, { Component } from 'react';
import moment from 'moment';
import { cloneDeep, findLastIndex, differenceBy } from 'lodash';
import { gql, graphql, compose } from 'react-apollo';
import {
  updateShiftMutation,
  deleteShiftMutation,
  updateRecurringShiftById
} from './ShiftEdit/EditShiftDrawer.graphql';
import { createShiftMutation } from './ShiftPublish.graphql';
import Modal from '../../helpers/Modal';
import CreateShiftAdvanceDrawerContainer from '../AddShift/CreateShift/CreateShiftAdvanceDrawerContainer';
import CreateShiftDrawerContainer from '../AddShift/CreateShift/CreateShiftDrawerContainer';
import EditShiftDrawerContainer from './ShiftEdit/EditShiftDrawerContainer';
import EditHelperPopUp from '../AddShift/CreateShift/EditHelper';
import CreateShiftHelper from '../AddShift/CreateShift/CreateShiftHelper';
import ShiftHistoryDrawerContainer from './ShiftEdit/ShiftHistoryDrawerContainer';
import DeleteRecuringPopUp from './DeleteRecuringPopUp';
import '../style.css';
import { BASE_API } from '../../../constants';
import './shiftWeekTable.css';
var rp = require('request-promise');
const uuidv4 = require('uuid/v4');

const styles = {
  drawer: {
    width: 730
  }
};

class EventPopupComponent extends Component {

  constructor(props) {
    super(props);
    const workplaceId = props.data.workplaceByWorkplaceId && props.data.workplaceByWorkplaceId.id;
    const brandId = props.data.positionByPositionId && props.data.positionByPositionId.brandByBrandId && props.data.positionByPositionId.brandByBrandId.id;
    const positionId = props.data.positionByPositionId && props.data.positionByPositionId.id;
    this.state = {
      deleteModalPopped: false,
      editModalPopped: false,
      newShiftModalPopped: false,
      shiftHistoryDrawer: false,
      isCreateShiftAdvanceOpen: false,
      drawerShift: {
        ...props.data,
        numberOfTeamMembers: props.data.workersRequestedNum,
        startTime: moment(props.data.startTime),
        endTime: moment(props.data.endTime),
        advance: { allowShadowing: true },
        workplaceId,
        brandId,
        positionId
      }
    }
  }

  handleClose = () => {
    this.setState({
      deleteModalPopped: false
    })
  };

  modalClose = () => {
    this.setState({
      deleteModalPopped: false
    });
  };

  deleteShift = (id) => {
    let data = this.props.data
    let that = this;
    that.props.deleteShiftById(uuidv4(), id)
      .then(({ data }) => {
        console.log('Delete Data', data);
      }).catch((error) => {
      console.log('there was an error sending the query', error);
    });
    that.setState({ deleteModalPopped: false });
  };

  // deleteRecurringShiftById
  deleteSingle = () => {
    this.deleteShift(this.props.data.id)

    const _this = this
    this.props.data.workersAssigned.map(function(user, i){
      var uri = `${BASE_API}/api/kronosApi`
      let data = _this.props.data

        var options = {
            uri: uri,
            method: 'POST',
            json: {
                  "sec": "QDVPZJk54364gwnviz921",
                  "actionType": "deleteShift",
                  "testing": true,
                  "user_id": user,
                  "date": moment(data.startTime).format('YYYY-MM-DD'),
                  "startTime": moment(data.startTime).format('HH:mm'),
                  "endTime": moment(data.endTime).format('HH:mm'),
                  "singleEdit": false
              }
         };
         rp(options)
          .then(function(response) {
              //that.setState({redirect:true})
          }).catch((error) => {
            console.log('there was an error sending the query', error);
          });
    })
  }

 deleteRecurringShift = () => {
    let {id} = this.props.data, {startTime, endTime} = this.props.data;
    let {recurringShiftId} = this.props.data;
    let that = this;
    const newEdges = []
    const oldEdges = []
    that.setState({ deleteModalPopped: false });

    this.props.updateRecurringShiftById({
        variables: {
          data: {
            id: recurringShiftId,
            recurringShiftPatch: {expiration: startTime}
          }
        },
       updateQueries: {
        allShiftsByWeeksPublished: (previousQueryResult, { mutationResult }) => {
          previousQueryResult.allShifts.edges.map((value) => {
            if (value.node.recurringShiftId != recurringShiftId) {
              newEdges.push(value);
            } else {
              oldEdges.push(value.node.id)
            }
          })

          return {
            allShifts: previousQueryResult.allShifts
          };
        },
      },
    }).then(({ data }) => {
        console.log('Updated', data);
        oldEdges.map(function(id, index){
          that.deleteShift(id);
        })
      }).catch((error) => {
      console.log('there was an error sending the query deleteRecurringShift', error);
    });

    var uri = `${BASE_API}/api/kronosApi`

      var options = {
          uri: uri,
          method: 'POST',
          json: {
                "sec": "QDVPZJk54364gwnviz921",
                "actionType": "deleteRecurring",
                "recurring_shift_id": recurringShiftId,
                "date": moment(startTime).format('YYYY-MM-DD'),
                "start_time": moment(startTime).format('HH:mm'),
                "end_time": moment(endTime).format('HH:mm'),
                "edit": false
            }
       };
       console.log(options)
       rp(options)
        .then(function(response) {
            //that.setState({redirect:true})
        }).catch((error) => {
          console.log('there was an error sending the query', error);
        });


    that.setState({ deleteModalPopped: false });
  };

  deleteRecurringShiftSeries = () => {

    let {recurringShiftId} = this.props.data;
    let that = this;
    const newEdges = []
    const oldEdges = []

    this.props.updateRecurringShiftById({
      variables: {
        data: {
          id: recurringShiftId,
          recurringShiftPatch: {expiration: moment().format('YYYY-MM-DDThh:mm:ss')}
        }
      },
      updateQueries: {
        allShiftsByWeeksPublished: (previousQueryResult, { mutationResult }) => {
          previousQueryResult.allShifts.edges.map((value) => {
            if (value.node.recurringShiftId != recurringShiftId) newEdges.push(value);
            else oldEdges.push(value.node.id)
          });
          return {
            allShifts: previousQueryResult.allShifts
          };
        },
      },
    }).then(({ data }) => {
      console.log('Updated', data);
      oldEdges.map(function(id, index){
        that.deleteShift(id);
      })
    }).catch((error) => {
      console.log('there was an error sending the query deleteRecurringShift', error);
    });

    var uri = `${BASE_API}/api/kronosApi`

    var options = {
      uri: uri,
      method: 'POST',
      json: {
        "sec": "QDVPZJk54364gwnviz921",
        "actionType": "deleteRecurring",
        "recurring_shift_id": recurringShiftId,
        "date": moment().format('YYYY-MM-DDThh:mm:ss'),
        "edit": false
      }
    };
    rp(options)
      .then(function(response) {
        //that.setState({redirect:true})
      }).catch((error) => {
      console.log('there was an error sending the query', error);
    });
    this.setState({ deleteModalPopped: false });
  };

  closeEditShiftModal = () => {
    this.setState({ editShiftModalOpen: false });
  };

  onPopupOpen = (modal) => {
    if (modal == 'deleteModalPopped') {
      this.setState({ deleteModalPopped: true });
    }
    else if (modal == 'EditShiftDrawerContainer') {
      this.setState({ editShiftDrawerOpen: true });
    }
    else if (modal == 'editShiftModal') {
      this.setState({ editShiftModalOpen: true });
    }
    else if (modal == 'newShiftModalPopped') {
      this.setState({ newShiftModalPopped: true });
    }
  };
  handleHistoryDrawer = () => {
    this.setState({ shiftHistoryDrawer: !this.state.shiftHistoryDrawer });
  };

  handleNewShiftDrawerClose = () => {
    this.setState({ newShiftModalPopped: !this.state.newShiftModalPopped });
  };

  openEditPopup = (shift) => {
    this.setState({ editShiftModalOpen: false, isCreateShiftAdvanceOpen: false, editShift: shift});
    let {recurringShiftId} = this.props.data;
    if ( recurringShiftId ) {
      this.setState({ isOpen: true });
    } else {
      this.handleShiftUpdateSubmit('SINGLE');
    }

  }

  handleShiftUpdateSubmit = (type) => {
    this.setState({ isOpen: false });
    const oldShift = this.props.data
    const shift = this.state.editShift

    if (shift && type != 'SINGLE') {
      this.recurringEditUpdate(shift, type)
    } else if (this.state.editShift) {
      shift.startTime = moment(shift.startTime);
      shift.endTime = moment(shift.endTime);

      const payload = {
        id: shift.id,
        workplaceId: shift.workplaceId,
        positionId: shift.positionId,
        workersRequestedNum: shift.numberOfTeamMembers,
        creatorId: localStorage.getItem('userId'),
        startTime: shift.startTime,
        endTime: shift.endTime,
        instructions: shift.instructions,
        unpaidBreakTime: shift.unpaidBreak
      };
      if (shift.teamMembers && shift.teamMembers.length) {
        payload.workersAssigned  = []
        shift.teamMembers.map(function (member){
            if (member['id'] != 0 && member['id'] != null) {
              payload.workersAssigned.push(member['id'])
            }
        });
      }

      this.props.updateShiftMutation({
          variables: {
            data: {
              id: shift.id,
              shiftPatch: payload
            }
          },
      }).then(({ data }) => {
        //if published then update kronos after edit
        console.log(this.props.isPublished)
        if (this.props.isPublished == true) {
            // # TO DO:: MAKE SURE MARKETS EXIST, WITH KRONOS CALLS ON THE SERVER
            //if users added or deletes
              console.log("WERE PUBLISHED")

              var uri = `${BASE_API}/api/kronosApi`
              var removedUsers = []
              var sameUsers = []
              var newUsers = []
              console.log(oldShift.workersAssigned)
              console.log(oldShift)
              oldShift.workersAssigned.map((value) => {
                var isEdit = false
                console.log(payload.workersAssigned)
                console.log(value)
                if (payload.workersAssigned.includes(value)){
                  sameUsers.push(value)
                  isEdit = true
                }else{
                  removedUsers.push(value)
                }
                  var options = {
                      uri: uri,
                      method: 'POST',
                      json: {
                            "sec": "QDVPZJk54364gwnviz921",
                            "actionType": "deleteShift",
                            "user_id": value,
                            "date": moment(oldShift.startTime).format("YYYY-MM-DD"),
                            "start_time": moment(oldShift.startTime).format("HH:MM"),
                            "end_time": moment(oldShift.endTime).format("HH:MM"),
                            "singleEdit": isEdit,
                            "shift_id": oldShift.id
                      }
                  };

                  console.log(options)
                  rp(options)
                  .then(function(response) {
                  }).catch((error) => {
                    console.log('there was an error sending the query', error);
                  });

            })

              //CREATE NEW SHIFT
              payload['workersAssigned'].map((value) => {
                if (sameUsers.includes(value)){
                  // User was already on the shift
                } else {
                  var options = {
                      uri: uri,
                      method: 'POST',
                      json: {
                            "sec": "QDVPZJk54364gwnviz921",
                            "actionType": "assignShift",
                            "testing": true,
                            "user_id": value,
                            "date": moment(payload['startTime']).format("YYYY/MM/DD"),
                            "start_time": moment(payload['startTime']).format("HH:MM"),
                            "end_time": moment(payload['endTime']).format("HH:MM"),
                      }
                  };
                   rp(options)
                    .then(function(response) {
                        //that.setState({redirect:true})
                    }).catch((error) => {
                      console.log('there was an error sending the query', error);
                    });

                }
                })
        }
        console.log('got data', data);
        let updatedTags = shift.tags;
        if (shift.shiftTagsByShiftId && shift.shiftTagsByShiftId.nodes.length) {
          let OldTags = shift.shiftTagsByShiftId.nodes.map(({ tagId }) => ({ id: tagId }));
          updatedTags = differenceBy(shift.tags, OldTags, 'id');
        }
        CreateShiftHelper.createShiftTags(updatedTags, data.updateShiftById.shift.id)
          .then(() => console.log('Shift tags have been updated.'));
      }).catch(err => {
        console.log('There was error in saving shift', err);
      });
    }
  };


  recurringEditUpdate(shift, type){
    console.log("HIT RECURRING EDIT UPDATE")

    const days = []
    Object.keys(shift.shiftDaysSelected).map(function(day){
        if (shift.shiftDaysSelected[day] == true && day !== 'undefined'){
          days.push(day)
        }
    })
    
    let {recurringShiftId} = this.props.data;
    const daysWeek = []
    days.map(function(day,i){

        if (day !== undefined) {
          daysWeek.push(moment(day).format("dddd").toUpperCase())
        }
      })

      console.log("WHATS THE ENDDATE BEFORE")
      console.log(shift.endDate)

      let endDate = shift.endDate
      if (endDate != null){
        endDate = moment(shift.endDate).format()
      }

      console.log("WHATS THE ENDDATE")
      console.log(shift.endDate)
      console.log("WHATS THE STARTDATE")
      console.log(shift.startDate)


      const payload = {
        positionId: shift.positionId,
        workerCount: shift.numberOfTeamMembers,
        creator: localStorage.getItem('userId'),
        startTime: moment(shift.startTime).format('HH:mm'),
        endTime: moment(shift.endTime).format('HH:mm'),
        instructions: shift.instructions,
        unpaidBreakTime: shift.unpaidBreak,
        startDate: moment(shift.startDate).subtract(1, 'week').format(),
        expiration: endDate,
        days: daysWeek,
      };

      if (shift.teamMembers && shift.teamMembers.length) {
        payload.assignees = []
        shift.teamMembers.map(function (member){
            if (member['id'] != 0 && member['id'] != null) {
               payload.assignees.push(member['id'])
            }
        });
      }

      var _this = this
      this.props.updateRecurringShiftById({
        variables: {
          data: {
            id: recurringShiftId,
            recurringShiftPatch: payload
          }
        },
      }).then(({ data }) => {

        let apiDate = moment().format()
        if(type == 'ALL'){
          apiDate = moment(shift.startTime).format()
        } 

        var uri = `${BASE_API}/api/kronosApi`


        var options = {
            uri: uri,
            method: 'POST',
            json: {
                  "sec": "QDVPZJk54364gwnviz921",
                  "actionType": "deleteRecurring",
                  "recurring_shift_id": shift.recurringShiftId,
                  "date": apiDate,
                  "edit": true
              }
        };
         rp(options)
          .then(function(response) {
              console.log(response)
              _this.props.forceRefetch()
              //that.setState({redirect:true})
          }).catch((error) => {
            console.log('there was an error sending the query', error);
          });

        console.log('got data', data);
      }).catch(err => {
        console.log('There was error in saving shift', err);
      });
  };

  handleAdvanceToggle = (drawerShift) => {
    this.setState((state) => ({
      drawerShift,
      isCreateShiftOpen: !state.isCreateShiftOpen,
      isCreateShiftAdvanceOpen: !state.isCreateShiftAdvanceOpen
    }));
  };

  onPopupClose = (modal) => {
    console.log('Close');
    console.log([modal]);
    this.setState({
      deleteModalPopped: false
    })
  };

  onLocationClick = () => {
    console.log('onLocationClick');
  };


  render() {
    let { data, users } = this.props;
    const mappedUsers = users && users.allUsers && users.allUsers.edges.map(({ node }) => node);
    let pastDate = moment().diff(data.startTime) > 0;
    let startTime = moment(data.startTime).format('h:mm A');
    let startTimeDiff = moment(data.startTime);
    let endTimeDiff = moment(data.endTime);
    let endTime = moment(data.endTime).format('h:mm A');

     if (startTime == 'Invalid date') {
      let start = data.startTime.split(':');
      let end = data.endTime.split(':');
      startTime = moment().hour(parseInt(start[0])).minute(parseInt(start[1])).format('hh:mm A');
      endTime = moment().hour(parseInt(end[0])).minute(parseInt(end[1])).format('hh:mm A');
      startTimeDiff =moment().hour(parseInt(start[0])).minute(parseInt(start[1]));
      endTimeDiff = moment().hour(parseInt(end[0])).minute(parseInt(end[1]));
    }

    let duration = moment.duration(endTimeDiff.diff(startTimeDiff));

    if (data.unpaidBreakTime){
      let uhours = data.unpaidBreakTime.split(':')[0]
      let umins = data.unpaidBreakTime.split(':')[1]
      let unpaidHours = moment.duration(parseInt(uhours), 'h')
      let unpaidMinutes = moment.duration(parseInt(umins), 'm')
      duration.subtract(unpaidMinutes).subtract(unpaidHours)
    }
    
    let hoursDiff = parseInt(duration.asHours());
    let minDiff = parseInt(duration.asMinutes())-hoursDiff*60;


    let {recurringShiftId} = this.props.data;

    let h = moment.utc(moment(endTime, 'h:mm A').diff(moment(startTime, 'h:mm A'))).format('HH');
    let m = moment.utc(moment(endTime, 'h:mm A').diff(moment(startTime, 'h:mm A'))).format('mm');
    let deleteShiftAction = [{ type: 'white', title: 'Cancel', handleClick: this.handleClose, image: false },
      { type: 'red', title: 'Delete Shift', handleClick: this.deleteSingle, image: '/images/modal/close.png' }];
    let deleteShiftRenderAction = [{ title: 'This Shift', message: 'ALL OTHER SHIFT IN THIS SERIES WELL REMAIN', handleClick: this.deleteSingle, image: '/images/Assets/Icons/Buttons/only-this-shift.png' },
      { title: 'This Shift Forward', message: 'This and all the following shifts will be deleted', handleClick: this.deleteRecurringShift, image: '/images/Assets/Icons/Buttons/following-shift.png' },
      { title: 'This Shift Series', message: 'All shifts created alongside this shift will be deleted', handleClick: this.deleteRecurringShiftSeries, image: '/images/Assets/Icons/Buttons/alongside-shift.png' }];
    let editHelperPopUpRenderAction = [{ title: 'This Shift', message: 'ALL OTHER SHIFT IN THIS SERIES WELL REMAIN THE SAME', handleClick: () => this.handleShiftUpdateSubmit('SINGLE'), image: '/images/Assets/Icons/Buttons/only-this-shift.png' },
      { title: 'This Shift Forward', message: 'This and all the following shifts will be overwritten and changed', handleClick: ()=> this.handleShiftUpdateSubmit('FOLLOWING'), image: '/images/Assets/Icons/Buttons/following-shift.png' },
      { title: 'This Shift Series', message: 'All shifts created alongside this shift will be overwritten and changed', handleClick: ()=> this.handleShiftUpdateSubmit('ALL'), image: '/images/Assets/Icons/Buttons/alongside-shift.png' }];

    if (data.workersAssigned == null) {
      data.workersAssigned = [];
    }
    if (data.workersInvited == null) {
      data.workersInvited = [];
    }



    var workersCount = data.workersRequestedNum || data.workerCount;
    this.openShift = workersCount - (data.workersAssigned.length + data.workersInvited.length );

    return (
      <div className="day-item hov">

        <div className="start-time">
          <span className="fa fa-clock-o" />
          <p className="date-time"> {startTime.replace('M', '')} <br /> {endTime.replace('M', '')}</p>
          {/*<p className="duration">{h} HRS & &thinsp; <br /> {m} MINS</p>*/}
          <p > {hoursDiff} HR <br/> {minDiff} MIN</p>
        </div>

        {this.props.view == 'job'
          ? <div className="location">
                <span className="fa fa-map-marker" aria-hidden="true">
                    <a onClick={() => this.onLocationClick()} />
                </span>
            <span>
                    {data.workplaceByWorkplaceId.workplaceName}
                </span>

            {data.traineesRequestedNum > 0 && <span className="shape-job">
              <i><img src="/assets/Icons/job-shadower-filled.png" alt="jobtype"/></i>
              <sup>{data.traineesRequestedNum}</sup>
            </span>
            }
          </div>
          : <div className="location">
            <span className="jobTypeIcon"><img src="/assets/Icons/cashier.png" alt="jobtype" /></span>
            <span className="jobType">{data.positionByPositionId.positionName}</span>
            {data.traineesRequestedNum > 0 && <span className="shape-job">
              <i><img src="/assets/Icons/job-shadower-filled.png" alt="jobtype"/></i>
              <sup>{data.traineesRequestedNum}</sup>
            </span>
            }
          </div>
        }

        {this.props.view == 'job'
          ? <div className="day-item-title">
            {this.openShift > 0 && <span className="box-title openshift">{this.openShift}</span>}
            {data.workersInvited.length > 0 &&
            <span className="box-title pendingshift">{data.workersInvited.length}</span>
            }{data.workersAssigned.length > 0 &&
          <span className="box-title filledshift">{data.workersAssigned.length}</span>}
            {data.recurringShiftId &&
              <span className="bitmap"><img src="/assets/Icons/repeating-shifts.png" alt="jobtype" /></span>
            }
          </div>
          : <div>
            {/*
             <div className="location">
             <span className="fa fa-map-marker mr5" aria-hidden="true">
             <a onClick={() => this.onLocationClick()} />
             </span>
             <span className="jobType">{data.workplaceByWorkplaceId.workplaceName}</span>
             </div> */}
            <div className="day-item-title">
              {data.userFirstName == 'Open' && data.userLastName == 'Shifts' && this.openShift > 0
              && <span className="box-title openshift">{this.openShift}</span>}
              {data.recurringShiftId &&
              <span className="bitmap"><img src="/assets/Icons/repeating-shifts.png" alt="jobtype" /></span>
              }
            </div>
          </div>
        }


        {recurringShiftId ?
          <DeleteRecuringPopUp
          title="Delete Repeating Shift"
          isOpen={this.state.deleteModalPopped}
          action={deleteShiftRenderAction}
          closeAction={this.modalClose} />:
          <Modal
            title="delete"
            isOpen={this.state.deleteModalPopped}
            message="Delete only this shift?"
            action={deleteShiftAction}
            closeAction={this.modalClose} />
        }
         <EditHelperPopUp
          open={this.state.isOpen} 
          title="EDIT REPEATING SHIFT"
          isOpen={this.state.isOpen}
          action={editHelperPopUpRenderAction}
          closeAction={this.modalClose} />
        <EditShiftDrawerContainer
          shift={data}
          users={users}
          open={this.state.newShiftModalPopped}
          handlerClose={this.handleNewShiftDrawerClose}
          handleHistory={this.handleHistoryDrawer} />
        <ShiftHistoryDrawerContainer
          shift={data}
          users={users}
          open={this.state.shiftHistoryDrawer}
          handleBack={this.handleNewShiftDrawerClose}
          handleHistory={this.handleHistoryDrawer} />
        <CreateShiftDrawerContainer
          width={styles.drawer.width}
          open={this.state.editShiftModalOpen}
          shift={this.state.drawerShift}
          users={mappedUsers}
          managers={this.props.managers}
          handleSubmit={this.openEditPopup}
          handleAdvance={this.handleAdvanceToggle}
          closeDrawer={this.closeEditShiftModal}
          recurringEdit={this.props.recurringEdit}
          weekStart={moment(data.startTime).startOf('week')}
          calendarOffset={this.props.calendarOffset} />
        <CreateShiftAdvanceDrawerContainer
          width={styles.drawer.width}
          shift={this.state.drawerShift}
          open={this.state.isCreateShiftAdvanceOpen}
          handleBack={this.handleAdvanceToggle} />
        <div className="overlay">
          <div className="hoimg">
            {!pastDate &&
            <a>
              <i onClick={() => this.onPopupOpen('deleteModalPopped')}>
                <img src="/assets/Icons/close-shift.png" alt="close" />
              </i>
            </a>}
            <a>
              <i onClick={() => this.onPopupOpen('editShiftModal')}>
                <img src="/assets/Icons/edit-shift.png" alt="edit" />
              </i>
            </a>
            <a>
              <i onClick={() => this.onPopupOpen('newShiftModalPopped')}>
                <img src="/assets/Icons/create-shift.png" alt="create" />
              </i>
            </a>
          </div>
        </div>
      </div>
    )
  }
}

const EventPopup = compose(graphql(deleteShiftMutation, {
  props: ({ ownProps, mutate }) => ({
    deleteShiftById: (clientMutationId, id) => mutate({
      variables: { clientMutationId: clientMutationId, id: id },
      updateQueries: {
        allShiftsByWeeksPublished: (previousQueryResult, { mutationResult }) => {
          let newEdges = [];
          previousQueryResult.allShifts.edges.map((value) => {
            if (value.node.id != mutationResult.data.deleteShiftById.shift.id) {
              newEdges.push(value)
            }
          });
          previousQueryResult.allShifts.edges = newEdges;
          return {
            allShifts: previousQueryResult.allShifts
          };
        },
      },
    }),
  }),
}),
graphql(updateRecurringShiftById, {
    name: 'updateRecurringShiftById'
}),
graphql(createShiftMutation, {
  name: 'createShift'
}),
graphql(updateShiftMutation, {
    name: 'updateShiftMutation'
}))(EventPopupComponent);

export default EventPopup;
