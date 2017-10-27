import React, {Component} from "react";
import moment from "moment";
import BigCalendar from "react-big-calendar";
import {gql, graphql, compose} from "react-apollo";
import {groupBy,findIndex, cloneDeep} from "lodash";
import {Modal} from "semantic-ui-react";
import Toolbar from "react-big-calendar/lib/Toolbar";
import ShiftWeekTable from "./ShiftWeekTable";

import "react-big-calendar/lib/css/react-big-calendar.css";
import "fullcalendar/dist/fullcalendar.min.css";
import "fullcalendar/dist/fullcalendar.min.js";
import "fullcalendar-scheduler/dist/scheduler.css";
import "fullcalendar-scheduler/dist/scheduler.js";
import "./style.css";

var Halogen = require('halogen');

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
  },
  calendarContainerWidth: {
    width: 1650,
  }
};

let that;
let viewName="Employee View";
let currentView = "job";
let csvData = "";
let calendar_offset = 5;

class ScheduleComponent extends Component {
    constructor(props){
        super(props);
        this.state = {
            publishModalPopped: false,
			addTemplateModalOpen: false,
			templateName:"",
            redirect:false,
            view:"job",
            date: moment(this.props.match.params.date) ||  moment(),
          dataReceived: true,
          isHoursReceived: true,
        }
    }
  /**
   *  the function that handles switching from employee to job view on the calendar
   * @param  {string} currentlyView - either "job" or "employee"
   * @return {view} sets the state of currentView, which switches calendar view
   */
  customEvent  = (currentlyView) => {
    console.log("On scheduling page");

    if(currentlyView == "job"){
      viewName="Job View";
      currentView="employee";
      this.setState({view:currentView});
    } else {
      viewName="Employee View";
      currentView="job";
      this.setState({view:currentView});
    }
  };

  navigateCalender = (nav) => {
    if(nav === "NEXT" ){
      this.setState({date: moment(this.state.date).add(7, "days"),isHoursReceived : true});
    }else{
      this.setState({date: moment(this.state.date).subtract(7, "days"),isHoursReceived : true});
    }
  };

  getHoursBooked = (getHoursObj) => {
    this.setState({ getHoursObj, isHoursReceived : false});
  };

  onViewChange = () => {
    return this.state.view;
  };

/**
 * [description]
 * @param {string} this.props.location.viewName - viewName labels the button that toggles job and employee calendars
 * @return {view} sets the state of currentView, which switches calendar view @see customEvent function
 */
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
    that = this;
  };

  componentWillReceiveProps = () => {
    this.setState({ isHoursReceived : true});
  };

  render() {
    BigCalendar.momentLocalizer(moment);

    if (this.props.data.loading || this.props.allWeekPublisheds.loading) {
      return (<div><Halogen.SyncLoader color='#00A863'/></div>);
    }

    if (this.props.data.error) {
      console.log(this.props.data.error);
      return (<div>An unexpected error occurred</div>)
    }

    csvData = this.state.csvData;
    let events= [];
    let is_publish = "none";
    let publish_id = "";
    // let calendar_offset = 5;
    /*
    if(this.props.data.brandById.displaySetting){
      calendar_offset =  calendar_offset = JSON.parse(this.props.data.brandById.displaySetting).calendarOffset;
    } */
    let isWorkplacePublished = false;
    let date = moment(this.state.date).add(calendar_offset, 'days');
    if (this.props.allWeekPublisheds.allWeekPublisheds){
      this.props.allWeekPublisheds.allWeekPublisheds.nodes.forEach(function (value) {
        if ((moment(date).isAfter(moment(value.start)) && moment(date).isBefore(moment(value.end)))
          || (moment(date).isSame(moment(value.start), 'day'))
          || (moment(date).isSame(moment(value.end), 'day'))
        ) {
          if(value.workplacePublishedsByWeekPublishedId.edges.length > 0){
            value.workplacePublishedsByWeekPublishedId.edges.map((value) => {
              if(value.node.workplaceId == localStorage.getItem("workplaceId")) {
                isWorkplacePublished = value.node.published;
              }
            });
          }
          is_publish = value.published || isWorkplacePublished;
          publish_id = value.id;
        }
      });
    }
    events.calendar_offset = calendar_offset;
    events.publish_id = publish_id;
    events.is_publish = is_publish;
    let publishModalOptions = [{type: "white", title: "Go Back", handleClick: this.goBack, image: false},
      {type: "blue", title: "Confirm", handleClick: this.onConfirm, image: false}];

    return (
        <div style={{maxWidth: '1750px'}}>
            <div style={{float: 'left',marginBottom: '10px', width: '100%'}}>

            </div>
            <Modal title="Confirm" isOpen={this.state.publishModalPopped}
                   message="Are you sure that you want to delete this shift?"
                   action={publishModalOptions} closeAction={this.modalClose}/>
            <div>
               <BigCalendar events={events}
                   culture='en-us'
                   startAccessor='startDate'
                   endAccessor='endDate'
                   defaultView='week'
                   date={this.state.date}
                   isWorkplacePublished={ isWorkplacePublished }
                   calendarOffset = { calendar_offset }
                   spview={ this.state.view }
                   dataReceived={this.state.dataReceived}
                   hoursBooked = {this.getHoursBooked}
                   isHoursReceived = {this.state.isHoursReceived}
                   views={{today: true, week: ShiftWeekTable, day: true}}
                   eventPropGetter={this.onViewChange}
                   onNavigate={(date) => { this.setState({ selectedDate: date })}}
                   customEvent={this.customEvent}
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
    // const { csvData } = this.state;
    let month = moment(this.props.date).format("MMMM YYYY");
    return (
      <div>
        {/*<ShiftPublish*/}
          {/*date={that.state.date}*/}
          {/*isWorkplacePublished={ that.isWorkplacePublished }*/}
          {/*isPublish={ that.is_publish }*/}
          {/*publishId={ that.publish_id }*/}
          {/*view={ that.state.view }*/}
          {/*excel = { that.csvDataDownload}*/}
          {/*navigateCalender = { that.navigateCalender }*/}
          {/*getHoursBooked = { that.state.getHoursObj }*/}
          {/*isHoursReceived = { that.state.isHoursReceived }*/}
          {/*calendarOffset = { calendar_offset } />*/}
        {/*<nav className="navbar">
          <div className="container-fluid">
            <div className="wrapper-div" style={{paddingTop:'5px'}}>
              <div className="navbar-header">
                <button type="button " className="btn btn-default navbar-btn btnnav glyphicon glyphicon-arrow-left" onClick={() => this.navigate("PREV")}/>
                <button type="button" className="btn btn-default navbar-btn btnnav glyphicon glyphicon-arrow-right" onClick={() => this.navigate("NEXT")}/>
              </div>
              <ul className="nav navbar-nav">
                <button type="button" className="btn btn-default btnnav navbar-btn m8 " style={{width:150}} onClick={() => that.csvDataDownload()}>Download CSV</button>
              </ul>
              <div className="maintitle">
       {month}
       </div>
       <ul className="nav navbar-nav navbar-right">
            <li>
                  <button type="button" className="btn btn-default btnnav navbar-btn m8 "
                          onClick={() => this.view("week")}><strong>WEEK</strong></button>
                </li>
              </ul>
            </div>
          </div>
        </nav>*/}
      </div>
    );
  }
}

/*

                  <li>
                  <button type="button" className="btn btn-default btnnav navbar-btn m8 "><strong>Today</strong>
                  </button>
                </li>
                <li>
                  <button type="button" className="btn btn-default btnnav navbar-btn m8 "
                          onClick={() => this.view("day")}><strong>DAY</strong></button>
                </li>

*/

const allWeekPublisheds = gql
  `query allWeekPublisheds($brandid: Uuid!){
        allWeekPublisheds(condition: { brandId: $brandid }){
            nodes {
              id
              published
              start
              end
              workplacePublishedsByWeekPublishedId
              {
                edges{
                  node{
                    workplaceId
                    published
                    id
                  }
                }
              }
            }
        }
  }`

  const brandDisplay = gql 
  `query brandById($brandid: Uuid!){
    brandById(id: $brandid){
      id
    }
  }`
///
const Schedule = compose(
 graphql(allWeekPublisheds, {
  options: (ownProps) => ({
    variables: {
      brandid:localStorage.getItem('brandId')
    }
  }),
  name: "allWeekPublisheds"
}),
  graphql(brandDisplay, {
  options: (ownProps) => ({
    variables: {
      brandid: localStorage.getItem('brandId')
    }
  }),
})
)(ScheduleComponent);

export default Schedule
