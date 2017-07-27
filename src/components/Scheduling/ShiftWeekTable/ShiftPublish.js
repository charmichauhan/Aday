import React, { Component } from 'react';
import Published from '../../../../public/assets/Icons/published.png';
import Unpublished from '../../../../public/assets/Icons/unpublished.png';
import '../../Scheduling/style.css';
import { gql, graphql, compose } from 'react-apollo';
import moment from 'moment'
import CreateShiftButton from '../../Scheduling/AddShift/CreateShiftButton';
import { Button } from 'semantic-ui-react';
import { NavLink } from 'react-router-dom'
import AddAsTemplate from '../../../../public/assets/Buttons/add-as-template.png';
import TemplateList from '../../../../public/assets/Buttons/template-list-button.png';
import Automate from '../../../../public/assets/Buttons/automate-schedule.png';
import Publish from '../../../../public/assets/Buttons/publish.png';


class ShiftPublishComponent extends Component{
    render(){
        console.log(this.props)
        if (this.props.data.loading) {
             return (<div>Loading</div>)
         }
        
         if (this.props.data.error) {
             console.log(this.props.data.error)
             return (<div>An unexpected error occurred</div>)
        }
        let is_publish = ""
        const week_published = this.props.data.weekPublishedByDate.nodes[0]
        if(week_published){
             is_publish = week_published.published;
        }
        let status = "";
        let statusImg = "";
        if (is_publish == false){
             let status = "UNPUBLISHED SCHEDULE";
            let statusImg = Unpublished;
        }
        else if (is_publish == true ){
            status="PUBLISHED SCHEDULE";
            statusImg = Published;
        }
        return(
            <div>
            <div className="col-md-12">
                <div className="col-sm-offset-3 col-sm-5 rectangle">
                    {is_publish == ""? "NO SHIFTS FOR GIVEN WEEK" :<img src={statusImg}/>}
                    <p className="col-sm-offset-2">{status}</p>
                </div>
            </div>
            <div className="btn-action">
                    <Button className="btn-image"><CreateShiftButton/></Button>
                   {(is_publish == false && is_publish != "") ? <Button className="btn-image flr" onClick={this.onPublish}><img className="btn-image flr" src={Publish} alt="Publish"/></Button> : ""}
                   {(is_publish != "")? <Button className="btn-image flr" as={NavLink} to="/schedule/template"><img className="btn-image flr" src={Automate} alt="Automate"/></Button> :""}
                   {is_publish != ""? <Button className="btn-image flr" as={NavLink} to="/schedule/template"><img className="btn-image flr" src={AddAsTemplate} alt="Add As Template"/></Button>:""}
                    <Button className="btn-image flr" as={NavLink} to="/schedule/template"><img className="btn-image flr" src={TemplateList} alt="Template List"/></Button>
            </div>
            </div>
        )
    }
}


const allShifts = gql
  `query allShifts($brandid: Uuid!, $day: Datetime!){ 
        weekPublishedByDate(brandid: $brandid, day: $day){
            nodes{
            id
            published
        }
    }
}`

const ShiftPublish = graphql(allShifts, {
   options: (ownProps) => ({ 
     variables: {
       brandid: "5a14782b-c220-4927-b059-f4f22d01c230",
       day: moment(ownProps.date)
     }
   }),
 })(ShiftPublishComponent)

 export default ShiftPublish