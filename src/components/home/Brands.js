import React, { Component } from 'react'
import { Header, Image } from 'semantic-ui-react'

export default class Brands extends Component {
	render() {
		return (
			<div className="aday-brands">
				<Header as="h2" textAlign="center"> BRANDS WE WORK WITH</Header>
				<Image.Group size='tiny'>
					<Image src="/images/brands/ra.png"/>
					<Image src="/images/brands/securitas.png"/>
					<Image src="/images/brands/dunkin.png"/>
					<Image src="/images/brands/compass.png"/>
					<Image src="/images/brands/planet-fitness.png"/>
				</Image.Group>
			</div>
		);
	}
}
