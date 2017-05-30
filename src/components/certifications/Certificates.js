import React, { Component } from 'react'
import { Table } from 'semantic-ui-react'

export default class Certificates extends Component {
	constructor(){
		super()
		this.state = {
			certificates : [
				{
					certification: "Cashier",
					description: "Certifies employees on chash register at Chao Center",
					workplace: "Chao Center",
					date_issued: "Mar 17 2017",
					training: "5 Shifts"
				},
				{
					certification: "Bakery",
					description: "Certifies backery of all goods at Chao Center ",
					workplace: "Chao Center",
					date_issued: "Mar 17 2017",
					training: "3 Shifts"
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
							<Table.HeaderCell>CERTIFICATION</Table.HeaderCell>
							<Table.HeaderCell>DESCRIPTION</Table.HeaderCell>
							<Table.HeaderCell>WORKPLACE</Table.HeaderCell>
							<Table.HeaderCell>DATE ISSUED</Table.HeaderCell>
							<Table.HeaderCell>TRAINING</Table.HeaderCell>
							<Table.HeaderCell></Table.HeaderCell>
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{
							this.state.certificates.map((certificate, i) => (
								<Table.Row key={i}>
									<Table.Cell>{certificate.certification}</Table.Cell>
									<Table.Cell>{certificate.description}</Table.Cell>
									<Table.Cell>{certificate.workplace}</Table.Cell>
									<Table.Cell>{certificate.date_issued}</Table.Cell>
									<Table.Cell>{certificate.training}</Table.Cell>
									<Table.Cell>calendar | edit | delete</Table.Cell>
								</Table.Row>
							))
						}
					</Table.Body>
				</Table>
			</div>
		);
	}
}
