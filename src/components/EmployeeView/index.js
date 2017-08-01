import React, { Component } from 'react';
import moment from 'moment';
import BigCalendar from 'react-big-calendar';
import { NavLink } from 'react-router-dom'
import { Button } from 'semantic-ui-react';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import Toolbar from 'react-big-calendar/lib/Toolbar';
import ShiftWeekTable from './ShiftWeekTable';
import ShiftPublish from '../Scheduling/ShiftWeekTable/ShiftPublish';
import '../Scheduling/style.css';
import {Modal} from 'semantic-ui-react';
import { gql, graphql, compose } from 'react-apollo';

const styles = {
    bodyStyle: {
        maxHeight: 400
    },
    wrapperStyle: {
        width: 1188
    },
    root: {
        borderCollapse: 'separate',
        borderSpacing: '8px 8px'
    },
    tableFooter: {
        paddingLeft:'0px',
        paddingRight:'0px'
    },
    tableFooterHeading: {
        paddingLeft:'0px',
        paddingRight:'0px',
        width: 178
    }
};

class EmployeeViewComponent extends Component {
	constructor(props){
		super(props);
        this.state = {
            publishModalPopped: false,
            addTemplateModalOpen: false,
            templateName:"",
            redirect:false,
            date: Date.today
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

    onConfirm = () => {

    };
	onPublish = () => {
		this.setState({publishModalPopped:true})
	};
	onNavigate = (start) => {
		this.setState({date: start})
	};

    render() {
        BigCalendar.momentLocalizer(moment);

         if (this.props.data.loading) {
            return (<div>Loading</div>)
        }

        if (this.props.data.error) {
            console.log(this.props.data.error)
            return (<div>An unexpected error occurred</div>)
        }

        let is_publish = "none";
        let publish_id = "";
        const date = this.state.date;
        this.props.data.allWeekPublisheds.nodes.forEach(function(value){
        if ((moment(date).isAfter(moment(value.start)) && moment(date).isBefore(moment(value.end)))
            ||  (moment(date).isSame(moment(value.start), 'day'))
            || (moment(date).isSame(moment(value.end), 'day'))
            ){
              is_publish = value.published;
              publish_id = value.id;
          }
        })

         let publishModalOptions =[{type:"white",title:"Go Back",handleClick:this.goBack,image:false},
              {type:"blue",title:"Confirm",handleClick:this.onConfirm,image:false}];

        return (
			<div className="App row">

				<div style={{height: '160px'}}> <ShiftPublish date={this.state.date} isPublish={ is_publish }/> </div>
                {this.state.publishModalPopped?<Modal title="Confirm" isOpen={this.state.publishModalPopped}
													  message = "Are you sure that you want to delete this shift?"
													  action = {publishModalOptions} closeAction={this.modalClose}/>
                    :""}
				<div>
					<BigCalendar events={[]}
								 culture='en-us'
								 startAccessor='startDate'
								 endAccessor='endDate'
								 defaultView='week'
								 onNavigate={(start)=>this.onNavigate(start)}
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

class CustomToolbar extends Toolbar {

	render() {
        let month = moment(this.props.date).format("MMMM YYYY");
        return (
			<div>
				<nav className="navbar">
					<div className="container-fluid">
						<div className="wrapper-div">
							<div className="navbar-header">
								<button type="button "
										className="btn btn-default navbar-btn btnnav glyphicon glyphicon-arrow-left"
										onClick={() => this.navigate("PREV")}/>
								<button type="button"
										className="btn btn-default navbar-btn btnnav glyphicon glyphicon-arrow-right"
										onClick={() => this.navigate("NEXT")}/>
							</div>

							<ul className="nav navbar-nav">
								<Button className="" as={NavLink} to="/schedule/team" >Job view</Button>
							</ul>
							<div className="maintitle">{month}</div>
							<ul className="nav navbar-nav navbar-right">
								<li>
									<button type="button" className="btn btn-default btnnav navbar-btn m8 "><strong>Today</strong>
									</button>
								</li>
								<li>
									<button type="button" className="btn btn-default btnnav navbar-btn m8 "
											onClick={() => this.view("day")}><strong>DAY</strong></button>
								</li>
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

const EmployeeView = graphql(allWeekPublisheds, {
    options: (ownProps) => ({
        variables: {
            brandid: "5a14782b-c220-4927-b059-f4f22d01c230",
        }
    }),
})(EmployeeViewComponent)

export default EmployeeView