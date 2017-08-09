import React, { Component } from 'react';
import moment from 'moment';
import BigCalendar from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import Toolbar from 'react-big-calendar/lib/Toolbar';
import ShiftWeekTable from './ShiftWeekTable';
import './style.css';
import {Modal} from 'semantic-ui-react';
import ShiftPublish from './ShiftWeekTable/ShiftPublish';
import 'fullcalendar/dist/fullcalendar.min.css';
import 'fullcalendar/dist/fullcalendar.min.js';
import 'fullcalendar-scheduler/dist/scheduler.css';
import 'fullcalendar-scheduler/dist/scheduler.js';
import { gql, graphql, compose } from 'react-apollo';
import ApolloClient from 'apollo-client';

const style = {
  titleStyle: {
    paddingLeft: '0',
    paddingRight: '0',
    borderBottom: '1px solid #F5F5F5'
  },
  actionsContainerStyle: {
    textAlign: 'center',
    padding: '0'
  },
  contentStyle: {
    width: 600,
    height: 333,
    borderRadius: 6
  }
};
let that;
let viewName="Employee View";
let currentView = "job";
class ScheduleComponent extends Component {
    constructor(props){
        super(props);
        this.state = {
            publishModalPopped: false,
			      addTemplateModalOpen: false,
			      templateName:"",
            redirect:false,
            view:"job",
            date: moment()
        }
    }
  onNavigate = (start) => {
    this.setState({date: start})
  };
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
  componentWillMount = () => {
    if(this.props.location && this.props.location.viewName){
      if(this.props.location.viewName == "job"){
        viewName="Employee View";
        currentView="job";
        this.setState({view:"job"});
      }
      else{
        viewName="Job View";
        currentView="employee";
        this.setState({view:"employee"});
      }
    }
    that = this
  };
  render() {
    console.log(this.props)
    console.log("this.props.client")
    console.log(this.props.client)
    BigCalendar.momentLocalizer(moment);
    if (this.props.data.loading) {
      return (<div>Loading</div>)
    }

    if (this.props.data.error) {
      console.log(this.props.data.error);
      return (<div>An unexpected error occurred</div>)
    }
    let events= [];
    let is_publish = "none";
    let publish_id = "66666666-12c4-11e1-840d-7b25c5ee7756";
    const date = this.state.date;
    this.props.data.allWeekPublisheds.nodes.forEach(function (value) {
      if ((moment(date).isAfter(moment(value.start)) && moment(date).isBefore(moment(value.end)))
        || (moment(date).isSame(moment(value.start), 'day'))
        || (moment(date).isSame(moment(value.end), 'day'))
      ) {
        is_publish = value.published;
        publish_id = value.id;
      }
    });
    events.publish_id = publish_id;
    events.workplaceId = this.props.route.workplaceId;
    let publishModalOptions = [{type: "white", title: "Go Back", handleClick: this.goBack, image: false},
      {type: "blue", title: "Confirm", handleClick: this.onConfirm, image: false}];

    return (
      <div>
        <div style={{height: '160px'}}><ShiftPublish date={this.state.date} isPublish={ is_publish } publishId={publish_id} view={this.state.view}/></div>
        <Modal title="Confirm" isOpen={this.state.publishModalPopped}
               message="Are you sure that you want to delete this shift?"
               action={publishModalOptions} closeAction={this.modalClose}/>
        <div>
          <BigCalendar events={events}
                       culture='en-us'
                       startAccessor='startDate'
                       endAccessor='endDate'
                       defaultView='week'
                       views={{today: true, week: ShiftWeekTable, day: true}}
                       eventPropGetter={this.onViewChange}
                       onNavigate={(start) => this.onNavigate(start)}
                       components={{
                         event: this.customEvent,
                         toolbar:CustomToolbar
                       }}
          />
        </div>
      </div>
    );
  }
}
class CustomToolbar extends Toolbar {
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
                <button type="button" className="btn btn-default btnnav navbar-btn m8 " style={{width:150}} onClick={() => that.customEvent(currentView)}>{viewName}</button>
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

const allWeekPublisheds = gql
  `query allWeekPublisheds($brandid: Uuid!){ 
        allWeekPublisheds(condition: { brandId: $brandid }){
            nodes{
            id
            published
            start
            end
        }
    }
}`

const Schedule = graphql(allWeekPublisheds, {
  options: (ownProps) => ({
    variables: {
      brandid:localStorage.getItem('brandId') ,
    }
  }),
})(ScheduleComponent);

export default Schedule
