import React, { Component } from 'react';
import moment from 'moment';
import cloneDeep from 'lodash/cloneDeep';
import { gql, graphql, compose } from 'react-apollo';
import { updateShiftMutation } from './ShiftEdit/EditShiftDrawer.graphql';
import Modal from '../../helpers/Modal';
import CreateShiftAdvanceDrawer from '../AddShift/CreateShift/CreateShiftAdvanceDrawer';
import CreateShiftDrawer from '../AddShift/CreateShift/CreateShiftDrawer';
import EditShiftDrawerContainer from './ShiftEdit/EditShiftDrawerContainer';
import ShiftHistoryDrawerContainer from './ShiftEdit/ShiftHistoryDrawerContainer';

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
          previousQueryResult.allShifts.edges =
            [...previousQueryResult.allShifts.edges, { 'node': shiftHash, '__typename': 'ShiftsEdge' }];
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
    console.log(data)
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
          message="Are you sure that you want to delete this shift?"
          action={deleteShiftAction}
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
          isSorted={this.state.isSorted}
          handleBack={this.handleNewShiftDrawerClose}
          handleHistory={this.handleHistoryDrawer} />
        <CreateShiftDrawer
          width={styles.drawer.width}
          open={this.state.editShiftModalOpen}
          shift={this.state.drawerShift}
          handleSubmit={this.handleShiftUpdateSubmit}
          handleAdvance={this.handleAdvanceToggle}
          closeDrawer={this.closeEditShiftModal} />
        <CreateShiftAdvanceDrawer
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

const deleteShift = gql`
  mutation($clientMutationId: String,$id: Uuid!){
    deleteShiftById(
    input: {clientMutationId: $clientMutationId,
    id: $id}){
            shift{
                id
            }
    }
  }`;

const EventPopup = compose(graphql(deleteShift, {
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
}), graphql(updateShiftMutation, {
  name: 'updateShiftMutation'
}))(EventPopupComponent);

export default EventPopup;
