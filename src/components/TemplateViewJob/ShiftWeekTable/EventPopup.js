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
        let startTime = moment(data['timeFrom'],"hh:mm a");
        let endTime = moment(data['timeTo'],"hh:mm a");
        let h = endTime.diff(startTime,'hours');
        let m = moment.utc(moment(endTime,"HH:mm:ss").diff(moment(startTime,"HH:mm:ss"))).format("mm");
        let deleteShiftAction =[{type:"white",title:"Cancel",handleClick:this.handleClose,image:false},
                                {type:"red",title:"Delete Shift",handleClick:this.deleteShift,image:true}];
        return(
            <div className="day-item hov">
                <div className="start-time">
                    <span className="fa fa-clock-o"/>
                    <p className="date-time"> {data['timeFrom']} {data['timeTo']} </p>
                    <p className="duration">{h} HR&thinsp; {m}MIN </p>
                </div>
                <div className="location">
                    <span className="fa fa-map-marker mr5" aria-hidden="true">
                        <a onClick={()=>this.onLocationClick()}/>
                    </span>
                    <span>{data['location']}</span>
                </div>
                <div className="day-item-title">
                    {data["openShift"]!=="" && <span className="box-title openshift">{data["openShift"]}</span>}
                    {data["pendingShift"]!=="" && <span className="box-title pendingshift">{data["pendingShift"]}</span>}
                    {data["filledShift"]===""?<span className="box-title filledshift">\</span>:<span className="box-title filledshift">{data["filledShift"]}</span>}
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

