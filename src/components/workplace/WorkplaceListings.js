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
		return (
			<div>
				<label className="workplace-subheader">CROSSTRAINING OPPORTUNITIES</label>
    				<Card.Group itemsPerRow={3}>
    					  <Card className="workplace-listing-card">
    						<Card.Content>
                                <div className="workplace-listing-upper">
									<div className="workplace-listing-head">
		                                <div className="workplace-listing-wrapper">
		                                    <Image src={this.props.data.workplaceById.brandByBrandId.brandIconUrl} className="workplace-card-icon"/>
		                                </div>
		                                 <div className="workplace-listing-headers">
		            						  <span className="workplace-listing-header">Short Order Cook</span>
		                                      <Truncate className="workplace-listing-subheader">Harvard Business School, Restaurant Associates</Truncate>
		                                  </div>
		                             </div>
								</div>
								 <div className="workplace-card-footer">
								 	 <div className="horizontal-line" />
									 <div style={{height:7}} />
	        						 <Card.Meta>125 Batten Way, Boston • 0 miles away    </Card.Meta>
								 </div>
            				</Card.Content>
    					  </Card>
    				</Card.Group>
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
