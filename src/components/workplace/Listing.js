import React, { Component } from 'react';
import {Label, Image} from 'semantic-ui-react'
import '../Scheduling/style.css';
import './MyWorkplace.css';
import WorkplaceMap from '../maps/Workplace'
import WorkplacePhotos from './WorkplacePhotos'
import { gql, graphql} from 'react-apollo';
import CircleButton from '../helpers/CircleButton';
import { workplaceInfo } from './workplaceQueries';

const styles = {
  circleButton: {
    fontSize: 18,
    padding: '6px 5px',
    fontWeight: 'bold'
}};

class MyWorkplace extends Component {
  // function to help identify which opportunity is coded in the url
  opportunityMatch =(opportunity)=> {
    const opportunityId = this.props.match.params.opportunityId;
    return opportunity.id == opportunityId;
  }
	render() {
		if (this.props.data.loading) {
			return (<div>Loading...</div>);
		}
		if (this.props.data.error) {
			return (<div>An Unexpected Error Occurred</div>);
		}
    const opportunities = this.props.data.workplaceById.opportunitiesByWorkplaceId.nodes;
    const opportunity = opportunities.find(this.opportunityMatch);
    console.log(opportunities);
    console.log(this.props.match.params.opportunityId);
    if (!opportunity) {
      return (<div>An Unexpected Error Occurred</div>);
    }
		return (
			<div>
				<div className="col-md-12 page-title-rectangle">
						<div className="col-sm-offset-3 col-sm-5 rectangle page-title">
								JOB DESCRIPTION
						</div>
				</div>

				<div className="workplace" style={{maxWidth:1600}}>

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
							{/*<WorkplacePhotos style={{marginRight:20}}/>*/}
						</div>

						<div className="workplace-subheader" style={{paddingBottom:10}}>ABOUT RESTAURANT ASSOCIATES @ HARVARD BUSINESS SCHOOL</div>
						<div>
							<div className="workplace-description">
								<span style={{flex:14}}>If you have a positive attitude and a love for learning, you may be interested in joining our team.</span>
							</div>
						</div>
					</div>
					<div className="workplace-subheader" style={{paddingBottom:10}}>{opportunity.positionByPositionId.positionName}</div>
					<div>
						<div className="job-description">
							<span style={{flex:14}}>{opportunity.positionByPositionId.positionDescription} </span>
							<div style={{alignSelf:"center"}}>
								<CircleButton style={styles.circleButton} type="green" title="Apply"/>
							</div>
						</div>
					</div>

				</div>
			</div>
		);
	}
}

export default graphql(workplaceInfo, {
	options: (ownProps) => ({
		variables: {
			workplaceId: ownProps.match.params.workplaceId,
		}
	}),
})(MyWorkplace);
