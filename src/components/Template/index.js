import React, {Component} from "react";
import moment from "moment";
import BigCalendar from "react-big-calendar";
import {NavLink} from "react-router-dom";
import "react-big-calendar/lib/css/react-big-calendar.css";
import Toolbar from "react-big-calendar/lib/Toolbar";
import {Button, Input} from "semantic-ui-react";
import Modal from '../helpers/Modal';
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
      selectedTemplateId: "",
      date: moment()
    });
    this.handleSelectTemplate = this.handleSelectTemplate.bind(this);
  }
  handleSelectTemplate = (e) => {
    this.setState({selectedTemplateId: e.target.value})
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
                               views={{today: true, week: (props) => <ShiftWeekTable {...props} id = {this.state.selectedTemplateId}/>, day: true}}
                               components={{
                                   event: Event,
                                   toolbar: (props) => <CustomToolbar {...props}
                                                        selectedTemplateId = {this.state.selectedTemplateId}
                                                        handleSelectTemplate = {this.handleSelectTemplate}/>
                               }}
                  />
              </div>
          </div>
      );
  }
}

class CustomToolbarComponent extends Toolbar {
  constructor(props){
    super(props);
    this.state=({
      editNamePopped: false,
      newName: ""
    });
    this.editName = this.editName.bind(this);
  }
  editName() {
    this.props.mutate({
     variables: {id: this.props.selectedTemplateId, templateName: this.state.newName },
     optimisticResponse: {
       __typename: 'Mutation',
       updateTemplateById: {
         template: {
           id: this.props.selectedTemplateId,
           templateName: this.state.newName,
           __typename: 'Template'
         },
         __typename:"UpdateTemplatePayload"
       }
     }
   }).then(this.setState({editNamePopped: false}));
  }
  render() {
      if (this.props.data.loading) {
          return (<div>Loading</div>)
      }
      if (this.props.data.error) {
          console.log(this.props.data.error)
          return (<div>An unexpected error occurred</div>)
      }
      let month = moment(this.props.date).format("MMMM YYYY");
      let editNameAction =[{type:"white",title:"Cancel",handleClick:() => this.setState({editNamePopped: false}),image:false},
                           {type:"blue",title:"Rename Template",handleClick:this.editName,image:false}];
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
                                      <select className="dropdown" value={this.props.selectedTemplateId} onChange={this.props.handleSelectTemplate}>
                                        <option value={""} key={0}> Select a Template </option>
                                      { this.props.data.allTemplates.edges.map((value,index) =>
                                          <option value={ value.node.id } key={index + 1}> { value.node.templateName }</option>
                                          )
                                      }
                                      </select>
                                  </li>
                              </ul>
                          </div>
                          <ul className="nav navbar-nav navbar-right">
                              <li>
                                  <button type="button" onClick={() => this.setState({editNamePopped: true})}
                                          className="btn btn-default btnnav navbar-btn m8 "><strong>Edit name</strong>
                                  </button>
                                  <Modal
                                    title="Confirm"
                                    isOpen={this.state.editNamePopped && this.props.selectedTemplateId != ""}
                                    message="Enter a new name for this template:"
                                    action={editNameAction}
                                    closeAction={() => this.setState({editNamePopped: false})}>
                                    <Input fluid type="text" placeholder="New Name" style={{marginLeft: 20, marginRight: 20}}
                                                 onChange = {(e) => this.setState({newName: e.target.value})}/>
                                  </Modal>
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

const editTemplateNameMutation = gql`
  mutation ($id: Uuid!,  $templateName: String!){
    updateTemplateById (input: {id: $id, templatePatch: {templateName:$templateName}}){
      template{
        id
        templateName
      }
    }
  }`


const CustomToolbar = graphql(allTemplates)(graphql(editTemplateNameMutation)(CustomToolbarComponent));
