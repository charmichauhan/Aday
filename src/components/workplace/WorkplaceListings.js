import React, { Component } from 'react';
import {Grid, Label, Image, Card} from 'semantic-ui-react'
import '../Scheduling/style.css';
import './MyWorkplace.css';
import WorkplaceMap from '../maps/Workplace'
import WorkingHours from './WorkingHours'
import WorkplaceReviews from './WorkplaceReviews'
import { Truncate } from 'rebass'

export default class WorkplaceListingsComponent extends Component {
	render() {
		const ListingCard = (props) => {
			 return (
				 <div className="workplace-card-spacing">
					 <Card className="workplace-listing-card" href={"listing/"+props.workplaceId+"/"+props.opportunityId}>
					   <Card.Content style={{margin:-15}}>
						   <div className="workplace-listing-upper">
							   <div className="workplace-listing-head">
								   <div className="workplace-listing-wrapper">
									   <Image src={props.brandIcon} className="workplace-card-icon"/>
								   </div>
									<div className="workplace-listing-headers">
										 <span className="workplace-listing-header">{props.jobTitle}</span>
										 <Truncate className="workplace-listing-subheader"> {props.location}</Truncate>
									 </div>
								</div>
						   </div>
							<div className="workplace-card-footer">
								<div className="horizontal-line" />
								<div style={{height:7}} />
								<text className="workplace-listing-footer-text">{props.travelTime}</text>
							</div>
					   </Card.Content>
					 </Card>
				 </div>
			 )
	  };
		//console.log(this.props);
		return (
			<div>
				<label className="workplace-subheader">POSITIONS ACCEPTING APPLICATIONS</label>
					{/* actual opportunities */}
					<div className="workplace-card-group" style={{marginBottom: 20}}>
						<Card.Group itemsPerRow={2}>
							{this.props.opportunities.map((opportunity, i) =>
								<ListingCard key={i}
									brandIcon={this.props.brandIcon}
									jobTitle={opportunity.positionByPositionId.positionName}
									workplaceId={localStorage.getItem("workplaceId")}
									opportunityId={opportunity.id}
									location="Harvard Business School, Restaurant Associates"
									travelTime="125 Batten Way, Boston • 0 miles away"
								/>
								)
							}
						</Card.Group>
					</div>
					{/* hard-coded opportunities
					<div className="workplace-card-group">
	    				<Card.Group itemsPerRow={2}>
							<ListingCard
								brandIcon={this.props.brandIcon}
								jobTitle="Short Order Cook"
								location="Harvard Business School, Restaurant Associates"
								travelTime="125 Batten Way, Boston • 0 miles away"
							/>
							<ListingCard
								brandIcon={this.props.brandIcon}
								jobTitle="Second Cook"
								location="Harvard Business School, Restaurant Associates"
								travelTime="125 Batten Way, Boston • 0 miles away"
							/>
							<ListingCard
								brandIcon={this.props.brandIcon}
								jobTitle="Pastry Cook"
								location="Harvard Business School, Restaurant Associates"
								travelTime="125 Batten Way, Boston • 0 miles away"
							/>
							<ListingCard
								brandIcon={this.props.brandIcon}
								jobTitle="Storekeeper"
								location="Harvard Business School, Restaurant Associates"
								travelTime="125 Batten Way, Boston • 0 miles away"
							/>
							<ListingCard
								brandIcon={this.props.brandIcon}
								jobTitle="General Server"
								location="Harvard Business School, Restaurant Associates"
								travelTime="125 Batten Way, Boston • 0 miles away"
							/>
							<ListingCard
								brandIcon={this.props.brandIcon}
								jobTitle="Sushi Chef"
								location="Harvard Business School, Restaurant Associates"
								travelTime="125 Batten Way, Boston • 0 miles away"
							/>
						</Card.Group>
				</div>
				*/}
            </div>
        )
    }
}
