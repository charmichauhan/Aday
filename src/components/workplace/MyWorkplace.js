import React, { Component } from 'react';
import {Label, Image} from 'semantic-ui-react'
import '../Scheduling/style.css';
import './MyWorkplace.css';
import WorkplaceMap from '../maps/Workplace'
import WorkingHours from './WorkingHours'
import WorkplaceReviews from './WorkplaceReviews'
import WorkplaceListings from './WorkplaceListings'
import WorkplacePhotos from './WorkplacePhotos'
import { gql, graphql} from 'react-apollo';

class MyWorkplace extends Component {
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
				<div className="col-md-12 page-title-rectangle">
						<div className="col-sm-offset-3 col-sm-5 rectangle page-title">
								MY WORKPLACE LISTING
						</div>
				</div>

				<div className="workplace" style={{maxWidth:1600}}>
					{localStorage.getItem("workplaceId") != "" ?
					<div className="workplace-overview">

						<div className="workplace-brand-header">
							<img src={this.props.data.workplaceById.brandByBrandId.brandIconUrl} className="workplace-brand-icon"/>
							<div className="workplace-brand-name">
								<h1 style={{marginBottom:0, paddingBottom:0}}>
									{this.props.data.workplaceById.brandByBrandId.brandName}
							   </h1>
								<h2 style={{marginTop:0, paddingTop:0}}>
									{this.props.data.workplaceById.workplaceName}
								</h2>
							</div>
						</div>
						<div className="workplace-loc-img">
							<WorkplaceMap address={this.props.data.workplaceById.address}/>
							<WorkplacePhotos style={{marginRight:20}}/>
						</div>

						<div className="workplace-subheader" style={{paddingBottom:10}}>WORKPLACE DESCRIPTION</div>
						<div>
							<div className="workplace-description">
								<span style={{flex:14}}>If you have a positive attitude and a love for learning, you may be interested in joining our team.</span>
								<div style={{flex:1}}>
									<Image className="workplace-edit-button" src="https://s3.us-east-2.amazonaws.com/aday-website/icons/edit-button.png"/>
								</div>
							</div>
						</div>

						<WorkplaceListings className="workplace-listings" />
						<div className="workplace-subheader" style={{paddingBottom:10}}>WORKPLACE REVIEWS</div>
						 <WorkplaceReviews className="workplace-reviews"/>
					</div>

					 : <div>
						 <div className="choose-workplace-text">
							PLEASE CHOOSE YOUR WORKPLACE FROM THE SIDEBAR
						 </div>
						 <img src={require('./select-workplace.png')} className="select-workplace" />
					 </div>}
				</div>
			</div>
		);
	}
}

const workplaceInfo = gql`
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

export default graphql(workplaceInfo, {
	options: (ownProps) => ({
		variables: {
			workplaceId: localStorage.getItem('workplaceId') ,
		}
	}),
})(MyWorkplace);
