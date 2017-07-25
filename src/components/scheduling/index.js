import React, { Component } from 'react';
import moment from 'moment';
import BigCalendar from 'react-big-calendar';
import { NavLink } from 'react-router-dom'
import { Button } from 'semantic-ui-react';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import Toolbar from 'react-big-calendar/lib/Toolbar';
import {BrowserRouter as Router,Redirect} from 'react-router-dom';
import Modal from '../helpers/Modal';
import AddAsTemplateModal from '../helpers/AddAsTemplateModal';
import AddHours from '../../../public/assets/Buttons/add-hours.png';
import AddAsTemplate from '../../../public/assets/Buttons/add-as-template.png';
import TemplateList from '../../../public/assets/Buttons/template-list-button.png';
import Automate from '../../../public/assets/Buttons/automate-schedule.png';
import Publish from '../../../public/assets/Buttons/publish.png';
import ShiftWeekTable from './ShiftWeekTable';
import './style.css';
import ShiftPublish from './ShiftWeekTable/ShiftPublish';

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
    modalClose = () => {
        this.setState({
            publishModalPopped:false
        })
    };
    goBack = () => {
        this.setState({
            publishModalPopped:false
        });
    };
    addTemplateclose = () => {
        this.setState({
            addTemplateModalOpen:false
        });
    };
    addTemplateName = () => {
        let that = this;
        that.setState({redirect:true});
    };
    addTemplateModalOpen = () => {
        this.setState({addTemplateModalOpen:true})
    };
    onConfirm = () => {

    };
    onPublish = () => {
        this.setState({publishModalPopped:true})
    };
    handleChange = (e) => {
    	this.setState({templateName:e});
	};
    render() {
        let is_publish = true;
        BigCalendar.momentLocalizer(moment);
        let publishModalOptions =[{type:"white",title:"Go Back",handleClick:this.goBack,image:false},
            {type:"blue",title:"Confirm",handleClick:this.onConfirm,image:false}];
        if(this.state.redirect){
            return (
                    <Redirect to={{pathname:'/schedule/team/template' ,templateName:this.state.templateName}}/>
            )
        }
        return (
			<div className="App row">
				<ShiftPublish ispublish={is_publish}/>
                {this.state.publishModalPopped && <Modal title="Confirm" isOpen={this.state.publishModalPopped}
													  message = "Are you sure that you want to delete this shift?"
													  action = {publishModalOptions} closeAction={this.modalClose}/>
				}
				{this.state.addTemplateModalOpen && <AddAsTemplateModal addTemplateModalOpen={true}
																		handleClose={this.addTemplateclose}
																		addTemplate={this.addTemplateName}
																		handleChange={(e) =>this.handleChange(e)} />
				}
				<div className="btn-action">
					<Button className="btn-image" as={NavLink} to="/schedule/template"><img className="btn-image" src={AddHours} alt="Create Shift"/></Button>
					<Button className="btn-image flr" onClick={this.onPublish}><img className="btn-image flr" src={Publish} alt="Publish"/></Button>
                    {!is_publish && <Button className="btn-image flr" as={NavLink} to="/schedule/template"><img className="btn-image flr" src={Automate} alt="Automate"/></Button>}
					<Button className="btn-image flr" onClick={this.addTemplateModalOpen}><img className="btn-image flr" src={AddAsTemplate} alt="Add As Template"/></Button>
                    {!is_publish && <Button className="btn-image flr" as={NavLink} to="/schedule/template"><img className="btn-image flr" src={TemplateList} alt="Template List"/></Button>}
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
									<Button className="" as={NavLink} to="/schedule/employeeview" >Employee view</Button>
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