import React, { Component } from 'react'
import moment from 'moment'
import { Table, Checkbox } from 'semantic-ui-react'


export default class TimeAttendaceTable extends Component {
	state = {
		attendance_requests: [
			{
				name: "Jose Cortez",
				certification: "Line Cook",
				date: new Date(2017, 3, 17)
			}
		]
	}
	render() {
		console.log(this.state)
		return (
			<Table singleLine compact size="small">
				<Table.Header>
					<Table.Row>
						<Table.HeaderCell><Checkbox/></Table.HeaderCell>
						<Table.HeaderCell>NAME</Table.HeaderCell>
						<Table.HeaderCell>CERTIFICATION</Table.HeaderCell>
						<Table.HeaderCell>DATE</Table.HeaderCell>
						<Table.HeaderCell>SUBMITTED</Table.HeaderCell>
						<Table.HeaderCell></Table.HeaderCell>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{
						this.state.attendance_requests.map((req, i) => (
							<Table.Row key={i}>
								<Table.Cell><Checkbox/></Table.Cell>
								<Table.Cell>{req.name}</Table.Cell>
								<Table.Cell>{req.certification}</Table.Cell>
								<Table.Cell>{moment(req.date).format("MMM DD YYYY")}</Table.Cell>
								<Table.Cell>{moment(req.date).fromNow()}</Table.Cell>
								<Table.Cell>calendar | Deny | Approve</Table.Cell>
							</Table.Row>
						))
					}
				</Table.Body>
			</Table>
		);
	}
}
