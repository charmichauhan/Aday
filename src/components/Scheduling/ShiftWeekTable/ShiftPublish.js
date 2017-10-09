import React, { Component } from 'react';
import { graphql, compose, withApollo } from 'react-apollo';
import moment from 'moment'
import { Button } from 'semantic-ui-react';
import { BrowserRouter as Router, Redirect } from 'react-router-dom';
import dates from 'react-big-calendar/lib/utils/dates';
import localizer from 'react-big-calendar/lib/localizer';
import uuidv4 from 'uuid/v4';
import cloneDeep from 'lodash/cloneDeep';

import CreateShiftButton from '../../Scheduling/AddShift/CreateShiftButton';
import CreateShiftDrawer from '../../Scheduling/AddShift/CreateShift/CreateShiftDrawer';
import CreateShiftAdvanceDrawer from '../../Scheduling/AddShift/CreateShift/CreateShiftAdvanceDrawer';
import Modal from '../../helpers/Modal';
import AddAsTemplateModal from '../../helpers/AddAsTemplateModal';
import dataHelper from '../../helpers/common/dataHelper';
import {
  updateWeekPublishedNameMutation,
  createWeekPublishedMutation,
  createShiftMutation,
  createWorkplacePublishedMutation,
  updateWorkplacePublishedIdMutation,
  findRecurring,
  createRecurring,
  createRecurringShift
} from './ShiftPublish.graphql';
import Notifier, { NOTIFICATION_LEVELS } from '../../helpers/Notifier';
var rp = require('request-promise');

import '../../Scheduling/style.css';
import './shiftSection.css';

const styles = {
  drawer: {
    width: 730
  }
};

class ShiftPublishComponent extends Component {

  constructor(props) {
    super(props);
    this.state = {
      publishModalPopped: false,
      addTemplateModalOpen: false,
      templateName: '',
      workplaceId: localStorage.getItem('workplaceId'),
      redirect: false,
      isCreateShiftModalOpen: false,
      isCreateShiftOpen: false,
      drawerShift: { advance: { allowShadowing: true } }
    }
  }

  componentDidMount() {
    this.getUsers();
    this.getManagers();
  }

  modalClose = () => {
    this.setState({
      workplaceId: localStorage.getItem('workplaceId'),
      publishModalPopped: false
    })
  };

  getUsers = () => {
    dataHelper.getUsers()
      .then(users => this.setState({ users }))
      .catch(err => console.error(err));
  };

  getManagers = () => {
    dataHelper.getAllManagers()
      .then(managers => this.setState({ managers }))
      .catch(err => console.error(err));
  };

  goBack = () => {
    this.setState({
      publishModalPopped: false
    });
  };

  viewRecurring = () => {
     this.setState({ redirect: true })
  };


  automateSchedule = (publishId) => {
    console.log(publishId)
    var uri = 'https://20170808t142850-dot-forward-chess-157313.appspot.com/api/algorithm/'
    var options = {
      uri: uri,
      method: 'POST',
      json: { 'data': { 'week_id': publishId, 'sec': 'QDVPZJk54364gwnviz921' } }
    };

    rp(options)
      .then(function ($) {
        window.location.reload();
        // Process html like you would with jQuery...
      })
      .catch(function (err) {
        // Crawling failed or Cheerio choked...
      });
    /*
     request(options, function (error, response, body) {
     if (!error && response.statusCode == 200) {
     }
     });
     */
  };

  addTemplateModalOpen = () => {
    this.setState({ addTemplateModalOpen: true })
  };

  onConfirm = () => {

  };

  onPublish = () => {
    this.setState({ publishModalPopped: true })
  };

  handleNameChange = (e) => {
    this.setState({ templateName: e });
  };

  handleWorkplaceChange = (e) => {
    this.setState({ workplaceId: e });
  };

  publishWeek = () => {
    const { date } = this.props;
    if (localStorage.getItem('workplaceId') != "") {
      this.props.createWorkplacePublishedMutation({
        variables: {
          workplacePublished: {
            id: uuidv4(),
            workplaceId: localStorage.getItem('workplaceId'),
            weekPublishedId: this.props.publishId,
            published: true
          }
        },
        updateQueries: {
          allWeekPublisheds: (previousQueryResult, { mutationResult }) => {
            let workplacePublished = mutationResult.data.createWorkplacePublished.workplacePublished;

            previousQueryResult.allWeekPublisheds.nodes.forEach(function (value) {

              if ((moment(date).isAfter(moment(value.start)) && moment(date).isBefore(moment(value.end)))
                || (moment(date).isSame(moment(value.start), 'day'))
                || (moment(date).isSame(moment(value.end), 'day'))
              ){
                value.workplacePublishedsByWeekPublishedId.edges = [...value.workplacePublishedsByWeekPublishedId.edges, {node:workplacePublished, __typename: "WorkplacePublishedsEdge"}];
              }
            });
            return {
              allWeekPublisheds: previousQueryResult.allWeekPublisheds
            };
          },
        },
      }).then((res) => {
        console.log('Inside the data', res);
        this.modalClose();
      }).catch(err => console.log('An error occurred.', err));
    }else{
      this.props.updateWeekPublishedNameMutation({
        variables: { id: this.props.publishId, date: moment().format() }
      }).then((res)=>{
        this.modalClose();
      });
    }
  };

  openCreateShiftModal = () => {
    this.setState({ isCreateShiftModalOpen: true });
  };

  openShiftDrawer = () => {
    this.setState({ isCreateShiftOpen: true, isCreateShiftModalOpen: false });
  };

  showNotification = (message, type) => {
    this.setState({
      notify: true,
      notificationType: type,
      notificationMessage: message
    });
  };

  hideNotification = () => {
    this.setState({
      notify: false,
      notificationType: '',
      notificationMessage: ''
    });
  };

  handleCreateSubmit = (shift) => {
    let { publishId } = this.props;
    let days = Object.keys(shift.shiftDaysSelected);
    if (!publishId) {
      publishId = uuidv4();
      this.props.createWeekPublished({
        variables: {
          data: {
            weekPublished: {
              id: publishId,
              start: moment(days[0]).startOf('week').format(),
              end: moment(days[0]).endOf('week').format(),
              published: false, datePublished: moment().format(),
              brandId: shift.brandId
            }
          }
        },
        updateQueries: {
          allWeekPublisheds: (previousQueryResult, { mutationResult }) => {
            let weekPublishedHash = mutationResult.data.createWeekPublished.weekPublished;
            previousQueryResult.allWeekPublisheds.nodes = [...previousQueryResult.allWeekPublisheds.nodes, weekPublishedHash]
            return {
              allWeekPublisheds: previousQueryResult.allWeekPublisheds
            };
          },
        },
      }).then(({ data }) => {
        this.submitShifts({ days, shift, publishId });
      }).catch((error) => {
        console.log('there was an error sending the query', error);
        this.showNotification('An error occurred.', NOTIFICATION_LEVELS.ERROR)
      });

    }
    // else create all shifts with existing week published
    else {
      this.submitShifts({ days, shift, publishId });
    }
    this.setState({ isCreateShiftOpen: false, isCreateShiftModalOpen: false });
  };

  submitShifts = ({ days, shift, publishId }) => {
    let shiftRecure = shift;
    if(shift.recurringShift!=="none"){
      this.saveRecurringShift(shiftRecure, shift,(res)=>{
        shiftRecure.recurringShiftId = res;
        days.forEach((day) => {
          if (day !== 'undefined' && shift.shiftDaysSelected[day] === true) {
            this.saveShift(shiftRecure, day, publishId);
          }
        });
      });
    }
    else {
      days.forEach((day) => {
        if (day !== 'undefined' && shift.shiftDaysSelected[day] === true) {
          this.saveShift(shift, day, publishId);
        }
      });

    }
  };
  saveRecurringShift(days, shift,callback){
    this.props.client.query({
      query: findRecurring,
      variables: { brandId: localStorage.getItem('brandId'), workplaceId: localStorage.getItem('workplaceId')}
    }).then((res)=>{
      let recurring = uuidv4();
      if(res.data.allRecurrings.edges.length !== 0){
        return this.createRecurringShift(shift, res.data.allRecurrings.edges[0].node.id,days,callback);
      }else {
        const payload = {
          id: recurring,
          workplaceId: localStorage.getItem("workplaceId"),
          brandId: localStorage.getItem("brandId"),
          lastWeekApplied: moment().startOf('week').format()
        };
        this.props.createRecurring({
          variables: {
            data: {
              recurring: payload
            }
          }}).then((res)=>{
          console.log("createRecurring res",res);
          return this.createRecurringShift(shift, recurring,days,callback);
        });
      }
    });
  }
  createRecurringShift(shiftValue, recurringId,days,callback){
    const shift = cloneDeep(shiftValue);
    let id = uuidv4();

    const payload = {
      id,
      days,
      recurringId,
      positionId: shift.positionId,
      workerCount: shift.numberOfTeamMembers,
      creator: localStorage.getItem('userId'),
      startTime: moment(shift.startTime).format('HH:mm'),
      endTime: moment(shift.endTime).format('HH:mm'),
      instructions: shift.instructions,
      unpaidBreakTime: shift.unpaidBreak,
      expiration: shift.endDate,
      startDate: shift.startDate,
      isTraineeShift: false
    };
    this.props.createRecurringShift({
      variables: {
        data: {
          recurringShift: payload
        }
      }
    }).then(({data})=>{
      return callback(id);
    });
  }

  handleAdvanceToggle = (drawerShift) => {
    this.setState((state) => ({
      drawerShift,
      isCreateShiftOpen: !state.isCreateShiftOpen,
      isCreateShiftAdvanceOpen: !state.isCreateShiftAdvanceOpen
    }));
  };

  closeDrawerAndModal = () => {
    this.setState({ isCreateShiftOpen: false, isCreateShiftModalOpen: false });
  };

  saveShift(shiftValue, day, weekPublishedId) {
    const shift = cloneDeep(shiftValue);
    const shiftDay = moment.utc(day, 'MM-DD-YYYY');
    const shiftDate = shiftDay.date();
    const shiftMonth = shiftDay.month();
    const shiftYear = shiftDay.year();
    const recurringShiftId = shift.recurringShiftId;
    shift.startTime = moment.utc(shift.startTime).date(shiftDate).month(shiftMonth).year(shiftYear).second(0);
    shift.endTime = moment.utc(shift.endTime).date(shiftDate).month(shiftMonth).year(shiftYear).second(0);
    const payload = {
      id: uuidv4(),
      workplaceId: shift.workplaceId,
      positionId: shift.positionId,
      workersRequestedNum: shift.numberOfTeamMembers,
      creatorId: localStorage.getItem('userId'),
      managersOnShift: [null],
      startTime: moment.utc(shift.startTime),
      endTime: moment.utc(shift.endTime),
      shiftDateCreated: moment().format(),
      weekPublishedId: weekPublishedId,
      recurringShiftId: recurringShiftId ? recurringShiftId : null,
      instructions: shift.instructions,
      unpaidBreakTime: shift.unpaidBreak
    };
    if (shift.teamMembers && shift.teamMembers.length) {
      payload.workersAssigned = shift.teamMembers.map(({ id }) => id);
    }
    this.props.createShift({
      variables: {
        data: {
          shift: payload
        }
      },
      updateQueries: {
        allShiftsByWeeksPublished: (previousQueryResult, { mutationResult }) => {
          let shiftHash = mutationResult.data.createShift.shift;
          previousQueryResult.allShifts.edges =
            [...previousQueryResult.allShifts.edges, { 'node': shiftHash, '__typename': 'ShiftsEdge' }];
          return {
            allShifts: previousQueryResult.allShifts
          };
        },
      },
    }).then(({ data }) => {
      this.showNotification('Shift created successfully.', NOTIFICATION_LEVELS.SUCCESS);
      console.log('got data', data);
    }).catch(err => {
      console.log('There was error in saving shift', err);
      this.showNotification('An error occurred.', NOTIFICATION_LEVELS.ERROR)
    });
  }

  render() {
    let is_publish = this.props.isPublish;
    let publishId = this.props.publishId;
    let   message="";
    const startDate = this.props.date;
    const isPublished =  (is_publish == false && is_publish != 'none') ? (this.props.isWorkplacePublished === false ? true:false) : false;

    const { notify, notificationMessage, notificationType } = this.state;

    let status = '';
    let statusImg = '';
    if (isPublished) {
      status = 'UNPUBLISHED SCHEDULE';
      statusImg = '/assets/Icons/unpublished.png';
    }
    else if (!isPublished) {
      status = 'PUBLISHED SCHEDULE';
      statusImg = '/assets/Icons/published.png';
    }
    let publishModalOptions = [{ type: 'white', title: 'Go Back', handleClick: this.goBack, image: false },
      { type: 'blue', title: 'Confirm', handleClick: this.publishWeek, image: false }];
    if (this.state.redirect) {
      return (
        <Redirect to={{ pathname: '/schedule/recurring', viewName: this.props.view }} />
      )
    }

    if(this.state.publishModalPopped && localStorage.getItem('workplaceId') != ""){
      message="Are you sure that you want to publish the week's schedule for this workplace?"
    }else {
      message="Are you sure that you want to publish the week's schedule?"
    }
    let { date } = this.props;
    let { start } = ShiftPublish.range(date, this.props);

    return (
      <div className="shift-section">
        {this.state.publishModalPopped && <Modal title="Confirm" isOpen={this.state.publishModalPopped}
                                                 message={message}
                                                 action={publishModalOptions} closeAction={this.modalClose} />
        }

        <div className="col-md-12">
          <div className="col-sm-offset-3 col-sm-5 rectangle">
            { is_publish == 'none' ? 'NO SHIFTS FOR GIVEN WEEK' :
             <div>
                <img src={statusImg} />
                <p className="col-sm-offset-2">
                    {status}
                </p>
             </div> }
          </div>
        </div>
        <div className="btn-action">
          {moment(startDate).startOf('week').diff(moment().startOf('week'), 'days') > -7 ?
            <div>
              <Button className="btn-image">
                <CreateShiftButton
                  open={this.state.isCreateShiftModalOpen}
                  onButtonClick={this.openCreateShiftModal}
                  onCreateShift={this.openShiftDrawer}
                  onModalClose={this.closeDrawerAndModal}
                  weekPublishedId={publishId}
                  weekStart={start} />
              </Button>
              {isPublished &&
              <Button className="btn-image flr" onClick={this.onPublish}>
                <img className="btn-image flr" src="/assets/Buttons/publish.png" alt="Publish" />
              </Button>}
              {(is_publish != 'none') &&
              <Button className="btn-image flr" onClick={() => this.automateSchedule(publishId)}>
                <img className="btn-image flr" src="/assets/Buttons/automate-schedule.png" alt="Automate" />
              </Button>}
              {/*{(is_publish != "none") && <Button className="btn-image flr" as={NavLink} to="/schedule/recurring"><img className="btn-image flr" src="/assets/Buttons/automate-schedule.png" alt="Automate"/></Button>}*/}
              {is_publish != 'none' &&
                <Button basic style={{width:150, height: 44}} onClick={() => this.viewRecurring()}>View Repeating Shifts</Button>}
            </div> :
            <div>
              {is_publish != 'none' &&
              <Button basic style={{width:150, height: 44}} onClick={() => this.viewRecurring()}>View Repeating Shifts</Button>}
            </div>
          }

        </div>
        <CreateShiftDrawer
          width={styles.drawer.width}
          open={this.state.isCreateShiftOpen}
          shift={this.state.drawerShift}
          users={this.state.users}
          managers={this.state.managers}
          weekStart={start}
          handleSubmit={this.handleCreateSubmit}
          handleAdvance={this.handleAdvanceToggle}
          closeDrawer={this.closeDrawerAndModal} />
        <CreateShiftAdvanceDrawer
          width={styles.drawer.width}
          shift={this.state.drawerShift}
          open={this.state.isCreateShiftAdvanceOpen}
          handleBack={this.handleAdvanceToggle} />
        <Notifier hideNotification={this.hideNotification} notify={notify} notificationMessage={notificationMessage} notificationType={notificationType} />
      </div>
    )
  }
}

ShiftPublishComponent.range = (date, { culture }) => {
  let firstOfWeek = localizer.startOfWeek(culture);
  let start = dates.startOf(date, 'week', firstOfWeek);
  let end = dates.endOf(date, 'week', firstOfWeek);
  return { start, end };
};

const ShiftPublish = compose(
  graphql(updateWeekPublishedNameMutation,{
    name: 'updateWeekPublishedNameMutation'
  }),
  graphql(createShiftMutation, {
    name: 'createShift'
  }),
  graphql(createWeekPublishedMutation, {
    name: 'createWeekPublished'
  }),
  graphql(createWorkplacePublishedMutation, {
    name: 'createWorkplacePublishedMutation'
  }),
  graphql(updateWorkplacePublishedIdMutation, {
    name: 'updateWorkplacePublishedIdMutation'
  }),
  graphql(createRecurring, {
    name: 'createRecurring'
  }),
  graphql(createRecurringShift, {
    name: 'createRecurringShift'
  }))(ShiftPublishComponent);

export default withApollo(ShiftPublish);
