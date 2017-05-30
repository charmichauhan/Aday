import React, { Component } from 'react'
import { Table } from 'semantic-ui-react'

export default class Policies extends Component {
	constructor(){
		super()
		this.state = {
			policies : [
				{
					policy_name: "8 Hours Day Limit",
					value: "8 Hours",
					audience: "14 Employees",
					location: "Chao Center",
					date_issued: "Mar 17 2017",
					issued_by: "J. Moody"
				},
				{
					policy_name: "30 Hours Week Limit",
					value: "30 Hours",
					audience: "38 Employees",
					location: "Chao Center",
					date_issued: "Mar 17 2017",
					issued_by: "F. Newman"
				}
			]
		}
	}
	render() {
		return (
			<div>
				<Table singleLine>
					<Table.Header>
						<Table.Row>
							<Table.HeaderCell>POLICY</Table.HeaderCell>
							<Table.HeaderCell>VALUE</Table.HeaderCell>
							<Table.HeaderCell>AUDIENCE</Table.HeaderCell>
							<Table.HeaderCell>LOCATION</Table.HeaderCell>
							<Table.HeaderCell>DATE ISSUED</Table.HeaderCell>
							<Table.HeaderCell>ISSUED BY</Table.HeaderCell>
							<Table.HeaderCell></Table.HeaderCell>
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{
							this.state.policies.map((policy, i) => (
								<Table.Row key={i}>
									<Table.Cell>{policy.policy_name}</Table.Cell>
									<Table.Cell>{policy.value}</Table.Cell>
									<Table.Cell>{policy.audience}</Table.Cell>
									<Table.Cell>{policy.location}</Table.Cell>
									<Table.Cell>{policy.date_issued}</Table.Cell>
									<Table.Cell>{policy.issued_by}</Table.Cell>
									<Table.Cell>edit | delete</Table.Cell>
								</Table.Row>
							))
						}
					</Table.Body>
				</Table>
			</div>
		);
	}
}
