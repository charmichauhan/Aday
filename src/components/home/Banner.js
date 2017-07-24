import React, { Component } from 'react'
import { Image, Header } from 'semantic-ui-react'


export default class Banner extends Component {
	render() {
		return (
			<div className="aday-banner">
				<Header as='h1'>Yep, someone called in for their shift again</Header>
				<small>Instantly text message all qualified staff at multiple store locations for same-day backfills</small>
				
				<div className="app-download">
					<Image.Group size="small">
						<Image src="/App_Store_Badge_US-UK.svg"/>
						<Image src="/google-play-badge.png"/>
					</Image.Group>
				</div>
				
				<Image 
					size="large"
					src="/images/phones.png" alt="p" centered/>
			</div>
		);
	}
}
