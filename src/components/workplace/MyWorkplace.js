import React, { Component } from 'react';
import {Grid, Label, Image} from 'semantic-ui-react'
import '../Scheduling/style.css';
import './MyWorkplace.css';
import WorkplaceMap from '../maps/Workplace'
import WorkingHours from './WorkingHours'
import WorkplaceReviews from './WorkplaceReviews'
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
				{/* Page Title*/}
				<div className="col-md-12 page-title-rectangle">
						<div className="col-sm-offset-3 col-sm-5 rectangle page-title">
								MY WORKPLACE LISTING
						</div>
				</div>

				{/* Workplace Information*/}
				<Grid className="workplace">

						{localStorage.getItem("workplaceId") != "" ?

						<Grid.Column width={15}>
							 <div style={{marginTop: 20}} />
							 <div>
							 	{/* Brand Image*/}
							 	 <Image src={this.props.data.workplaceById.brandByBrandId.brandIconUrl}
								 				width="100" height="100" centered={true} style={{float:'left', marginRight:15}}/>
								 <div>

								 	 <h1 style={{marginBottom:0, paddingBottom:0}}>
									 	 {this.props.data.workplaceById.brandByBrandId.brandName}
									</h1>

								 	 <h2 style={{marginTop:0, paddingTop:0}}>
									 	 {this.props.data.workplaceById.workplaceName}
									 </h2>
								 </div>

								 {/*<div className="workplace-details">workplace details</div>*/}
								 <div style={{clear: 'both'}}>
									 <WorkplaceMap address={this.props.data.workplaceById.address}/>

									 <Image src={this.props.data.workplaceById.workplaceImageUrl} className="workplace-image"/>

									 {/*Temporary */}
									 <div></div>
									 <div className="workplace">
						 				<div className="reviews-header">WORKPLACE REVIEWS</div>
									</div>

									<div style={{marginTop: 40}} />

									<div>
										<img src={require('./awaiting-review.png')} className="workplace-image" />
									</div>

									 {/*
										 Added to next release...
										 <WorkplaceReviews/>
									*/}

								 </div>
							 </div>
						 </Grid.Column>
							 :<div>
									<div className="choose-workplace-text">PLEASE CHOOSE YOUR WORKPLACE FROM THE SIDEBAR</div>
							 	<img src={require('./select-workplace.png')} className="select-workplace" />
							</div>}
						<Grid.Column width={1}>
					</Grid.Column>
				</Grid>
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
