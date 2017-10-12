import React, { Component } from 'react';
import moment from 'moment';
import { cloneDeep, findLastIndex } from 'lodash';
import { gql, graphql, compose } from 'react-apollo';
import {
  updateShiftMutation,
  deleteShiftMutation,
  updateRecurringShiftById
} from './ShiftEdit/EditShiftDrawer.graphql';
import Modal from '../../helpers/Modal';
import CreateShiftAdvanceDrawerContainer from '../AddShift/CreateShift/CreateShiftAdvanceDrawerContainer';
import CreateShiftDrawerContainer from '../AddShift/CreateShift/CreateShiftDrawerContainer';
import EditShiftDrawerContainer from './ShiftEdit/EditShiftDrawerContainer';
import ShiftHistoryDrawerContainer from './ShiftEdit/ShiftHistoryDrawerContainer';
import DeleteRecuringPopUp from './DeleteRecuringPopUp';
import '../style.css';
import './shiftWeekTable.css';

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
      isSorted: true,
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

  deleteShift = () => {
    let id = this.props.data.id;
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

  deleteRecurringShift = () => {
    let {id} = this.props.data, {startTime} = this.props.data;
    let {recurringShiftId} = this.props.data;
    let that = this;

    that.props.updateRecurringShiftById(recurringShiftId,startTime)
      .then(({ data }) => {
        console.log('Updated', data);
        that.deleteShift();
      }).catch((error) => {
      console.log('there was an error sending the query deleteRecurringShift', error);
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
      this.setState({ newShiftModalPopped: true , isSorted: false});
    }
  };
  handleHistoryDrawer = () => {
    this.setState({ shiftHistoryDrawer: !this.state.shiftHistoryDrawer });
  };

  handleNewShiftDrawerClose = () => {
    this.setState({ newShiftModalPopped: !this.state.newShiftModalPopped });
  };

  handleShiftUpdateSubmit = (shiftValue) => {
    const shift = cloneDeep(shiftValue);
    const shiftDay = shiftValue.startTime;
    const shiftDate = shiftDay.date();
    const shiftMonth = shiftDay.month();
    const shiftYear = shiftDay.year();
    shift.startTime = moment.utc(shift.startTime).date(shiftDate).month(shiftMonth).year(shiftYear).second(0);
    shift.endTime = moment.utc(shift.endTime).date(shiftDate).month(shiftMonth).year(shiftYear).second(0);
    const payload = {
      id: shiftValue.id,
      workplaceId: shift.workplaceId,
      positionId: shift.positionId,
      workersRequestedNum: shift.numberOfTeamMembers,
      creatorId: localStorage.getItem('userId'),
      startTime: moment.utc(shift.startTime),
      endTime: moment.utc(shift.endTime),
      instructions: shift.instructions,
      unpaidBreakTime: shift.unpaidBreak
    };
    if (shift.teamMembers && shift.teamMembers.length) {
      payload.workersAssigned = shift.teamMembers.map(({ id }) => id);
    }
    this.props.updateShiftMutation({
        variables: {
          data: {
            id: shiftValue.id,
            shiftPatch: payload
          }
        },
      updateQueries: {
        allShiftsByWeeksPublished: (previousQueryResult, { mutationResult }) => {
          const shiftHash = mutationResult.data.updateShiftById.shift;
          const shiftHashIndex = findLastIndex(previousQueryResult.allShifts.edges, ({ node }) => node.id = shiftHash.id);
          if (shiftHashIndex !== -1) {
            previousQueryResult.allShifts.edges[shiftHashIndex].node = shiftHash;
          }
          return {
            allShifts: previousQueryResult.allShifts
            };
        },
      },
    }).then(({ data }) => {
      console.log('got data', data);
    }).catch(err => {
      console.log('There was error in saving shift', err);
    });
    this.setState({ editShiftModalOpen: false, isCreateShiftAdvanceOpen: false });
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
    let { data, users } = this.props;
    const mappedUsers = users && users.allUsers && users.allUsers.edges.map(({ node }) => node);
    let pastDate = moment().diff(data.startTime) > 0;
    let startTime = moment(data.startTime).format('h:mm A');
    let endTime = moment(data.endTime).format('h:mm A');
    let startTimeDiff = moment(data.startTime);
    let endTimeDiff = moment(data.endTime);
    const duration = moment.duration(endTimeDiff.diff(startTimeDiff));
    let hoursDiff = parseInt(duration.asHours());
    let minDiff = parseInt(duration.asMinutes())-hoursDiff*60;
    let {recurringShiftId} = this.props.data;

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
    let deleteShiftRenderAction = [{ type: 'red', title: 'All Following',   handleClick: this.deleteRecurringShift, image: '/images/modal/close.png' },
      { type: 'red', title: 'Only this', handleClick: this.deleteShift, image: '/images/modal/close.png' }];
    if (data.workersAssigned == null) {
      data.workersAssigned = [];
    }
    if (data.workersInvited == null) {
      data.workersInvited = [];
    }

    var workersCount = data.workersRequestedNum || data.workerCount
    this.openShift = workersCount - (data.workersAssigned.length + data.workersInvited.length );
    console.log(data)

    return (

      <div className="day-item hov">

        <div for='top-card-spacing' style={{flex:3}} />

        <div className="start-time" style={{display:'flex', flexDirection:'row', flex:18}}>
          <div style={{display:'flex', flexDirection:'column', flex:12}}>
            <span className="fa fa-clock-o" />
          </div>
          <div style={{display:'flex', flexDirection:'row', flex:82, justifyContent:'space-between'}}>
            <div style={{display:'grid'}}>
              <div style={{whiteSpace:'nowrap', color:'#0022A1', fontWeight:'light', fontFamily:'Varela Round', fontSize:19}}>{startTime.replace('M', '')}</div>
              <div style={{whiteSpace:'nowrap', color:'#0022A1', fontWeight:'light', fontFamily:'Varela Round', fontSize:19}}>{endTime.replace('M', '')}</div>
            </div>
            <div style={{display:'grid'}}>
              <div style={{whiteSpace:'nowrap', color:'#4B4B4B', fontFamily:'Varela Round', fontSize:11}}>{h} HRS &</div>
              <div style={{whiteSpace:'nowrap', color:'#4B4B4B', fontFamily:'Varela Round', fontSize:11}}>{m} MINS</div>
            </div>
          </div>
        </div>

        <div style={{display:'flex', flexDirection:'row', flex:15}}>
          <div style={{display:'flex', flexDirection:'row', flex:12}}>
            <span className="fa fa-map-marker" aria-hidden="true" />
          </div>
          <div style={{display:'flex', flexDirection:'row', flex:76, justifyContent:'start'}}>
            <span className="location">{data.workplaceByWorkplaceId.workplaceName}</span>
          </div>
          <div  style={{display:'flex', flexDirection:'row', flex:12, justifyContent:'spaceBetween'}}>
            <img style={{margin:3, paddingBottom: 5}} src="/assets/Icons/job-shadower-filled.png"/>
            <span style={{display:'flex', flexDirection:'column', justifySelf:'start'}}>0</span>
          </div>
        </div>

        <div style={{display:'flex', flexDirection:'row', flex:11, justifyContent:'space-between'}}>
          <div style={{display:'flex', flexDirection:'row', flex:12}} />
          <div for='shift-counts'>
            <div className="day-item-title">
              {this.openShift > 0 && <span className="box-title openshift">{this.openShift}</span>}
              {data.workersInvited.length > 0 &&
              <span className="box-title pendingshift">{data.workersInvited.length}</span>
              }{data.workersAssigned.length > 0 &&
            <span className="box-title filledshift">{data.workersAssigned.length}</span>}
            </div>
          </div>
          <div>
            <img style={{margin:3, paddingBottom:5, width: 25, height:'auto'}} src="/assets/Icons/repeating-shifts.png"/>
          </div>
        </div>
        <div for='top-calendar-spacing' style={{flex:3}} />

        {recurringShiftId ?
          <DeleteRecuringPopUp
          title="Confirm"
          isOpen={this.state.deleteModalPopped}
          message="Are you sure that you want to delete this shift?"
          action={deleteShiftRenderAction}
          closeAction={this.modalClose} />:
          <Modal
            title="delete"
            isOpen={this.state.deleteModalPopped}
            message="Delete only this shift?"
            action={deleteShiftAction}
            closeAction={this.modalClose} />
          }
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
          isSorted={this.state.isSorted}
          handleBack={this.handleNewShiftDrawerClose}
          handleHistory={this.handleHistoryDrawer} />

        <CreateShiftDrawerContainer
          width={styles.drawer.width}
          open={this.state.editShiftModalOpen}
          shift={this.state.drawerShift}
          users={mappedUsers}
          managers={this.props.managers}
          handleSubmit={this.handleShiftUpdateSubmit}
          handleAdvance={this.handleAdvanceToggle}
          closeDrawer={this.closeEditShiftModal} />

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
          let newEdges = []
          previousQueryResult.allShifts.edges.map((value) => {
            if (value.node.id != mutationResult.data.deleteShiftById.shift.id) {
              newEdges.push(value)
            }
          })
          previousQueryResult.allShifts.edges = newEdges
          return {
            allShifts: previousQueryResult.allShifts
          };
        },
      },
    }),
  }),
}), graphql(updateRecurringShiftById, {
  props: ({ ownProps, mutate }) => ({
    updateRecurringShiftById: (recurringShiftId, startTime) => mutate({
      variables: {
        data: {
          id: recurringShiftId,
          recurringShiftPatch: {expiration: startTime},
        }
      },
      updateQueries: {
        allShiftsByWeeksPublished: (previousQueryResult, { mutationResult }) => {
          let newEdges = []
          previousQueryResult.allShifts.edges.map((value) => {
            if (value.node.recurringShiftId === mutationResult.data.updateRecurringShiftById.recurringShift.id) {
              value.node.recurringShiftId = null;
              newEdges.push(value);
            }
          })
          previousQueryResult.allShifts.edges = newEdges
          return {
            allShifts: previousQueryResult.allShifts
          };
        },
      },
    }),
  }),
}),graphql(updateShiftMutation, {
    name: 'updateShiftMutation'
}))(EventPopupComponent);

export default EventPopup;
