import React, { Component } from 'react';
import moment from 'moment';
import Modal from '../../helpers/Modal';
import EditShiftDrawer from './ShiftEdit/EditShiftDrawer';
import ShiftHistoryDrawer from './ShiftEdit/ShiftHistoryDrawer';
import '../style.css';
import './shiftWeekTable.css';


export default class EventPopup extends Component {
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
      deleteModalPopped: false
    })
  };

  modalClose = () => {
    this.setState({
      deleteModalPopped: false
    });
  };

  deleteShift = () => {

  };

  handleEditShiftDrawerClose = () => {
    this.setState({ editShiftDrawerOpen: !this.state.editShiftDrawerOpen });
  };

  handleHistoryDrawer = () => {
    this.setState({ shiftHistoryDrawer: !this.state.shiftHistoryDrawer });
  };

  handleNewShiftDrawerClose = () => {
    this.setState({ newShiftModalPopped: !this.state.newShiftModalPopped });
  };

  onPopupOpen = (modal) => {
    //console.log(modal)
    /*this.setState({
     deleteModalPopped : true
     })*/
  };
  onPopupOpen = (modal) => {
    switch (modal) {
      case 'deleteModalPopped' :
        this.setState({ deleteModalPopped: true });
      case 'editShiftDrawer' :
        this.setState({ editShiftDrawerOpen: true });
      case 'newShiftModalPopped' :
        this.setState({ newShiftModalPopped: true });
    }
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
    let data = this.props.data;
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
        <div className="location">
                    <span className="fa fa-map-marker mr5" aria-hidden="true">
                        <a onClick={() => this.onLocationClick()} />
                    </span>
          <span>{data.workplaceByWorkplaceId.workplaceName}</span>
        </div>
        <div className="day-item-title">
          {this.openShift > 0 && <span className="box-title openshift">{this.openShift}</span>}
          {data.workersInvited.length > 0 &&
          <span className="box-title pendingshift">{data.workersInvited.length}</span>}
          {data.workersAssigned.length > 0 &&
          <span className="box-title filledshift">{data.workersAssigned.length}</span>}
        </div>
        <Modal
          title="Confirm"
          isOpen={this.state.deleteModalPopped}
          message="Are you sure that you want to delete this shift?"
          action={deleteShiftAction}
          closeAction={this.modalClose} />
        <EditShiftDrawer
          open={this.state.newShiftModalPopped}
          handlerClose={this.handleNewShiftDrawerClose}
          handleHistory={this.handleHistoryDrawer} />
        <ShiftHistoryDrawer
          open={this.state.shiftHistoryDrawer}
          handleBack={this.handleNewShiftDrawerClose}
          handleHistory={this.handleHistoryDrawer} />
        <div className="overlay">
          <div className="hoimg">
            <a onClick={() => this.onPopupOpen('deleteModalPopped')}>
              <i><img src="/assets/Icons/close-shift.png" alt="close" /></i>
            </a>
            <a onClick={() => this.onPopupOpen('editShiftDrawer')}>
              <i><img src="/assets/Icons/edit-shift.png" alt="edit" /></i>
            </a>
            <a onClick={() => this.onPopupOpen('newShiftModalPopped')}>
              <i><img src="/assets/Icons/create-shift.png" alt="create" /></i>
            </a>
          </div>
        </div>
      </div>
    )
  }
}

