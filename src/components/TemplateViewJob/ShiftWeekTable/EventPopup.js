import React, { Component } from 'react';
import moment from 'moment';
import '../../Scheduling/style.css';
import Modal from '../../helpers/Modal';
import { gql, graphql, compose } from 'react-apollo';
const uuidv4 = require('uuid/v4');

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

    deleteShift = () => {
        let id =this.props.data.id;
        let that = this;
        that.props.deleteTemplateShiftById(uuidv4(),id)
            .then(({ data }) => {
                console.log('Delete Data', data);
            }).catch((error) => {
            console.log('there was an error sending the query', error);
        });
        that.setState({deleteModalPopped:false});
    };

    onPopupOpen = (modal) => {
        switch(modal){
            case "deleteModalPopped"   : this.setState({deleteModalPopped:true});
                                         break;
            case "editModalPopped"     : this.setState({editModalPopped:true});
                                         break;
            case "newShiftModalPopped" : this.setState({newShiftModalPopped:true});
                                         break;
            default:
                    break;
        }
    };
    onLocationClick = () => {
        console.log("onLocationClick");
    };
    render(){
        let data=this.props.data;
        let startTime = moment(data.startTime, "HH:mm:ss");
        let endTime = moment(data.endTime, "HH:mm:ss");
        let h = endTime.diff(startTime,'hours');
        let m = moment.utc(moment(endTime).diff(moment(startTime))).format("mm");
        let deleteShiftAction =[{type:"white",title:"Cancel",handleClick:this.handleClose,image:false},
                                {type:"red",title:"Delete Shift",handleClick:this.deleteShift,image:true}];
        return(
            <div className="day-item hov">
                <div className="start-time">
                    <span className="fa fa-clock-o"/>
                    <p className="date-time">{startTime.format("HH:mm")} {endTime.format("HH:mm")}</p>
                    <p className="duration">{h} HR&thinsp; {m}MIN</p>
                </div>
                <div className="location">
                    <span className="fa fa-map-marker mr5" aria-hidden="true">
                        <a onClick={()=>this.onLocationClick()}/>
                    </span>
                    <span>{data.workplace || ""}</span>
                </div>
                <div className="day-item-title">
                    {/*{this.openShift>0 && <span className="box-title openshift">{this.openShift}</span>}*/}
                    {/*{data.workersInvited.length>0 && <span className="box-title pendingshift">{data.workersInvited.length}</span>}*/}
                    {/*{data.workersAssigned.length==0?<span className="box-title filledshift">\</span>:<span className="box-title filledshift">{data.workersAssigned.length}</span>}*/}
                </div>
                {this.state.deleteModalPopped && <Modal title="Confirm" isOpen={this.state.deleteModalPopped}
                                                        message = "Are you sure that you want to delete this shift?"
                                                        action = {deleteShiftAction} closeAction={this.modalClose}/>
                }
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
    deleteTemplateShiftById(
    input: {clientMutationId: $clientMutationId,
    id: $id}){
            deletedTemplateShiftId
    }
  }`
const EvevtPopup = graphql(deleteShift,{
    props:({ownProps,mutate}) =>({
        deleteTemplateShiftById:(clientMutationId,id) => mutate({
            variables: {clientMutationId: clientMutationId,id: id},
        }),

    }),
})(EventPopupComponent);

export default EvevtPopup;
