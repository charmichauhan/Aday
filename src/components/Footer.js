import React, { Component } from 'react'
import { Container, Menu, Divider } from 'semantic-ui-react'

export default class Footer extends Component {
	render() {
		return (
			<Container>
				<div className="aday-footer-menu">
					<Menu secondary text fluid>
						<Menu.Item name="BLOG"/>
						<Menu.Item name="ABOUT"/>
						<Menu.Item icon="facebook"/>
						<Menu.Item icon="twitter"/>
						<Menu.Item icon="instagram"/>
					</Menu>
				</div>
				<Divider/>
				<div className="aday-terms">
					<Menu secondary fluid>
						<Menu.Item name="Copy right 2017 Aday Technologies, Inc."/>
						<Menu.Item name="Privacy Policy"/>
						<Menu.Item name="Terms of Use"/>
					</Menu>
				</div>
			</Container>
		);
	}
}
