import React, { Component } from 'react'
import { Container } from 'semantic-ui-react'

import Banner from './home/Banner'
import Features from './home/Features'
import Brands from './home/Brands'
import Menu from './Menu';
export default class Home extends Component {
	render() {
		return (
			<div>
			<Container fluid textAlign="center">
				<Menu/>
				<Banner/>
				<Features/>
				<Brands/>
			</Container>
			</div>
		);
	}
}
