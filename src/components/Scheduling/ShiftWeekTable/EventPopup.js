import React, { Component } from 'react';
import moment from 'moment';
import Modal from '../../helpers/Modal';
import EditShiftDrawerContainer from './ShiftEdit/EditShiftDrawerContainer';
import EditShiftModal from './ShiftEdit/EditShiftModal';
import ShiftHistoryDrawer from './ShiftEdit/ShiftHistoryDrawer';
import { gql, graphql, compose } from 'react-apollo';
import '../style.css';
import './shiftWeekTable.css';
const uuidv4 = require('uuid/v4');

class EventPopupComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      deleteModalPopped: false,
      editModalPopped: false,
      newShiftModalPopped: false,
      shiftHistoryDrawer: false,
    }
  }

  handleClose = () => {
    this.setState({
      deleteModalPopped:false
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
    if (modal == 'deleteModalPopped'){
        this.setState({ deleteModalPopped: true });
    }
    else if (modal == 'EditShiftDrawerContainer' ){
        this.setState({ editShiftDrawerOpen: true });
    }
    else if (modal == 'editShiftModal' ){
        this.setState({ editShiftModalOpen: true });
    }
    else if (modal ==  'newShiftModalPopped' ){
        this.setState({ newShiftModalPopped: true });
    }
  };
  handleHistoryDrawer = () => {
    this.setState({ shiftHistoryDrawer: !this.state.shiftHistoryDrawer });
  };

  handleNewShiftDrawerClose = () => {
    this.setState({ newShiftModalPopped: !this.state.newShiftModalPopped });
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
    let startTime = moment(data.startTime).format('hh:mm A');
    let endTime = moment(data.endTime).format('hh:mm A');
    let h = moment.utc(moment(endTime, 'hh:mm A').diff(moment(startTime, 'hh:mm A'))).format('HH');
    let m = moment.utc(moment(endTime, 'hh:mm A').diff(moment(startTime, 'hh:mm A'))).format('mm');
    let deleteShiftAction = [{ type: 'white', title: 'Cancel', handleClick: this.handleClose, image: false },
      { type: 'red', title: 'Delete Shift', handleClick: this.deleteShift, image: '/images/modal/close.png' }];
    if (data.workersAssigned == null) {
      data.workersAssigned = [];
    }
    if (data.workersInvited == null) {
      data.workersInvited = [];
    }
    this.openShift = data.workersRequestedNum - (data.workersAssigned.length + data.workersInvited.length );
    return (
      <div className="day-item hov">
        <div className="start-time">
          <span className="fa fa-clock-o" />
          <p className="date-time"> {startTime.replace('M', '')} {endTime.replace('M', '')}</p>
          <p className="duration">{h} HR&thinsp; {m}MIN</p>
        </div>
        {this.props.view=="job"?
          <div className="location">
                    <span className="fa fa-map-marker mr5" aria-hidden="true">
                        <a onClick={() => this.onLocationClick()} />
                    </span>
            <span>{data.workplaceByWorkplaceId.workplaceName}</span>
          </div>:
          <div className="location">
            <span><img src="/assets/Icons/cashier.png" alt="jobtype"/></span>
            <span className="jobType">{data.positionByPositionId.positionName}</span>
          </div>
        }
        {
          this.props.view=="job"?
            <div className="day-item-title">
              {this.openShift > 0 && <span className="box-title openshift">{this.openShift}</span>}
              {data.workersInvited.length > 0 &&
              <span className="box-title pendingshift">{data.workersInvited.length}</span>}
              {data.workersAssigned.length > 0 &&
              <span className="box-title filledshift">{data.workersAssigned.length}</span>}
            </div>:
            <div>
            <div className="location">
                    <span className="fa fa-map-marker mr5" aria-hidden="true">
                        <a onClick={() => this.onLocationClick()} />
                    </span>
              <span className="jobType">{data.workplaceByWorkplaceId.workplaceName}</span>
            </div>
            <div className="day-item-title">
              {data.userFirstName == "Open" && data.userLastName == "Shifts" && this.openShift > 0
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
        <ShiftHistoryDrawer
          shift={data}
          users={users}
          open={this.state.shiftHistoryDrawer}
          handleBack={this.handleNewShiftDrawerClose}
          handleHistory={this.handleHistoryDrawer} />
        <EditShiftModal open={ this.state.editShiftModalOpen } onClose={ this.closeEditShiftModal } data={ this.props.data }/>
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

const EventPopup = graphql(deleteShift, {
  props: ({ ownProps, mutate }) => ({
    deleteShiftById: (clientMutationId, id) => mutate({
      variables: { clientMutationId: clientMutationId, id: id },
       updateQueries: {
            allShiftsByWeeksPublished: (previousQueryResult, { mutationResult }) => {
              let newEdges = []
              previousQueryResult.allShifts.edges.map((value) => {
                    if(value.node.id != mutationResult.data.deleteShiftById.shift.id){
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
})(EventPopupComponent);

export default EventPopup;
