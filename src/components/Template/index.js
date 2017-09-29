import React, {Component} from "react";
import moment from "moment";
import BigCalendar from "react-big-calendar";
import {NavLink} from "react-router-dom";
import "react-big-calendar/lib/css/react-big-calendar.css";
import Week from 'react-big-calendar/lib/Week';
import dates from 'react-big-calendar/lib/utils/dates';
import Toolbar from "react-big-calendar/lib/Toolbar";
import {Button, Input} from "semantic-ui-react";
import Modal from '../helpers/Modal';
import ShiftWeekTable from "./ShiftWeekTable";
import "../Scheduling/style.css";
import { gql, graphql, compose } from 'react-apollo';
var Halogen = require('halogen');
import CreateShiftButton from '../Scheduling/AddShift/CreateShiftButton';
import EditShiftDetailsDrawer from './ShiftWeekTable/ShiftEdit/EditShiftDrawer';

let templateName;
let that;
let viewName="Employee View";
let currentView = "job";

export default class Template extends Component {

  constructor(props){
    super(props);
    this.state=({
      view:props.location.viewName,
      selectedTemplateId: "",
      date: moment(),
      isCreateShiftModalOpen: false,
      isCreateShiftOpen: false,
    });
    this.handleSelectTemplate = this.handleSelectTemplate.bind(this);
    this.handleResetTemplate = this.handleResetTemplate.bind(this);
  }

  handleSelectTemplate = (e) => {
    this.setState({selectedTemplateId: e.target.value})
  }
  handleResetTemplate = () => {
    this.setState({selectedTemplateId: ""})
  }
  customEvent  = (currentlyView) => {
    if(currentlyView == "job"){
      viewName="Job View";
      currentView="employee";
      this.setState({view:currentView});
    }else{
      viewName="Employee View";
      currentView="job";
      this.setState({view:currentView});
    }
  };

  onViewChange = () =>{
    return this.state.view;
  };

  onNavigate = (start) => {
    this.setState({date: start})
  };

  openCreateShiftModal = () => {
    this.setState({ isCreateShiftModalOpen: true });
  };

  openShiftDrawer = () => {
    this.setState({ isCreateShiftOpen: true, isCreateShiftModalOpen: false });
  };

  closeDrawerAndModal = () => {
    this.setState({ isCreateShiftOpen: false, isCreateShiftModalOpen: false });
  };


  componentWillMount = () => {
    that = this;
    if(this.state.view == "job"){
      viewName="Employee View";
      currentView="job";
    }else{
      viewName="Job View";
      currentView="employee";
    }
  };

    render() {
      BigCalendar.momentLocalizer(moment);
      const date = this.state.date;
      return (
          <div className="App row">
              <div className="col-md-12">
                  <div className="col-sm-offset-3 col-sm-5 rectangle">
                      <p className="col-sm-offset-2">Recurring Shifts</p>
                  </div>
              </div>

                <div className="btn-action">
                      <div>
                        { localStorage.getItem("workplaceId") && <Button className="btn-image">
                          <CreateShiftButton
                            open={this.state.isCreateShiftModalOpen}
                            onButtonClick={this.openCreateShiftModal}
                            onCreateShift={this.openShiftDrawer}
                            onModalClose={this.closeDrawerAndModal}
                            weekStart={moment().startOf('week') } />
                        </Button>
                        }
                      </div>
                </div>
              <div>
                  <BigCalendar events={[]}
                               culture='en-us'
                               startAccessor='startDate'
                               endAccessor='endDate'
                               defaultView='week'
                               onNavigate={(date) => this.onNavigate(date)}
                               eventPropGetter={this.onViewChange}
                               views={{today: true, week: ShiftWeekTable, day: true}}
                               components={{
                                   event: Event,
                                   toolbar: (props) => <CustomToolbar {...props}
                                                        selectedTemplateId = {this.state.selectedTemplateId}
                                                        handleSelectTemplate = {this.handleSelectTemplate}/>
                               }}
                  />
              </div>

              <EditShiftDetailsDrawer
                    width={800}
                    open={this.state.isCreateShiftOpen}
                    shift={this.state}
                    weekStart={moment().format()}
                    handleSubmit={this.handleCreateSubmit}
                    closeDrawer={this.closeDrawerAndModal}
                    edit={false}
                  />
          </div>


      );
  }
}


class CustomToolbar extends Toolbar {
  render() {
      let { date } = this.props
      let month = moment(this.props.date).format("MMMM YYYY");
      return (
          <div>
              <nav className="navbar weeklynavbar weekly_nav_height">
                  <div className="container-fluid">
                      <div className="wrapper-div text-center">
                          <ul className="nav navbar-nav dropdown_job m8">
                              <li>
                                <button type="button" className="btn btn-default btnnav navbar-btn m8 " style={{width:150}} onClick={() => that.customEvent(currentView)}>{viewName}</button>
                              </li>
                          </ul>
                        
                          <ul className="nav navbar-nav navbar-right">
                          </ul>
                      </div>
                  </div>
              </nav>
          </div>
        );
    }
}







