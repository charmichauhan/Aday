import React, { Component } from 'react'
import moment from 'moment'
import { Table } from 'semantic-ui-react'
import NotePopup from './NotePopup'
import { graphql } from 'react-apollo';
import { approveTimeOffRequestMutation, corporationTimeOffRequestQuery } from './TimeOffQueries'
const uuidv4 = require('uuid/v4');

class TimeAttendanceTable extends Component {
	constructor(props) {
    super(props);
    this.onDecide = this.onDecide.bind(this);
  }
	onCloseLoading() {
	}
	onDecide(id, state) {
		let data = {"clientMutationId": uuidv4(),
								"id":id,
								"decision": state,
								"approverId": "5b7323ac-e235-4edb-bbf9-97495d9a42a1"
		};
		this.props.mutate(
			{variables: data,
			 optimisticResponse: {
				 __typename: 'Mutation',
				 updateTimeOffRequestById: {
					 timeOffRequest: {
		         id: id,
		         decisionStatus: state,
						 __typename: 'TimeOffRequest'
				 	 },
					 __typename:"UpdateTimeOffRequestPayload"
	       }
			 }
		  }
		).then(this.onCloseLoading);
		this.setState({showLoading: true});
	}
	render() {
		return (
			<Table singleLine compact size="small">
				<Table.Header>
					<Table.Row>
						<Table.HeaderCell>NAME</Table.HeaderCell>
						<Table.HeaderCell>START DATE</Table.HeaderCell>
						<Table.HeaderCell>END DATE</Table.HeaderCell>
						<Table.HeaderCell>PAID MINUTES</Table.HeaderCell>
						<Table.HeaderCell>PAY DATE</Table.HeaderCell>
						<Table.HeaderCell>REQUEST TYPE</Table.HeaderCell>
						<Table.HeaderCell>SUBMITTED</Table.HeaderCell>
						<Table.HeaderCell>NOTES</Table.HeaderCell>
						<Table.HeaderCell></Table.HeaderCell>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{
						this.props.requests.map((req, i) => {
						let name = req.node.userByRequestorId.firstName + " " +
											 req.node.userByRequestorId.lastName;
						return (
							<Table.Row key={i}>
								<Table.Cell>{name}</Table.Cell>
								<Table.Cell>{moment(req.node.startDate).format("MMM DD YYYY")}</Table.Cell>
								<Table.Cell>{moment(req.node.endDate).format("MMM DD YYYY")}</Table.Cell>
								<Table.Cell>{req.node.minutesPaid}</Table.Cell>
								<Table.Cell>{req.node.payDate ? moment(req.node.payDate).format("MMM DD YYYY") : "N/A"}</Table.Cell>
								<Table.Cell>{req.node.requestType}</Table.Cell>
								<Table.Cell>{moment(req.node.submissionDate).format("MMM DD YYYY")}</Table.Cell>
								<Table.Cell>
									{(!req.node.notes || req.node.notes == "") ?
                 	<span>None</span> : <NotePopup note={req.node.notes}/>}
								</Table.Cell>
								{this.props.filter=="PENDING" &&
								 <Table.Cell><span style={{color: 'blue', cursor: 'pointer'}} onClick={() => this.onDecide(req.node.id, "APPROVED")}> Approve </span> |
								 						 <span style={{color: 'blue', cursor: 'pointer'}} onClick={() => this.onDecide(req.node.id, "DENIED")}> Deny </span> </Table.Cell>
								}
								{this.props.filter!="PENDING" &&
								 <Table.Cell><span style={{color: 'blue', cursor: 'pointer'}} onClick={() => this.onDecide(req.node.id, "PENDING")}> Revoke </span></Table.Cell>
								}
							</Table.Row>)
						})
					}
				</Table.Body>
			</Table>
		);
	}
}

export default graphql(approveTimeOffRequestMutation)(TimeAttendanceTable);
