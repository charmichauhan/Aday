import React, { Component } from 'react';
import moment from 'moment';
import close from '../../../../public/assets/Icons/close-shift.png';
import edit from '../../../../public/assets/Icons/edit-shift.png';
import create from '../../../../public/assets/Icons/create-shift.png';
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
    onPopupOpen = (modal) => {
        //console.log(modal)
        /*this.setState({
            deleteModalPopped : true
        })*/
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
        let startTime = moment(data['timeFrom'],"hh:mm a");
        let endTime = moment(data['timeTo'],"hh:mm a");
        let h = endTime.diff(startTime,'hours');
        let m = moment.utc(moment(endTime,"HH:mm:ss").diff(moment(startTime,"HH:mm:ss"))).format("mm");
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
                    {data["openShift"]===""?"":<span className="box-title openshift">{data["openShift"]}</span>}
                    {data["pendingShift"]===""?"":<span className="box-title pendingshift">{data["pendingShift"]}</span>}
                    {data["filledShift"]===""?<span className="box-title filledshift">\</span>:<span className="box-title filledshift">{data["filledShift"]}</span>}
                </div>
                <div className="overlay">
                    <div className="hoimg">
                        <a href="#" onClick={()=>this.onPopupOpen("deleteModalPopped")}><img src={close} alt="close"/></a>
                        <a href="#" onClick={()=>this.onPopupOpen("editModalPopped")}><img src={edit} alt="edit"/></a>
                        <a href="#" onClick={()=>this.onPopupOpen("newShiftModalPopped")}><img src={create} alt="create"/></a>
                    </div>
                </div>
            </div>
        )
    }
}

