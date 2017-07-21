import React, { Component } from 'react'
import moment from 'moment'
import { Table } from 'semantic-ui-react'
import NotePopup from './NotePopup'
import { graphql } from 'react-apollo';
import { approveTimeOffRequestMutation, corporationTimeOffRequestQuery } from './TimeOffQueries'

class TimeAttendanceTable extends Component {
	constructor(props) {
    super(props);
    this.onApprove = this.onApprove.bind(this);
		this.onDeny = this.onDeny.bind(this);
		this.onRevoke = this.onRevoke.bind(this);
  }
	onApprove(props) {
		let data = {"data": {"clientMutationId": uuidv4(),
                     		 "timeOffRequest": {"id": uuidv4(),
                                 				"startDate": moment(this.state.firstDay, 'dddd, MMMM Do, YYYY').format(),
                               	     			"endDate": moment(this.state.lastDay, 'dddd, MMMM Do, YYYY').format(),
                                                "submissionDate": moment().format(),
                               	                "minutesPaid": (parseInt(this.state.vacationHours) + parseInt(this.state.personalHours)) * 60,
                               			        "decisionStatus": "PENDING",
                               			        "requestType": this.state.personalHours > 0 ? 'PERSONAL' : 'VACATION',
                                		        "corporationId": "3b14782b-c220-4927-b059-f4f22d01c230",
                               					"requestorId": "5b7323ac-e235-4edb-bbf9-97495d9a42a1",
                               					"payDate": this.state.payDay == "" ? null :
                               					           moment(this.state.payDay, 'dddd, MMMM Do, YYYY').format(),
                               					"notes": this.state.notes}}
		this.props.mutate({variables: data,
											 refetchQueries:[{query: corporationTimeOffRequestQuery,
                                        variables: {"corporationId": "3b14782b-c220-4927-b059-f4f22d01c230"}}]});
	}
	onDeny(props) {
		this.props.mutate();
	}
	onRevoke(props) {
		this.props.mutate();
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
								<Table.Cell><NotePopup note={req.node.notes}/></Table.Cell>
								{this.props.filter=="PENDING" &&
								 <Table.Cell><span style={{color: 'blue'}} onClick={this.onDeny}> Deny </span> |
								 						<span style={{color: 'blue'}} onClick={this.onApprove}> Approve </span></Table.Cell>
								}
								{this.props.filter!="PENDING" &&
								 <Table.Cell><span style={{color: 'blue'}} onClick={this.onRevoke}> Revoke </span></Table.Cell>
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
