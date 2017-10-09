import React, { Component } from 'react';
import moment from 'moment';
import cloneDeep from 'lodash/cloneDeep';
import { gql, graphql, compose } from 'react-apollo';

import { updateRecurringShift, createRecurringShiftAssignee, deleteRecurringShiftAssigneeById } from './ShiftEdit/EditRecurringShift.graphql.js'
import Modal from '../../helpers/Modal';
import CreateShiftAdvanceDrawer from '../../Scheduling/AddShift/CreateShift/CreateShiftAdvanceDrawer';
import EditShiftDetailsDrawer from './ShiftEdit/recurringShiftDrawerContainer';
import EditShiftDrawerContainer from '../../Scheduling/ShiftWeekTable/ShiftEdit/EditShiftDrawerContainer';

import '../../Scheduling/style.css';
import '../../Scheduling/ShiftWeekTable/shiftWeekTable.css';
var rp = require('request-promise');
const uuidv4 = require('uuid/v4');

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
      isCreateShiftAdvanceOpen: false,
      drawerShift: {
        ...props.data,
        numberOfTeamMembers: props.data.workersCount,
        startTime: props.data.startTime,
        endTime: props.data.endTime,
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

  deleteShift = () => {
    let id = this.props.data.id;
    let that = this;

    const payload = {
        expired: true,
      };

   this.props.updateRecurringShift({
        variables: {
          data: {
            id: id,
            recurringShiftPatch: payload
          }
        },
        updateQueries: {
          recurringById: (previousQueryResult, { mutationResult }) => {
            let newEdges = []
            console.log(mutationResult)
            const recurringShiftId = mutationResult.data.updateRecurringShiftById.recurringShift.id
            previousQueryResult.recurringById.recurringShiftsByRecurringId.edges.map(function(value){
                if (value.node.id != recurringShiftId) {
                    newEdges.push(value)
                  }
            }) 
            previousQueryResult.recurringById.recurringShiftsByRecurringId.edges = newEdges    
            return {
              recurringById: previousQueryResult.recurringById
            };
          },
        },
      }).then(({ data }) => {

        var uri = 'http://localhost:8080/api/kronosApi'

        var options = {
            uri: uri,
            method: 'POST',
            json: {         
                  "sec": "QDVPZJk54364gwnviz921",
                  "actionType": "deleteRecurring",
                  "testing": true,
                  "recurring_shift_id": id,
                  "date": moment().format(),
                  "edit": false
              }
        };

        rp(options)
          .then(function(response) {
              //that.setState({redirect:true})
          }).catch((error) => {
              console.log('there was an error sending the query', error);
          });   
      }).catch((error) => {
      console.log('there was an error sending the query', error);
    });
    that.setState({ deleteModalPopped: false });
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

  handleNewShiftDrawerClose = () => {
    this.setState({ newShiftModalPopped: !this.state.newShiftModalPopped });
  };

  handleShiftUpdateSubmit = (shiftValue, recurringId) => {
      const shift = cloneDeep(shiftValue);

      console.log(shift)

      let days = []
        Object.keys(shift.shiftDaysSelected).map(function(day, i){
          if (shift.shiftDaysSelected[day] == true) {
              days.push(moment(day).format('dddd').toUpperCase())
          }
      })
      
      var currentUsers = []
      var newUsers = []
      var addUsers = []
      var removeUsers = []

      shift.recurringShiftAssigneesByRecurringShiftId.edges.map(function(assignee, i) {
        currentUsers.push(assignee.node.userId)
      })

      shift.teamMembers.map(function(assignee, i) {
        newUsers.push(assignee.id)
        if (currentUsers.indexOf(assignee.id) < 0){
          addUsers.push(assignee.id)
        }
      })

      currentUsers.map(function(user, i){
        if (newUsers.indexOf(user) < 0){
          removeUsers.push(user)
        }
      })

      this.setState({ editShiftModalOpen: false, isCreateShiftAdvanceOpen: false });

      if (addUsers.length > 0){
          this.addUsers(addUsers, shift.id, this.props, (res)=>{
              if (removeUsers.length > 0){
                  this.removeUsers(removeUsers, shift.id, this.props, (res)=>{
                      this.saveRecurringShift(shift, days)
                  })
              } else {
                 this.saveRecurringShift(shift, days)
              }
          })
      } else if (removeUsers.length > 0){
        this.removeUsers(removeUsers, shift.id, this.props, (res)=>{
          this.saveRecurringShift(shift, days)
        })
      } else {
          this.saveRecurringShift(shift, days)
      }
  }

  addUsers(addUsers, id, props, callback){
      console.log("INSIDE ADD USERS")
      addUsers.map(function(add, i){
        let addPayload = {
          recurringShiftId: id,
          userId: add
        };
        props.createRecurringShiftAssignee({
        variables: {
          data: {
            recurringShiftAssignee: addPayload
          }
        },
        }).then(({ data }) => {
          if (i == addUsers.length - 1){
            return callback(i)
          }
        })
      })
  }


  removeUsers(removeUsers, id, props, callback) {
      console.log("INSIDE REMOVE USERS")
      removeUsers.map(function(remove, i){
        props.deleteRecurringShiftAssigneeById({
        variables: {
            recurringShiftId: id,
            userId: remove
          }
        }).then(({ data }) => {
          if (i == removeUsers.length - 1){
            return callback(i)
          }
        })
      })
  }

  saveRecurringShift(shift, days){
      const payload = {
        id: shift.id,
        positionId: shift.positionId,
        workerCount: shift.numberOfTeamMembers,
        creator: localStorage.getItem('userId'),
        startTime: moment(shift.startTime).format('HH:mm'),
        endTime: moment(shift.endTime).format('HH:mm'),
        instructions: shift.instructions,
        unpaidBreakTime: shift.unpaidBreak,
        expiration: shift.endDate,
        startDate: shift.startDate,
        days: days,
      };
      this.props.updateRecurringShift({
        variables: {
          data: {
            id: shift.id,
            recurringShiftPatch: payload
          }
        },
      }).then(({ data }) => {

        var uri = 'http://localhost:8080/api/kronosApi'

        var options = {
            uri: uri,
            method: 'POST',
            json: {         
                  "sec": "QDVPZJk54364gwnviz921",
                  "actionType": "deleteRecurring",
                  "testing": true,
                  "recurring_shift_id": shift.id,
                  "date": shift.startDate || moment().format(),
                  "edit": true
              }
        };
         rp(options)
          .then(function(response) {
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
    console.log([modal])
    this.setState({
      deleteModalPopped: false
    })
  };

  onLocationClick = () => {
    console.log('onLocationClick');
  };


  render() {
    let { data, users }= this.props;
    let pastDate = moment().diff(data.startTime) > 0;
    let startTime = moment(data.startTime).format('h:mm A');
    let endTime = moment(data.endTime).format('h:mm A');

    if (startTime == "Invalid date"){
        let start = data.startTime.split(":")
        let end = data.endTime.split(":")
        startTime = moment().hour(parseInt(start[0])).minute(parseInt(start[1])).format("hh:mm A");
        endTime = moment().hour(parseInt(end[0])).minute(parseInt(end[1])).format("hh:mm A");
    }
            
    let h = moment.utc(moment(endTime, 'h:mm A').diff(moment(startTime, 'h:mm A'))).format('HH');
    let m = moment.utc(moment(endTime, 'h:mm A').diff(moment(startTime, 'h:mm A'))).format('mm');
    let deleteShiftAction = [{ type: 'white', title: 'Cancel', handleClick: this.handleClose, image: false },
      { type: 'red', title: 'Delete Shift', handleClick: this.deleteShift, image: '/images/modal/close.png' }];
    if (data.workersAssigned == null) {
      data.workersAssigned = [];
    }
    if (data.workersInvited == null) {
      data.workersInvited = [];
    }

    var workersCount = data.workersRequestedNum || data.workerCount
    this.openShift = workersCount - (data.workersAssigned.length + data.workersInvited.length );

    return (
      <div className="day-item hov">

        <div className="start-time">
          <span className="fa fa-clock-o" />
          <p className="date-time"> {startTime.replace('M', '')} <br /> {endTime.replace('M', '')}</p>
          <p className="duration">{h} HRS & &thinsp; <br /> {m} MINS</p>
        </div>

        {this.props.view == 'job'
          ? <div className="location">
                <span className="fa fa-map-marker" aria-hidden="true">
                    <a onClick={() => this.onLocationClick()} />
                </span>
            <span>
                    {data.workplaceByWorkplaceId.workplaceName}
                </span>
          </div>
          : <div className="location">
            <span className="jobTypeIcon"><img src="/assets/Icons/cashier.png" alt="jobtype" /></span>
            <span className="jobType">{data.positionByPositionId.positionName}</span>
          </div>
        }

        {this.props.view == 'job'
          ? <div className="day-item-title">
            {this.openShift > 0 && <span className="box-title openshift">{this.openShift}</span>}
            {data.workersInvited.length > 0 &&
            <span className="box-title pendingshift">{data.workersInvited.length}</span>
            }{data.workersAssigned.length > 0 &&
          <span className="box-title filledshift">{data.workersAssigned.length}</span>}
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
            </div>
          </div>
        }
        <Modal
          title="Confirm"
          isOpen={this.state.deleteModalPopped}
          message="Are you sure that you want to delete this repeating shift?"
          action={deleteShiftAction}
          closeAction={this.modalClose} />
        <EditShiftDrawerContainer
          shift={data}
          users={users}
          open={this.state.newShiftModalPopped}
          handlerClose={this.handleNewShiftDrawerClose}
          handleHistory={this.handleHistoryDrawer} />
        <EditShiftDetailsDrawer
          width={800}
          open={this.state.editShiftModalOpen}
          shift={this.state.drawerShift}
          recurring={true}
          edit={true}
          handleSubmit={this.handleShiftUpdateSubmit}
          handleAdvance={this.handleAdvanceToggle}
          closeDrawer={this.closeEditShiftModal} />
        <CreateShiftAdvanceDrawer
          width={700}
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
          </div>
        </div>
      </div>
    )
  }
}

const deleteShift = gql`
  mutation($clientMutationId: String,$id: Uuid!){
    updateRecurringShiftById(
    input: {clientMutationId: $clientMutationId,
    id: $id}){
            recurringShift{
                id
            }
    }
  }`;

const EventPopup = compose(
graphql(updateRecurringShift, {
  name: 'updateRecurringShift'
}),
graphql(deleteRecurringShiftAssigneeById, {
  name: 'deleteRecurringShiftAssigneeById'
}),
graphql(createRecurringShiftAssignee, {
  name: 'createRecurringShiftAssignee'
}),
)(EventPopupComponent);

export default EventPopup;
