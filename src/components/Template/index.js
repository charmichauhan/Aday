import React, {Component} from "react";
import moment from "moment";
import BigCalendar from "react-big-calendar";
import {NavLink} from "react-router-dom";
import "react-big-calendar/lib/css/react-big-calendar.css";
import Toolbar from "react-big-calendar/lib/Toolbar";
import {Button} from "semantic-ui-react";
import ShiftWeekTable from "./ShiftWeekTable";
import "../Scheduling/style.css";
import { gql, graphql } from 'react-apollo';

let templateName;
let that;
let viewName="Employee View";
let currentView = "job";
export default class Template extends Component {
  constructor(props){
    super(props);
    this.state=({
      view:props.location.viewName,
      date: moment()
    });
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
        let is_publish = true;
        templateName = this.props.location.templateName;
        BigCalendar.momentLocalizer(moment);
        return (
            <div className="App row">
                <div className="col-md-12">
                    <div className="col-sm-offset-3 col-sm-5 rectangle">
                        <p className="col-sm-offset-2">TEMPLATE PREVIEW</p>
                    </div>
                </div>
                <div>
                    <BigCalendar events={[]}
                                 culture='en-us'
                                 startAccessor='startDate'
                                 endAccessor='endDate'
                                 defaultView='week'
                                 onNavigate={(start) => this.onNavigate(start)}
                                 eventPropGetter={this.onViewChange}
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

class CustomToolbarComponent extends Toolbar {
    render() {
        if (this.props.data.loading) {
            return (<div>Loading</div>)
        }

        if (this.props.data.error) {
            console.log(this.props.data.error)
            return (<div>An unexpected error occurred</div>)
        }
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
                            <div className="dropdown_select">
                                <ul className="nav navbar-nav dropdown_job">
                                    <li className="dropdownweeky">
                                        <select className="dropdown">
                                        { this.props.data.allTemplates.edges.map((value,index) =>
                                            <option value={ index } key={index}> { value.node.templateName }</option>
                                            )
                                        }
                                        </select>
                                    </li>
                                </ul>
                            </div>
                            <ul className="nav navbar-nav navbar-right">
                                <li>
                                    <button type="button" className="btn btn-default btnnav navbar-btn m8 "><strong>Edit
                                        name</strong>
                                    </button>
                                </li>
                                <li>
                                    <button type="button "
                                            className="btn btn-default navbar-btn btnnav nav-next glyphicon glyphicon-arrow-left"
                                            onClick={() => this.navigate("PREV")}/>
                                </li>
                                <li>
                                    <button type="button"
                                            className="btn btn-default navbar-btn btnnav nav-prv glyphicon glyphicon-arrow-right"
                                            onClick={() => this.navigate("NEXT")}/>
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>
            </div>
        );
    }
}

const allTemplates = gql`
  query allTemplates {
    allTemplates {
        edges{
            node{
              id
              templateName
            }
        }
    }
}`

const CustomToolbar  = graphql(allTemplates)(CustomToolbarComponent);
