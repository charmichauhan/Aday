import React, { Component } from 'react';
import moment from 'moment';
import BigCalendar from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import Toolbar from 'react-big-calendar/lib/Toolbar';
import AddHours from '../../../public/assets/Buttons/add-hours.png';
import AddAsTemplate from '../../../public/assets/Buttons/add-as-template.png';
import TemplateList from '../../../public/assets/Buttons/template-list-button.png';
import Automate from '../../../public/assets/Buttons/automate-schedule.png';
import Published from '../../../public/assets/Icons/published.png';
import Unpublished from '../../../public/assets/Icons/unpublished.png';
import Publish from '../../../public/assets/Buttons/publish.png';
import ShiftWeekTable from './ShiftWeekTable';
import ShiftPublish from './ShiftWeekTable/ShiftPublish';
import '../Scheduling/style.css';

export default class EmployeeView extends Component {
    render() {
        let is_publish = true;
        BigCalendar.momentLocalizer(moment);
        return (
			<div className="App row">
				<ShiftPublish ispublish={is_publish}/>
				<div>
					<img className="btn-image" src={AddHours} alt="Create Shift"/>
                    {!is_publish?<img className="btn-image flr" src={Publish} alt="Publish"/>:<span></span>}
                    {!is_publish?<img className="btn-image flr" src={Automate} alt="Automate"/>:<span></span>}
					<img className="btn-image flr" src={AddAsTemplate} alt="Add As Template"/>
                    {!is_publish?<img className="btn-image flr" src={TemplateList} alt="Template List"/>:<span></span>}
				</div>
				<div>
					<BigCalendar events={[]}
								 culture='en-us'
								 startAccessor='startDate'
								 endAccessor='endDate'
								 defaultView='week'
								 views={{today: true, week: ShiftWeekTable, day: true}}
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
    jobView = () => {
        window.location = '/schedule/team';
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
								<button className="btn btnnav btn-default btnnav navbar-btn m8"
										onClick={() => this.jobView()}> Job view
								</button>
							</ul>
							<div className="maintitle">{month}</div>
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