import React, { Component } from 'react'
import { Container } from 'semantic-ui-react'

import Menu from './Menu'
import Banner from './home/Banner'
import Features from './home/Features'
import Brands from './home/Brands'
import Footer from './Footer'

export default class Home extends Component {
	render() {
		return (
			<div>
			<Container 
			fluid 
				textAlign="center">
				<Menu/>
				<Banner/>
				<Features/>
				<Brands/>
				<Footer/>
			</Container>
			</div>
		);
	}
}
