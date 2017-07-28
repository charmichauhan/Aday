import React, { Component } from 'react'
import { Menu, Segment } from 'semantic-ui-react'
import TimeAttendanceTable from './TimeAttendanceTable'
import { corporationTimeOffRequestQuery } from './TimeOffQueries'
import { graphql } from 'react-apollo';
import moment from 'moment';

class AttendanceRequests extends Component {
	state = { activeItem: 'PENDING' }
	handleItemClick = (e, { name }) => this.setState({ activeItem: name })
	render() {
		const {
			activeItem
		} = this.state
		let data = [];
		let filtered_data = [];
    if (this.props.data.error) {
        return <div>Error! {this.props.data.error.message}</div>;
    }
		if (this.props.data.allTimeOffRequests){
			data = this.props.data.allTimeOffRequests.edges;
			if (activeItem != 'HISTORY'){
				filtered_data = data.filter((item) => item.node.decisionStatus == activeItem &&
																						 	moment().diff(item.node.startDate) <= 0);
			} else {
				filtered_data = data.filter((item) => moment().diff(item.node.startDate) > 0)
			}

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
					{!this.props.data.allTimeOffRequests ?
					 (<div> Loading... </div>) :
					 (<TimeAttendanceTable requests={filtered_data} filter={activeItem}/>)}
				</Segment>
			</div>
		);
	}
}

export default graphql(corporationTimeOffRequestQuery,
											 {options: {variables: {"corporationId": "3b14782b-c220-4927-b059-f4f22d01c230"}}})
											 (AttendanceRequests);
