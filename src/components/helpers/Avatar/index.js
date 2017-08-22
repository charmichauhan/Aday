import React, { Component } from 'react'

import { Image } from 'semantic-ui-react'
import './avatar.css'
export default class Avatar extends Component {
	render() {
		const {
			src = "http://www.finearttips.com/wp-content/uploads/2010/05/avatar.jpg", 
			size = "mini", 
			type = "avatar-inline",
			shape = "circular", 
			first_name, 
			last_name, 
			description = "" } = this.props
		return (
			<div className={type}>
				<Image src={src} size={size} shape={shape}/>
				<div className="avatar-title">
					<div className="avatar-name">
						<b>{first_name}</b> <br/>{last_name}
					</div>
				</div>
				<small>{description}</small>
			</div>
		);
	}
}
