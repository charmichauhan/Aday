import React, {Component} from "react";
import moment from "moment";
import BigCalendar from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import Toolbar from "react-big-calendar/lib/Toolbar";
import ShiftWeekTable from "./ShiftWeekTable";
import "./style.css";
import {Modal} from "semantic-ui-react";
import ShiftPublish from "./ShiftWeekTable/ShiftPublish";
import "fullcalendar/dist/fullcalendar.min.css";
import "fullcalendar/dist/fullcalendar.min.js";
import "fullcalendar-scheduler/dist/scheduler.css";
import "fullcalendar-scheduler/dist/scheduler.js";
import {gql, graphql} from "react-apollo";
import {CSVLink} from "react-csv";
import {groupBy} from "lodash";

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
        }
    }

  onNavigate = (start) => {
    this.setState({date: start, dataReceived: false })

  };

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

  onViewChange = () =>{
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
    that = this
  };



  getCSVData = (csvData) => {

    let displayCsvData = [];
    displayCsvData.push({
      firstName:'',
      lastName:'',
      Sunday:'',
      Monday:'',
      Tuesday:'',
      Wednesday:'',
      Thursday:'',
      Friday:'',
      Saturday:''
  });

    //Riya
    // let sortedData = csvData.map((data) => ({ ...data, userId: data.userId }));
    // let groupedData = groupBy(sortedData, 'userId');
    // Object.values(groupedData).map((user) => {
    //   var obj = {
    //     firstName: user[0].firstName,
    //     lastName: user[0].lastName,
    //   };
    //
    //   user.map((shift) => {
    //     const weekday = shift.weekday;
    //     obj[weekday] = moment(shift.startTime).format('h:mm A') + ' to ' + moment(shift.endTime).format('h:mm A');
    //   })
    //   displayCsvData.push(obj);
    // })
    // console.log('displayCsvData',displayCsvData);

    csvData.forEach((value) => {
      const weekday = value.weekday;

      var obj ={};

      let foundWorker = findIndex(displayCsvData, (displayCsvData) => displayCsvData.userId === value.id);

      if(foundWorker){
        displayCsvData[foundWorker][weekday] = moment(value.startTime).format('h:mm A') + ' to ' + moment(value.endTime).format('h:mm A');

      }else {
        obj =
          {
            userId: value.id,
            firstName: value.firstName,
            lastName: value.lastName,
          };

        obj[weekday] = moment(value.startTime).format('h:mm A') + ' to ' + moment(value.endTime).format('h:mm A');
        displayCsvData.push(obj);
      }
    });
    this.setState({ csvData: displayCsvData, dataReceived: true });
  };

  render() {
    BigCalendar.momentLocalizer(moment);

    if (this.props.data.loading) {
      return (<div><Halogen.SyncLoader color='#00A863'/></div>)
    }

    if (this.props.data.error) {
      console.log(this.props.data.error);
      return (<div>An unexpected error occurred</div>)
    }

    csvData = this.state.csvData;
    let events= [];
    let is_publish = "none";
    let publish_id = "";
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
    let publishModalOptions = [{type: "white", title: "Go Back", handleClick: this.goBack, image: false},
      {type: "blue", title: "Confirm", handleClick: this.onConfirm, image: false}];

    return (
        <div style={{maxWidth: '1750px'}}>
            <div style={{height: '160px'}}>
              <ShiftPublish date={this.state.date} isPublish={ is_publish } publishId={ publish_id } view={this.state.view}/>
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
                   setCSVData={this.getCSVData}
                   dataReceived={this.state.dataReceived}
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
            <div className="wrapper-div" style={{paddingTop:'5px'}}>
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
                {
                  csvData && <CSVLink data={csvData}>Download CSV</CSVLink>
                }
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
        </nav>
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
      brandid:localStorage.getItem('brandId')
    }
  }),
})(ScheduleComponent);

export default Schedule

var data = [{
  "id": "1",
  "firstName": "testManager",
  "lastName": "testMAnager",
  "Thursday": "12:02 AM to 9:10 PM"
}, {
  "id": "1",
  "firstName": "testManager",
  "lastName": "testMAnager",
  "Friday": "12:02 AM to 9:10 PM"
}, {
  "id": "2",
  "firstName": "Donald",
  "lastName": "Trump",
  "Friday": "12:02 AM to 9:10 PM"
}, {
  "id": "2",
  "firstName": "Donald",
  "lastName": "Trump",
  "Saturday": "10:02 AM to 5:10 PM"
}];
