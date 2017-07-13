import React, { Component } from 'react';
import moment from 'moment';
import { Icon, Button } from 'semantic-ui-react';

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
    }
    onPopupClose = (modal) => {
        console.log("Close");
        console.log([modal])
        this.setState({
            deleteModalPopped: false
        })
    }

    onLocationClick = () => {
        console.log("onLocationClick");
    }

    render(){
        let data=this.props.data;
        let startTime = moment(data['timeFrom'],"hh:mm a");
        let endTime = moment(data['timeTo'],"hh:mm a");
        let h = endTime.diff(startTime,'hours');
        let m = moment.utc(moment(endTime,"HH:mm:ss").diff(moment(startTime,"HH:mm:ss"))).format("mm");
        return(
            <div>

                <div className="day-item">
                    <div className="day-item-content">
                        <div className="day-item-title">
                            <a className="glyphicon glyphicon-plus" onClick={(e)=>this.onPopupClose(e)}/>
                            {data["openShift"]===""?"":<span className="box-title openshift">{data["openShift"]}</span>}
                            {data["pendingShift"]===""?"":<span className="box-title pendingshift">{data["pendingShift"]}</span>}
                            {data["filledShift"]===""?<span className="box-title filledshift">\</span>:<span className="box-title filledshift">{data["filledShift"]}</span>}
                            <p className="duration">{h} HR&thinsp; {m}MIN </p>
                        </div>
                        <div className="start-time">
                            <span className="fa fa-clock-o"/>
                            <p className=""> {data['timeFrom']} <small>TO</small> {data['timeTo']} </p>
                        </div>
                        <div className="location">
                            <span className="fa fa-map-marker mr5" aria-hidden="true">
                                <a onClick={()=>this.onLocationClick()}/>
                            </span>
                            <span>{data['location']}</span>
                        </div>
                    </div>
                    <div className="aday-overlay">
                        <div className="ui icon basic small buttons day-overlay-toolbar">
                            <Button
                                className="ui button"
                                onClick={this.onPopupOpen("deleteModalPopped")}>
                                    <Icon name="trash"/>
                            </Button>
                            <Button
                                className="ui button"
                                onClick={this.onPopupOpen("editModalPopped")}>
                                    <Icon name="edit"/>
                            </Button>
                            <Button
                                className="ui button"
                                onClick={this.onPopupOpen("newShiftModalPopped")}>
                                    <Icon name="add user"/>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

