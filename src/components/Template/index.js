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
import { createRecurringShift, createRecurringShiftAssignee, createRecurring } from "./ShiftWeekTable/ShiftEdit/EditRecurringShift.graphql"
import { gql, graphql, compose } from 'react-apollo';
var Halogen = require('halogen');
import CreateShiftButton from '../Scheduling/AddShift/CreateShiftButton';
import  EditShiftDrawerContainer from './ShiftWeekTable/ShiftEdit/recurringShiftDrawerContainer';
import cloneDeep from 'lodash/cloneDeep';
import { allRecurrings, allTemplateShifts } from './TemplateQueries';
const uuidv4 = require('uuid/v4');
var rp = require('request-promise');

let templateName;
let that;
let viewName="Employee View";
let currentView = "job";

class TemplateComponent extends Component {

  constructor(props){
    super(props);
    this.state=({
      view:props.location.viewName,
      selectedTemplateId: "",
      date: moment(),
      isCreateShiftModalOpen: false,
      isCreateShiftOpen: false,
      recurringId: null
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

  handleCreateSubmit = (shiftValue, recurringId) => {
    if(recurringId == null) {
        let recurring = uuidv4();
        const payload = {
         id: recurring, 
          workplaceId: localStorage.getItem("workplaceId"),
          brandId: localStorage.getItem("brandId"),
          lastWeekApplied: moment().add(7, "weeks").endOf('week').format()
        }
        this.props.createRecurring({
        variables: {
          data: {
            recurring: payload
          }
        },
        updateQueries: {
          allRecurrings: (previousQueryResult, { mutationResult }) => {
            const recurring = mutationResult.data.createRecurring.recurring
            previousQueryResult.allRecurrings.edges = [...previousQueryResult.allRecurrings.edges, {node: recurring, __typename: "RecurringsEdge"}];
            return {
              allRecurrings: previousQueryResult.allRecurrings
            };
          },
        },
      }).then(({ data }) => {
           this.createRecurringShift(shiftValue, recurring)
      })

    } else {
      this.createRecurringShift(shiftValue, recurringId)
    }         
  };


  createRecurringShift = (shiftValue, recurringId) => {
      const shift = cloneDeep(shiftValue);

      let id = uuidv4();
      const props = this.props;

      let days = []
      Object.keys(shift.shiftDaysSelected).map(function(day, i){
        if (shift.shiftDaysSelected[day] == true) {
            days.push(moment(day).format('dddd').toUpperCase())
        }
      })

      const payload = {
        id: id,
        positionId: shift.positionId,
        workerCount: shift.numberOfTeamMembers,
        creator: localStorage.getItem('userId'),
        startTime: moment(shift.startTime).format('HH:mm'),
        endTime: moment(shift.endTime).format('HH:mm'),
        instructions: shift.instructions,
        unpaidBreakTime: shift.unpaidBreak,
        expiration: shift.endDate || null,
        startDate: shift.startDate,
        days: days,
        recurringId: recurringId,
        isTraineeShift: false,
        expired: false
      };
      this.props.createRecurringShift({
        variables: {
          data: {
            recurringShift: payload
          }
        },
        updateQueries: {
          recurringById: (previousQueryResult, { mutationResult }) => {
            const recurringShift = mutationResult.data.createRecurringShift.recurringShift
            previousQueryResult.recurringById.recurringShiftsByRecurringId.edges = [...previousQueryResult.recurringById.recurringShiftsByRecurringId.edges, {node: recurringShift, __typename: "RecurringShiftsEdge"}];

            return {
              recurringById: previousQueryResult.recurringById
            };
          },
        },
      }).then(({ data }) => {

      if (shiftValue.teamMembers && shiftValue.teamMembers.length > 0){
          const memberCount = shiftValue.teamMembers.length -1
          shiftValue.teamMembers.map(function(member, i) {
            const assignee_payload = {
              recurringShiftId: id,
              userId: member.id
            }
            props.createRecurringShiftAssignee({
                 variables: {
                  data: {
                    recurringShiftAssignee: assignee_payload
                  }
                },
                updateQueries: {
                  recurringById: (previousQueryResult, { mutationResult }) => {
                    const recurringShiftAssignee = mutationResult.data.createRecurringShiftAssignee.recurringShiftAssignee
                    const recurringShift = recurringShiftAssignee.recurringShiftId
                    previousQueryResult.recurringById.recurringShiftsByRecurringId.edges.map(function(shift, i){
                      if (shift.node.id == recurringShift){
                                shift.node.recurringShiftAssigneesByRecurringShiftId.edges = [ ...shift.node.recurringShiftAssigneesByRecurringShiftId.edges, {node: recurringShiftAssignee, __typename: "RecurringShiftAssigneesEdge"}]
                      }
                    })
                    return {
                      recurringById: previousQueryResult.recurringById
                    };
                  }, 
                },

            }).then(({ data }) => {

              if (memberCount == i) {
                var uri = 'http://localhost:8080/api/newRecurring'
                  
                  var options = {
                    uri: uri,
                    method: 'POST',
                    json: {
                      "data": {
                      "sec": "QDVPZJk54364gwnviz921",
                      "recurringShiftId": id,
                      "startsOn": shift.startDate || moment().format()
                      }
                    }
                  };
                  rp(options)
                  .then(function(response) {
                    //that.setState({redirect:true})
                  }).catch((error) => {
                      console.log('there was an error sending the query', error);
                  });  
              } 
    
            }).catch(err => {
                console.log('There was error in saving recurring shift assignee', err);
              })
          })
        } else{

             var uri = 'http://localhost:8080/api/newRecurring'

                     var options = {
                        uri: uri,
                        method: 'POST',
                        json: {
                            "data": {
                              "sec": "QDVPZJk54364gwnviz921",
                              "recurringShiftId": id,
                              "startsOn": shift.startDate || moment().format(),
                              "workplaceId": localStorage.getItem("workplaceId")
                            }
                        }
                    };
                      rp(options)
                        .then(function(response) {
                               //that.setState({redirect:true})
                          }).catch((error) => {
                              console.log('there was an error sending the query', error);
                          });   

        }
      }).catch(err => {
        console.log('There was error in saving recurring shift', err);
      });
      this.setState({ isCreateShiftOpen: false, isCreateShiftModalOpen: false })
  }


    render() {
      console.log(this.props)
      if (this.props.recurrings.loading) {
          return (<div><Halogen.SyncLoader color='#00A863'/></div>)
      }

      let recurring = null;
      if (this.props.recurrings.allRecurrings.edges[0]){
        this.props.recurrings.allRecurrings.edges.map(function(shift, i){
            if (shift.node.workplaceId == localStorage.getItem('workplaceId')){
              recurring = shift.node.id
            };
        })
      }

      BigCalendar.momentLocalizer(moment);
      const date = this.state.date;
      return (
          <div className="App row">
              <div className="col-md-12">
                  <div className="col-sm-offset-3 col-sm-5 rectangle">
                      <p className="col-sm-offset-2">Repeating Shifts</p>
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
                            weekStart={moment().startOf('week') }
                            />
                        </Button>
                        }
                      </div>
                </div>
              <div>
                  <BigCalendar events={[recurring]}
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

              <EditShiftDrawerContainer
                    width={800}
                    open={this.state.isCreateShiftOpen}
                    shift={this.state}
                    weekStart={moment().format()}
                    handleSubmit={this.handleCreateSubmit}
                    closeDrawer={this.closeDrawerAndModal}
                    recurringId={ recurring }
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


const Template = compose(
  graphql(allRecurrings, {
    options: (ownProps) => ({
      variables: {
        brandId: localStorage.getItem('brandId'),
      },
    }),
    name: 'recurrings'
  }),
graphql(createRecurringShift, {
  name: 'createRecurringShift'
}),
graphql(createRecurringShiftAssignee, {
  name: 'createRecurringShiftAssignee'
}),
graphql(createRecurring, {
  name: 'createRecurring'
}),
)(TemplateComponent);

export default Template;






