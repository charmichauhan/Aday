import React from 'react';
import { renderRoutes } from 'react-router-config';
import { Divider, Grid, Container } from 'semantic-ui-react'
import Nav from './Nav'
const App = ({route}) => (
	<Container fluid>
		<Grid>
			<Grid.Row>
				<Grid.Column width={3} className="left-content"><Nav/></Grid.Column>
				<Grid.Column width={12} className="main-content">
					{renderRoutes(route.routes)}
				</Grid.Column>
			</Grid.Row>
		</Grid>
	</Container>
)
export default App
