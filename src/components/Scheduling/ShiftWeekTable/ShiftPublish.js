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
import AddAsTemplate from '../../../../public/assets/Buttons/add-as-template.png';
import TemplateList from '../../../../public/assets/Buttons/template-list-button.png';
import Automate from '../../../../public/assets/Buttons/automate-schedule.png';
import Publish from '../../../../public/assets/Buttons/publish.png';
import dates from 'react-big-calendar/lib/utils/dates';
import localizer from 'react-big-calendar/lib/localizer';

class ShiftPublish extends Component{
    constructor(props){
        super(props);
        this.state = {
            publishModalPopped: false,
            addTemplateModalOpen: false,
            templateName:"",
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
    addTemplateName = () => {
        let that = this;
        that.setState({redirect:true});
    };
    addTemplateModalOpen = () => {
        this.setState({addTemplateModalOpen:true})
    };
    onConfirm = () => {

    };
    onPublish = () => {
        this.setState({publishModalPopped:true})
    };
    handleChange = (e) => {
        this.setState({templateName:e});
    };
    render(){
        console.log(this.props)
        let is_publish = this.props.isPublish
        const startDate = this.props.date

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
            {type:"blue",title:"Confirm",handleClick:this.onConfirm,image:false}];
        if(this.state.redirect){
            return (
                <Redirect to={{pathname:'/schedule/team/template' ,templateName:this.state.templateName}}/>
            )
        }

        let { date } = this.props;
        let { start } = ShiftPublish.range(date, this.props);
        return(
            <div>
                {this.state.publishModalPopped && <Modal title="Confirm" isOpen={this.state.publishModalPopped}
                                                         message = "Are you sure that you want to delete this shift?"
                                                         action = {publishModalOptions} closeAction={this.modalClose}/>
                }
                {this.state.addTemplateModalOpen && <AddAsTemplateModal addTemplateModalOpen={true}
                                                                        handleClose={this.addTemplateclose}
                                                                        addTemplate={this.addTemplateName}
                                                                        handleChange={(e) =>this.handleChange(e)} />
                }
                    <div className="col-md-12">
                        <div className="col-sm-offset-3 col-sm-5 rectangle">
                            {is_publish == "none"? "NO SHIFTS FOR GIVEN WEEK" :<img src={statusImg}/>}
                            <p className="col-sm-offset-2">{status}</p>
                        </div>
                    </div>
                  <div className="btn-action">
                    <Button className="btn-image"><CreateShiftButton brandId={"5a14782b-c220-4927-b059-f4f22d01c230"} weekStart={ start } /></Button>
                    {(is_publish == false && is_publish != "none") && <Button className="btn-image flr" onClick={this.onPublish}><img className="btn-image flr" src="/assets/Buttons/publish.png" alt="Publish"/></Button>}
                    {(is_publish != "none") && <Button className="btn-image flr" as={NavLink} to="/schedule/team/template"><img className="btn-image flr" src="/assets/Buttons/automate-schedule.png" alt="Automate"/></Button>}
                    {is_publish != "none" && <Button className="btn-image flr" onClick={this.addTemplateModalOpen}><img className="btn-image flr" src="/assets/Buttons/add-as-template.png" alt="Add As Template"/></Button>}
                </div>
            </div>
        )
    }
}

ShiftPublish.range = (date, { culture }) => {
    let firstOfWeek = localizer.startOfWeek(culture);
    let start = dates.startOf(date, 'week', firstOfWeek);
    let end = dates.endOf(date, 'week', firstOfWeek);
    return { start, end };
};

ShiftPublish.range = (date, { culture }) => {
    let firstOfWeek = localizer.startOfWeek(culture);
    let start = dates.startOf(date, 'week', firstOfWeek);
    let end = dates.endOf(date, 'week', firstOfWeek);
    return { start, end };
};

export default ShiftPublish
