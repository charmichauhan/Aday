import React, { Component } from 'react';
import '../../Scheduling/style.css';

export default class HoursBooked extends Component{
    render(){
        let jobData = this.props.Data;
        return (
            <p className="hoursWorked"></p>
        )
    }
}