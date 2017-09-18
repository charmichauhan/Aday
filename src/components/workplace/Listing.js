import React, { Component } from 'react';
import {Label, Image} from 'semantic-ui-react'
import '../Scheduling/style.css';
import './MyWorkplace.css';
import WorkplaceMap from '../maps/Workplace'
import WorkplacePhotos from './WorkplacePhotos'
import { gql, graphql} from 'react-apollo';
import CircleButton from '../helpers/CircleButton';

const styles = {
  circleButton: {
    fontSize: 18,
    padding: '6px 5px',
    fontWeight: 'bold'
}};

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
					<div className="workplace-subheader" style={{paddingBottom:10}}>CASHIER POSITION</div>
					<div>
						<div className="job-description">
							<span style={{flex:14}}>Performs cashiering duties, including making cash transactions, verifying cash drawer, giving change, counting cash receipts and completing cash reports. May also perform general food service work. Maintains sanitation standards in the preparation, service and dining room facilities. </span>
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
