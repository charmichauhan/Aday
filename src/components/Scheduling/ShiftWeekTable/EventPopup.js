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
                <div className="day-item-title">
                    <a className="glyphicon glyphicon-plus" onClick={(e)=>this.onPopupClose(e)}/>
                    <span className="box-title">1</span>
                    <p className="duration">{h} HR&thinsp; {m}MIN </p>
                </div>
                <div className="start-time">
                    <span className="fa fa-clock-o"/>
                    <p className=""> {data['timeFrom']} <small>TO</small>  {data['timeTo']} </p>
                </div>
                <div className="location">
                    <a className="fa fa-map-marker fa-5" aria-hidden="true" onClick={()=>this.onLocationClick()}/>
                    <p>{data['location']}</p>
                </div>
            </div>
        )
    }
}

