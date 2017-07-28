import React, { Component } from 'react';
import moment from 'moment';
import '../../Scheduling/style.css';
import Modal from '../../helpers/Modal';

export default class EventPopup extends Component{
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

    };

    onPopupOpen = (modal) => {
        switch(modal){
            case "deleteModalPopped" : this.setState({deleteModalPopped:true});
            case "editModalPopped" : this.setState({editModalPopped:true});
            case "newShiftModalPopped" : this.setState({newShiftModalPopped:true});
        }
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
            {type:"red",title:"Delete Shift",handleClick:this.deleteShift,image:true}];
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

