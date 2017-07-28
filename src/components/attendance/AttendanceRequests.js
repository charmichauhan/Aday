import React, { Component } from 'react'
import { Menu, Segment, Button } from 'semantic-ui-react'
import TimeAttendanceTable from './TimeAttendanceTable'
import { corporationTimeOffRequestQuery } from './TimeOffQueries'
import { graphql } from 'react-apollo';
import moment from 'moment';

class AttendanceRequests extends Component {
	constructor(props) {
    super(props);
    this.state = { activeItem: 'PENDING' }
  }
	handleItemClick = (e, { name }) => this.setState({ activeItem: name })
	isPast(request){
		return moment().diff(request.node.startDate) > 0;
	}
	render() {
		const activeItem = this.state.activeItem;
		if (this.props.data.error) {
        return <div>Error! {this.props.data.error.message}</div>;
    }
		let content = (<div></div>);
		let requests = [];
		let data = [];
		let filtered_data = [];
		if (!this.props.data.allTimeOffRequests){
			content = (<div> Loading... </div>);
		} else {
			let requests = this.props.data.allTimeOffRequests.edges;
			if (requests.filter(this.isPast).length === 0) {
				this.props.data.loadMoreEntries();
			}
			if (activeItem != 'HISTORY'){
				filtered_data = requests.filter((item) => item.node.decisionStatus == activeItem &&
																						 	!this.isPast(item));
			} else {
				filtered_data = requests.filter(this.isPast);
			}
			content = (<TimeAttendanceTable requests={filtered_data} filter={activeItem}/>);
		}
		return (
			<div>
				<Menu attached='top' tabular>
					<Menu.Item
						content="Open Requests"
						name="PENDING"
						active={activeItem === 'PENDING'}
						onClick={this.handleItemClick}/>
					<Menu.Item
					  content="Approved Requests"
						name="APPROVED"
						active={activeItem === 'APPROVED'}
						onClick={this.handleItemClick}/>
					<Menu.Item
						content="Denied Requests"
						name="DENIED"
						active={activeItem === 'DENIED'}
						onClick={this.handleItemClick}/>
					<Menu.Item
						content="Request History"
						name="HISTORY"
						active={activeItem === 'HISTORY'}
						onClick={this.handleItemClick}/>
				</Menu>
				<Segment attached="bottom">
					{content}
				</Segment>
				{(activeItem=="HISTORY" && this.props.data.allTimeOffRequests &&
					this.props.data.allTimeOffRequests.pageInfo.hasNextPage) &&
				 <Button onClick={this.props.data.loadMoreEntries}>Load More</Button>
				}
			</div>
		);
	}
}

export default graphql(corporationTimeOffRequestQuery, {
	                    options(props){
											 	return {
													variables: {corporationId: "3b14782b-c220-4927-b059-f4f22d01c230"}
												};
											},
											props({ data: { loading, allTimeOffRequests, fetchMore } }) {
										  	return {data : {
										    	loading,
										    	allTimeOffRequests,
										    	loadMoreEntries: () => {
										      	return fetchMore({
										        	query: corporationTimeOffRequestQuery,
										        	variables: {
										          	cursor: allTimeOffRequests.pageInfo.endCursor,
																corporationId: "3b14782b-c220-4927-b059-f4f22d01c230"
										         	},
										        	updateQuery: (previousResult, { fetchMoreResult }) => {
										          	const newEdges = fetchMoreResult.allTimeOffRequests.edges;
										          	const pageInfo = fetchMoreResult.allTimeOffRequests.pageInfo;
										          	return {
										            	allTimeOffRequests: {
										              	edges: [...previousResult.allTimeOffRequests.edges, ...newEdges],
										            		pageInfo,
										            	},
										          	};
										        	},
										      	});
										    	},
										  	}};
											}})
											(AttendanceRequests);
