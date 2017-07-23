import React, { Component } from 'react';
import { Menu, Button } from 'semantic-ui-react'
import { NavLink } from 'react-router-dom'

export default class MainMenu extends Component {
	render() {
		return (
			<div className="aday-container">
				<Menu secondary fluid  size='mini'>
					<Menu.Item as={NavLink} to="/">
						<img
							className="logo"
							src="/images/logos_aday.png"
							alt="aday logo"/>
					</Menu.Item>
					<Menu.Menu position="right">
						<Menu.Item as={NavLink} to="/" name="HOME"/>
						<Menu.Item as={NavLink} to="/blog"name="BLOG"/>
						<Menu.Item as={NavLink} to="/contacts" name="CONTACTS"/>
						<Menu.Item as={NavLink} to="/schedule/team">
							<Button primary>LOGIN</Button>
						</Menu.Item>
					</Menu.Menu>
				</Menu>

			</div>
		);
	}
}
