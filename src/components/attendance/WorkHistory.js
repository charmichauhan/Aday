import React, { Component } from 'react'
import { Table } from 'semantic-ui-react'

export default class WorkHistory extends Component {
	state = {
		work_history: [
			{
				date: new Date("2017-05-29"),
				start_time: "08:00 AM",
				end_time: "04:00 PM",
				certification: "SUSHI CHEF",
				location: "CHAO CENTER",
				costs: "$503.43"
			}
		]
	}
	render() {
		return (
			<Table singleLine>
					<Table.Header>
						<Table.Row>
							<Table.HeaderCell>DATE</Table.HeaderCell>
							<Table.HeaderCell>START TIME</Table.HeaderCell>
							<Table.HeaderCell>END TIME</Table.HeaderCell>
							<Table.HeaderCell>CERTIFICATION</Table.HeaderCell>
							<Table.HeaderCell>LOCATION</Table.HeaderCell>
							<Table.HeaderCell>COSTS</Table.HeaderCell>
							<Table.HeaderCell></Table.HeaderCell>
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{
							this.state.work_history.map((wh, i) => (
								<Table.Row key={i}>
									<Table.Cell>{moment(wh.date).calendar()}</Table.Cell>
									<Table.Cell>{wh.start_time}</Table.Cell>
									<Table.Cell>{wh.end_time}</Table.Cell>
									<Table.Cell>{wh.certification}</Table.Cell>
									<Table.Cell>{wh.location}</Table.Cell>
									<Table.Cell>{wh.costs}</Table.Cell>
									<Table.Cell>edit | Count</Table.Cell>
								</Table.Row>
							))
						}
					</Table.Body>
				</Table>
		);
	}
}
