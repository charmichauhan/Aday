import React, { Component } from 'react';
import {Header, Divider, Grid, Label, Image} from 'semantic-ui-react'
import '../Scheduling/style.css';
import Avatar from '../helpers/Avatar'
import WorkplaceMap from '../maps/Workplace'
import WorkingHours from './WorkingHours'
import WorkplaceReviews from './WorkplaceReviews'
import { gql, graphql,compose} from 'react-apollo';

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
				<div className="col-md-12">
						<div className="col-sm-offset-3 col-sm-5 rectangle"
								 style={{fontWeight: 'bold', fontSize: 18, color:'#4A4A4A'}}>
								MY WORKPLACE LISTING
						</div>
				</div>
				<Grid className="workplace">
					<Grid.Column width={15}>
						{localStorage.getItem("workplaceId") != "" ?
						 <div>
						 	 <Image src={this.props.data.workplaceById.brandByBrandId.brandIconUrl}
							 				width="100" height="100" centered={true} style={{float:'left', marginRight:15}}/>
							 <div>
							 	 <h1 style={{marginBottom:0, paddingBottom:0, marginTop: 10}}>
								 	 {this.props.data.workplaceById.brandByBrandId.brandName}
								</h1>
							 	 <h2 style={{marginTop:0, paddingTop:0, color:'#4A4A4A'}}>
								 	 {this.props.data.workplaceById.workplaceName}
								 </h2>
							 </div>
							 {/*<div className="workplace-details">workplace details</div>*/}
							 <div style={{clear: 'both', marginTop: 65}}>
								 <WorkplaceMap address={this.props.data.workplaceById.address}/>
								 <Image src={this.props.data.workplaceById.workplaceImageUrl} centered={true}
								 				style={{height:'auto', width:300, float:'left', marginLeft: 10}}/>
								 <WorkplaceReviews/>
							 </div>
						 </div>
						 : <div style={{marginTop: 0}}> Please Select Workplace </div>}
					</Grid.Column>
					<Grid.Column width={1}>
						{/*
						<WorkingHours/>
						<Header as="h4">GENERAL MANAGER</Header>
						<Avatar
							first_name="JOSE"
							last_name="CORTEZ"
							type="avatar-verticle"
							size="tiny"
						/>
						<Header as="h4">ALL MANAGERs: <Label>3</Label></Header>
						<Avatar
							first_name="JOSE"
							last_name="CORTEZ"
							type="avatar-verticle"
							size="tiny"
						/>
						<Header as="h4">TEAM MEMBERS: <Label>212</Label></Header>
						<Avatar
							first_name="JOSE"
							last_name="CORTEZ"
							type="avatar-verticle"
							size="tiny"
						/>
						<Avatar
							first_name="JOSE"
							last_name="CORTEZ"
							type="avatar-verticle"
							size="tiny"
						/>
						<Avatar
							first_name="JOSE"
							last_name="CORTEZ"
							type="avatar-verticle"
							size="tiny"
						/>
						*/}
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
