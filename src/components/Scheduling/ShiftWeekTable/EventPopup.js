import React, { Component } from 'react';
import moment from 'moment';
import '../style.css';

export default class EventPopup extends Component{
    onPopupClose = () => {
        console.log("Close");
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
            <div className="day-item">
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
            </div>
        )
    }
}

