import React, { Component } from 'react';
import {Grid, Label, Image, Card} from 'semantic-ui-react'
import '../Scheduling/style.css';
import './MyWorkplace.css';
import WorkplaceMap from '../maps/Workplace'
import WorkingHours from './WorkingHours'
import WorkplaceReviews from './WorkplaceReviews'
import { gql, graphql} from 'react-apollo';
import { Truncate } from 'rebass'

class WorkplaceListingsComponent extends Component {
	render() {
		if (this.props.data.loading) {
			return (<div>Loading...</div>);
		}
		if (this.props.data.error) {
			if (localStorage.getItem("workplaceId") != "") {
				return (<div>An Unexpected Error Occurred</div>);
			}
		}

		const ListingCard = (props) => {
			 return (
				 <div className="workplace-card-spacing">
					 <Card className="workplace-listing-card" onClick="www.google.com">
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

		return (
			<div>
				<label className="workplace-subheader">POSITIONS ACCEPTING APPLICATIONS</label>
					<div className="workplace-card-group">
	    				<Card.Group itemsPerRow={2}>
							<ListingCard
								brandIcon={this.props.data.workplaceById.brandByBrandId.brandIconUrl}
								jobTitle="Short Order Cook"
								location="Harvard Business School, Restaurant Associates"
								travelTime="125 Batten Way, Boston • 0 miles away"
							/>
							<ListingCard
								brandIcon={this.props.data.workplaceById.brandByBrandId.brandIconUrl}
								jobTitle="Second Cook"
								location="Harvard Business School, Restaurant Associates"
								travelTime="125 Batten Way, Boston • 0 miles away"
							/>
							<ListingCard
								brandIcon={this.props.data.workplaceById.brandByBrandId.brandIconUrl}
								jobTitle="Pastry Cook"
								location="Harvard Business School, Restaurant Associates"
								travelTime="125 Batten Way, Boston • 0 miles away"
							/>
							<ListingCard
								brandIcon={this.props.data.workplaceById.brandByBrandId.brandIconUrl}
								jobTitle="Storekeeper"
								location="Harvard Business School, Restaurant Associates"
								travelTime="125 Batten Way, Boston • 0 miles away"
							/>
							<ListingCard
								brandIcon={this.props.data.workplaceById.brandByBrandId.brandIconUrl}
								jobTitle="General Server"
								location="Harvard Business School, Restaurant Associates"
								travelTime="125 Batten Way, Boston • 0 miles away"
							/>
							<ListingCard
								brandIcon={this.props.data.workplaceById.brandByBrandId.brandIconUrl}
								jobTitle="Sushi Chef"
								location="Harvard Business School, Restaurant Associates"
								travelTime="125 Batten Way, Boston • 0 miles away"
							/>
						</Card.Group>
				</div>
            </div>
        )
    }
}

const WorkplaceListings = gql`
	query($workplaceId: Uuid!){
		workplaceById(id:$workplaceId){
			workplaceName
			brandByBrandId{
				brandName
				brandIconUrl
			}
			address
			workplaceImageUrl
		}
	}
`

export default graphql(WorkplaceListings, {
	options: (ownProps) => ({
		variables: {
			workplaceId: localStorage.getItem('workplaceId') ,
		}
	}),
})(WorkplaceListingsComponent);
