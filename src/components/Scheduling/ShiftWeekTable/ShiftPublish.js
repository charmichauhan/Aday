import React, { Component } from 'react';
import '../../Scheduling/style.css';
import { gql, graphql, compose } from 'react-apollo';
import moment from 'moment'
import CreateShiftButton from '../../Scheduling/AddShift/CreateShiftButton';
import { Button } from 'semantic-ui-react';
import { NavLink } from 'react-router-dom'
import {BrowserRouter as Router,Redirect} from 'react-router-dom';
import Modal from '../../helpers/Modal';
import AddAsTemplateModal from '../../helpers/AddAsTemplateModal';
import dates from 'react-big-calendar/lib/utils/dates';
import localizer from 'react-big-calendar/lib/localizer';
var rp = require('request-promise');

class ShiftPublishComponent extends Component{
    constructor(props){
        super(props);
        this.state = {
            publishModalPopped: false,
            addTemplateModalOpen: false,
            templateName:"",
            workplaceId:"",
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
    templateView = (view) => {
      this.setState({redirect:true})
    };
    addTemplateName = () => {
        if (this.state.workplaceId && this.state.templateName){
            const that = this;

            var uri = 'https://20170808t142850-dot-forward-chess-157313.appspot.com/api/shiftToTemplate'

             var options = {
                uri: uri,
                method: 'POST',
                json: {"data": {"weekPublishedId": this.props.publishId,
                                "brandId": localStorage.getItem('brandId'),
                                "workplaceId": this.state.workplaceId,
                                "creatorId":   localStorage.getItem('userId'),
                                "name": this.state.templateName
                            }
                }
            };

              rp(options)
                .then(function(response) {
                       that.setState({redirect:true})
                  }).catch((error) => {
                      console.log('there was an error sending the query', error);
                  });
        }
    };
    automateSchedule = (publishId) => {
        console.log(publishId)
        var uri = "https://20170808t142850-dot-forward-chess-157313.appspot.com/api/algorithm/"
        var options = {
            uri: uri,
            method: 'POST',
            json: {"data": {"week_id": publishId,"sec": "QDVPZJk54364gwnviz921"}}};

        rp(options)
        .then( function ($) {
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
        this.setState({addTemplateModalOpen:true})
    };
    onConfirm = () => {

    };
    onPublish = () => {
        this.setState({publishModalPopped:true})
    };
    handleNameChange = (e) => {
    this.setState({templateName:e});
    };
    handleWorkplaceChange = (e) => {
        this.setState({workplaceId:e});
    };
    publishWeek = () => {
        this.props.mutate({
            variables: {id: this.props.publishId, date: moment().format() }
        })
        this.modalClose()

    };

    render(){
        let is_publish = this.props.isPublish;
        let publishId = this.props.publishId
        const startDate = this.props.date;

        let status = "";
        let statusImg = "";
        if (is_publish == false){
            status = "UNPUBLISHED SCHEDULE";
            statusImg = "/assets/Icons/unpublished.png";
        }
        else if (is_publish == true ){
            status="PUBLISHED SCHEDULE";
            statusImg = "/assets/Icons/published.png";
        }
        let publishModalOptions =[{type:"white",title:"Go Back",handleClick:this.goBack,image:false},
            {type:"blue",title:"Confirm",handleClick:this.publishWeek,image:false}];
        if(this.state.redirect){
            return (
              <Redirect to={{pathname:'/schedule/template' ,viewName:this.props.view}}/>
            )
        }

        let { date } = this.props;
        let { start } = ShiftPublish.range(date, this.props);

        return(
            <div>
                {this.state.publishModalPopped && <Modal title="Confirm" isOpen={this.state.publishModalPopped}
                                                         message = "Are you sure that you want to publish the week's schedule?"
                                                         action = {publishModalOptions} closeAction={this.modalClose}/>
                }
                {this.state.addTemplateModalOpen && <AddAsTemplateModal addTemplateModalOpen={true}
                                                                        handleClose={this.addTemplateclose}
                                                                        addTemplate={this.addTemplateName}
                                                                        handleNameChange={this.handleNameChange}
                                                                        handleWorkplaceChange={this.handleWorkplaceChange} />
                }
                    <div className="col-md-12">
                        <div className="col-sm-offset-3 col-sm-5 rectangle">
                            {is_publish == "none"? "NO SHIFTS FOR GIVEN WEEK" :<img src={statusImg}/>}
                            <p className="col-sm-offset-2">{status}</p>
                        </div>
                    </div>
                  <div className="btn-action">
                    {moment(startDate).diff(moment(), 'days') > -7 ?
                      <div>
                        <Button className="btn-image"><CreateShiftButton weekPublishedId={ publishId } weekStart={ start } /></Button>
                        {(is_publish == false && is_publish != "none") && <Button className="btn-image flr" onClick={this.onPublish}><img className="btn-image flr" src="/assets/Buttons/publish.png" alt="Publish"/></Button>}
                        {(is_publish != "none") && <Button className="btn-image flr" onClick={() => this.automateSchedule(publishId)}><img className="btn-image flr" src="/assets/Buttons/automate-schedule.png" alt="Automate"/></Button>}
                        {/*{(is_publish != "none") && <Button className="btn-image flr" as={NavLink} to="/schedule/template"><img className="btn-image flr" src="/assets/Buttons/automate-schedule.png" alt="Automate"/></Button>}*/}
                        {is_publish != "none" && <Button className="btn-image flr" onClick={this.addTemplateModalOpen}><img className="btn-image flr" src="/assets/Buttons/add-as-template.png" alt="Add As Template"/></Button>}
                      </div> :
                      <div>
                      {is_publish != "none" && <Button className="btn-image flr" onClick={this.addTemplateModalOpen}><img className="btn-image flr" src="/assets/Buttons/add-as-template.png" alt="Add As Template"/></Button>}
                      </div>
                    }

                </div>
            </div>
        )
    }
}

const updateWeekPublishedNameMutation = gql`
mutation updateWeekPublishedById($id: Uuid!, $date: Datetime!) {
    updateWeekPublishedById(input:{ id: $id, weekPublishedPatch:{published: true, datePublished: $date}}){
            weekPublished{
                id
                published
                start
                end
            }
        }
}`


ShiftPublishComponent.range = (date, { culture }) => {
    let firstOfWeek = localizer.startOfWeek(culture);
    let start = dates.startOf(date, 'week', firstOfWeek);
    let end = dates.endOf(date, 'week', firstOfWeek);
    return { start, end };
};


const ShiftPublish = graphql(updateWeekPublishedNameMutation)(ShiftPublishComponent);

export default ShiftPublish
