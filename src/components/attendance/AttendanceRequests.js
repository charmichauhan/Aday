import React, { Component } from 'react'
import { Menu, Segment } from 'semantic-ui-react'
import TimeAttendanceTable from './TimeAttendanceTable'
import { corporationTimeOffRequestQuery } from './TimeOffQueries'
import { graphql } from 'react-apollo';

class AttendanceRequests extends Component {
	state = { activeItem: 'PENDING' }
	handleItemClick = (e, { name }) => this.setState({ activeItem: name })
	render() {
		const {
			activeItem
		} = this.state
		let data =  [
				{
					node: {
            userByRequestorId: {
              firstName: "Maddie",
              lastName: "Test"
            },
            startDate: "2017-07-26T04:00:00+00:00",
            endDate: "2017-07-27T04:00:00+00:00",
            submissionDate: "2017-07-21T14:56:55+00:00",
            requestType: "VACATION",
            minutesPaid: 0,
            payDate: null,
            notes: "test test test test test test test test test test test test test test test test",
            decisionStatus: "DENIED"
          }
				}
			];
    if (this.props.data.error) {
        return <div>Error! {this.props.data.error.message}</div>;
    }
    if (this.props.data.loading) {
        return (<div> Loading... </div>);
    }
		data = this.props.data.allTimeOffRequests.edges;
		let filtered_data = data.filter((item) => item.node.decisionStatus == activeItem);
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
				</Menu>
				<Segment attached="bottom">
					<TimeAttendanceTable requests={filtered_data} filter={activeItem}/>
				</Segment>
			</div>
		);
	}
}

export default graphql(corporationTimeOffRequestQuery,
											 {options: {variables: {"corporationId": "3b14782b-c220-4927-b059-f4f22d01c230"}}})
											 (AttendanceRequests);
