import React, { Component } from 'react';
import { Menu, Button } from 'semantic-ui-react'

export default class MainMenu extends Component {
	render() {
		return (
			<div>
				<Menu secondary fluid  size='mini'>
					<Menu.Item>
						<img 
							className="logo"
							src="/images/logos_aday.png" 
							alt="aday logo"/>
					</Menu.Item>
					<Menu.Menu position="right">
						<Menu.Item name="HOME"/>
						<Menu.Item name="BLOG"/>
						<Menu.Item name="CONTACTS"/>
						<Menu.Item>
							<Button primary>LOGIN</Button>
						</Menu.Item>
					</Menu.Menu>
				</Menu>
				
			</div>
		);
	}
}
