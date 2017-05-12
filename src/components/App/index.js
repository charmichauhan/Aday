import React from 'react';
import { renderRoutes } from 'react-router-config';

import { Divider, Grid, Container } from 'semantic-ui-react'

import Nav from './Nav'


const App = ({route}) => (
	<Container>
		<Grid>
			<Grid.Row>
				<Grid.Column width={4}><Nav/></Grid.Column>

				<Grid.Column width={12}>
					<Divider/>
					{renderRoutes(route.routes)}
				</Grid.Column>
			</Grid.Row>
		</Grid>
	</Container>
)

export default App
