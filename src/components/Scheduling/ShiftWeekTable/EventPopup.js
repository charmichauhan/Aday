import React, { Component } from 'react';
import moment from 'moment';
import close from '../../../../public/assets/Icons/close-shift.png';
import edit from '../../../../public/assets/Icons/edit-shift.png';
import create from '../../../../public/assets/Icons/create-shift.png';
import Modal from '../../helpers/Modal';
import '../style.css';
import './shiftWeekTable.css';


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
        //console.log(modal)
        /*this.setState({
         deleteModalPopped : true
         })*/
    };
    onPopupOpen = (modal) => {
        switch(modal){
            case "deleteModalPopped" : this.setState({deleteModalPopped:true});
            case "editModalPopped" : this.setState({editModalPopped:true});
            case "newShiftModalPopped" : this.setState({newShiftModalPopped:true});
        }
    };
    onPopupClose = (modal) => {
        console.log("Close");
        console.log([modal])
        this.setState({
            deleteModalPopped: false
        })
    };

    onLocationClick = () => {
        console.log("onLocationClick");
    };

    render(){
        let data=this.props.data;
        let startTime = moment(data.startTime,"hh:mm a");
        let endTime = moment(data.endTime,"hh:mm a");;
        let h = endTime.diff(startTime,'hours');
        let m = moment.utc(moment(endTime,"HH:mm:ss").diff(moment(startTime,"HH:mm:ss"))).format("mm");
        let deleteShiftAction =[{type:"white",title:"Cancel",handleClick:this.handleClose,image:false},
            {type:"red",title:"Delete Shift",handleClick:this.deleteShift,image:true}];
        this.openShift = data.workersRequestedNum - (data.workersAssigned.length + data.workersInvited.length );
        return(
            <div className="day-item hov">
                <div className="start-time">
                    <span className="fa fa-clock-o"/>
                     <p className="date-time"> {startTime.format("HH:mm")} {endTime.format("HH:mm")} </p>
                    <p className="duration">{h} HR&thinsp; {m}MIN </p>
                </div>
                <div className="location">
                    <span className="fa fa-map-marker mr5" aria-hidden="true">
                        <a onClick={()=>this.onLocationClick()}/>
                    </span>
                    <span>{data.workplaceByWorkplaceId.workplaceName}</span>
                </div>
                <div className="day-item-title">
                    {this.openshift ===""?"":<span className="box-title openshift">{this.openShift}</span>}
                    {data.workersInvited.length===""?"":<span className="box-title pendingshift">{data.workersInvited.length}</span>}
                    {data.workersAssigned.length===""?<span className="box-title filledshift">\</span>:<span className="box-title filledshift">{data.workersAssigned.length}</span>}
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

