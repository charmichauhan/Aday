import React, { Component } from 'react';
import moment from 'moment';
import BigCalendar from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import Toolbar from 'react-big-calendar/lib/Toolbar';
import CreateShift from '../../../public/assets/Buttons/create-shift-button.png';
import AddAsTemplate from '../../../public/assets/Buttons/add-as-template.png';
import TemplateList from '../../../public/assets/Buttons/template-list-button.png';
import Automate from '../../../public/assets/Buttons/automate-schedule.png';
import Publish from '../../../public/assets/Buttons/publish.png';
import ShiftWeekTable from './ShiftWeekTable';
import './style.css';

export default class Schedule extends Component {
	render(){
        BigCalendar.momentLocalizer(moment);
		return (
			<div className="App">
				<div style={{ display:"inline"}}>
					<img className="" src={CreateShift} alt="Create Shift"/>
					<img className="pull-right" src={Publish} alt="Publish"/>
					<img className="pull-right" src={Automate} alt="Automate"/>
					<img className="pull-right" src={AddAsTemplate} alt="Add As Template"/>
					<img className="pull-right" src={TemplateList} alt="Template List"/>
				</div>
				<div>
					<BigCalendar events={[]}
								 culture='en-us'
								 startAccessor='startDate'
								 endAccessor='endDate'
								 defaultView='week'
								 views={{today:true,week:ShiftWeekTable,day:true}}
								 components={{
                                     event: Event,
                                     toolbar: CustomToolbar
                                 }}
					/>
				</div>
			</div>
		);
	}
}

class CustomToolbar extends Toolbar{
	render(){
		let month = moment(this.props.date).format("MMMM YYYY");
		return(
			<div>
				<nav className="navbar">
					<div className="container-fluid">
						<div className="wrapper-div">
						<div className="navbar-header">
							<button type="button " className="btn btn-default navbar-btn btnnav glyphicon glyphicon-arrow-left" onClick={()=>this.navigate("PREV")}/>
							<button type="button" className="btn btn-default navbar-btn btnnav glyphicon glyphicon-arrow-right" onClick={()=>this.navigate("NEXT")}/>
						</div>

						<ul className="nav navbar-nav">
							<button type="button" className="btn btnnav btn-default btnnav navbar-btn m8"> Employee view</button>
						</ul>
							<div className="maintitle">{month}</div>
						<ul className="nav navbar-nav navbar-right">
							<li><button type="button" className="btn btn-default btnnav navbar-btn m8 "> <strong>Today</strong></button></li>
							<li><button type="button" className="btn btn-default btnnav navbar-btn m8 " onClick={()=>this.view("day")}> <strong>DAY</strong></button></li>
							<li><button type="button" className="btn btn-default btnnav navbar-btn m8 " onClick={()=>this.view("week")}><strong>WEEK</strong></button></li>
						</ul>
						</div>
					</div>
				</nav>
			</div>
		);
	}
}