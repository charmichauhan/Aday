import React, { Component } from 'react';
import moment from 'moment';
import '../../Scheduling/style.css';
import { gql, graphql, compose } from 'react-apollo';
import Modal from '../../helpers/Modal';
import EditShiftDrawer from './ShiftEdit/EditShiftDrawer';
import ShiftHistoryDrawer from './ShiftEdit/ShiftHistoryDrawer';
const uuidv4 = require('uuid/v4');
import EditShiftModal from '../../Scheduling/ShiftWeekTable/ShiftEdit/EditShiftModal';

    class EventPopupComponent extends Component{
    constructor(props){
        super(props)
        this.state = {
            deleteModalPopped: false,
            editModalPopped: false,
            newShiftModalPopped: false
        }
    }
    handleClose = () => {
        this.setState({
            deleteModalPopped:false
        })
    };

    modalClose = () => {
        this.setState({
            deleteModalPopped:false
        });
    };

    closeEditShiftModal = () => {
        this.setState({ editModalPopped: false });
    }

    deleteShift = () => {
        let id =this.props.data.id;
        let that = this;
        let uu = uuidv4();
        that.props.deleteShiftById(uuidv4(), id)
            .then(({ data }) => {
                console.log('Delete Data', data);
            }).catch((error) => {
            console.log('there was an error sending the query', error);
        });
        this.setState({deleteModalPopped:false});
    };

    onPopupOpen = (modal) => {
        switch(modal){
            case "deleteModalPopped" :
                this.setState({deleteModalPopped:true});
                break;
            case "editModalPopped" :
                this.setState({editModalPopped:true});
                break;
            case "newShiftModalPopped" :
                this.setState({newShiftModalPopped:true});
                break;
        }
    };
    handleHistoryDrawer = () => {
      this.setState({ shiftHistoryDrawer: !this.state.shiftHistoryDrawer });
    };

    handleNewShiftDrawerClose = () => {
      this.setState({ newShiftModalPopped: !this.state.newShiftModalPopped });
    };

    onLocationClick = () => {
        console.log("onLocationClick");
    };
    render(){
        let data=this.props.data;
        let startTime = moment(data.startTime).format("hh:mm A");
        let endTime = moment(data.endTime).format("hh:mm A");
        let h = moment.utc(moment(endTime,"hh:mm A").diff(moment(startTime,"hh:mm A"))).format("HH");
        let m = moment.utc(moment(endTime,"hh:mm A").diff(moment(startTime,"hh:mm A"))).format("mm");
        let deleteShiftAction =[{type:"white",title:"Cancel",handleClick:this.handleClose,image:false},
            {type:"red",title:"Delete Shift",handleClick:this.deleteShift,image: '/images/modal/close.png'}];
        return(
            <div className="day-item hov">
                <div className="start-time">
                    <span className="fa fa-clock-o"/>
                    <p className="date-time">{startTime.replace("M","")} {endTime.replace("M","")}</p>
                    <p className="duration">{h} HR&thinsp; {m}MIN </p>
                </div>
                <div className="location">
                    <span><img src="/assets/Icons/cashier.png" alt="jobtype"/></span>
                    <span className="jobType">{data.positionByPositionId.positionName}</span>
                </div>
                <div className="location">
                    <span className="fa fa-map-marker mr5" aria-hidden="true">
                        <a onClick={()=>this.onLocationClick()}/>
                    </span>
                    <span className="jobType">{data.workplaceByWorkplaceId.workplaceName}</span>
                </div>
                <Modal
                title="Confirm"
                isOpen={this.state.deleteModalPopped}
                message="Are you sure that you want to delete this shift?"
                action={deleteShiftAction}
                closeAction={this.modalClose} />
                <EditShiftModal open={ this.state.editModalPopped } onClose={ this.closeEditShiftModal } data={ this.props.data }/>
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
                        <a onClick={()=>this.onPopupOpen("deleteModalPopped")}><i><img src="/assets/Icons/close-shift.png" alt="close"/></i></a>
                        <a onClick={()=>this.onPopupOpen("editModalPopped")}><i><img src="/assets/Icons/edit-shift.png" alt="edit"/></i></a>
                        <a onClick={()=>this.onPopupOpen("newShiftModalPopped")}><i><img src="/assets/Icons/create-shift.png" alt="create"/></i></a>
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
            deletedShiftId
            shift{
                id
            }
    }
  }`
const EventPopup = graphql(deleteShift,{
    props:({ownProps,mutate}) =>({
        deleteShiftById:(clientMutationId,id) => mutate({
            variables: {clientMutationId: clientMutationId,id: id},
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
