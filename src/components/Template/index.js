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

export default class Template extends Component {
    render() {
        let is_publish = true;
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
                            <ul className="nav navbar-nav dropdown_job">
                                <li>
                                    <Button className="template-view-job-btn" as={NavLink} to="/schedule/team">Job
                                        View</Button>
                                </li>
                            </ul>
                            <div className="dropdown_select">
                                <ul className="nav navbar-nav dropdown_job">
                                    <li className="dropdownweeky">
                                        <select className="dropdown">
                                        { this.props.data.allTemplates.edges.map((value,index) => 
                                            <option value={ index }> { value.node.templateName }</option>
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

const CustomToolbar  = graphql(allTemplates)(CustomToolbarComponent)
