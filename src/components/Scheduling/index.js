import React, { Component } from 'react';
import moment from 'moment';
import BigCalendar from 'react-big-calendar';
import { NavLink } from 'react-router-dom'
import { Button } from 'semantic-ui-react';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import Toolbar from 'react-big-calendar/lib/Toolbar';
import ShiftWeekTable from './ShiftWeekTable';
import './style.css';
import ShiftPublish from './ShiftWeekTable/ShiftPublish';
import 'fullcalendar/dist/fullcalendar.min.css';
import 'fullcalendar/dist/fullcalendar.min.js';
import 'fullcalendar-scheduler/dist/scheduler.css';
import 'fullcalendar-scheduler/dist/scheduler.js';

const style = {
    titleStyle:{
        paddingLeft: '0',
        paddingRight: '0',
        borderBottom:'1px solid #F5F5F5'
    },
    actionsContainerStyle:{
        textAlign:'center',
        padding:'0'
    },
    contentStyle:{
        width:600,
        height:333,
        borderRadius:6
    }
};

export default class Schedule extends Component {
    constructor(props){
        super(props);
        this.state = {
            publishModalPopped: false,
			addTemplateModalOpen: false,
			templateName:"",
            redirect:false
        }
    }

    onNavigate = (start) => {
        this.setState({date: start})
    };
    render() {
        let is_publish = true;
        BigCalendar.momentLocalizer(moment);

        return (
			<div className="App row">
				<ShiftPublish ispublish={is_publish}/>
				<div>
					<BigCalendar events={[]}
								 culture='en-us'
								 startAccessor='startDate'
								 endAccessor='endDate'
								 defaultView='week'
								 views={{today: true, week: ShiftWeekTable, day: true}}
                                 onNavigate={(start)=>this.onNavigate(start)}
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

class CustomToolbar extends Toolbar {
    employeeView = (e) => {
        window.location = '/schedule/team/employeeview';
    };
    render() {
        let month = moment(this.props.date).format("MMMM YYYY");
        return (
			<div>
				<nav className="navbar">
					<div className="container-fluid">
						<div className="wrapper-div">
								<div className="navbar-header">
									<button type="button "
											className="btn btn-default navbar-btn btnnav glyphicon glyphicon-arrow-left"
											onClick={() => this.navigate("PREV")}/>
									<button type="button"
											className="btn btn-default navbar-btn btnnav glyphicon glyphicon-arrow-right"
											onClick={() => this.navigate("NEXT")}/>
								</div>
								<ul className="nav navbar-nav">
									<Button className="" as={NavLink} to="/schedule/employeeview">Employee view</Button>
								</ul>
							<div className="maintitle">
								{month}
							</div>
								<ul className="nav navbar-nav navbar-right">
								<li>
									<button type="button" className="btn btn-default btnnav navbar-btn m8 "><strong>Today</strong>
									</button>
								</li>
								<li>
									<button type="button" className="btn btn-default btnnav navbar-btn m8 "
											onClick={() => this.view("day")}><strong>DAY</strong></button>
								</li>
								<li>
									<button type="button" className="btn btn-default btnnav navbar-btn m8 "
											onClick={() => this.view("week")}><strong>WEEK</strong></button>
								</li>
							</ul>
						</div>
					</div>
				</nav>
			</div>
        );
    }
}

