import React, { Component } from 'react';
import moment from 'moment';
import '../../Scheduling/style.css';
import close from '../../../../public/assets/Icons/close-shift.png';
import edit from '../../../../public/assets/Icons/edit-shift.png';
import create from '../../../../public/assets/Icons/create-shift.png';
import cashier from "../../../../public/assets/Icons/cashier.png"
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
                    <p className="date-time"> {startTime.format("HH:mm")} {endTime.format("HH:mm")} </p>
                    <p className="duration">{h} HR&thinsp; {m}MIN </p>
                </div>
                <div className="location">
                    <span><img src={cashier} alt="jobtype"/></span>
                    <span className="jobType">{data.workplace}</span>
                </div>
                 <div className="location">
                    <span className="fa fa-map-marker mr5" aria-hidden="true">
                        <a onClick={()=>this.onLocationClick()}/>
                    </span>
                    <span className="jobType">{data.positionByPositionId.positionName}</span>
                </div>
                {this.state.deleteModalPopped?<Modal title="Confirm" isOpen={this.state.deleteModalPopped}
                                                     message = "Are you sure that you want to delete this shift?"
                                                     action = {deleteShiftAction} closeAction={this.modalClose}/>
                    :""}
                <div className="overlay">
                    <div className="hoimg">
                        <a onClick={()=>this.onPopupOpen("deleteModalPopped")}><img src={close} alt="close"/></a>
                        <a onClick={()=>this.onPopupOpen("editModalPopped")}><img src={edit} alt="edit"/></a>
                        <a onClick={()=>this.onPopupOpen("newShiftModalPopped")}><img src={create} alt="create"/></a>
                    </div>
                </div>
            </div>
        )
    }
}

