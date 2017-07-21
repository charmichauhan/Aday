import React, { Component } from 'react';
import { Image, Icon } from 'semantic-ui-react';

export default class TeamMemberCard extends Component {
	render() {
		const { avatar, firstName, otherNames, content, color } = this.props
		return (
			<div className="teamMemberCard">
				<div className="edits">
					<Icon name="close"/>
				</div>
				<div className={"content "+color}>
					<div className="avatar">
						<Image avatar src={avatar}/>
					</div>
					<div className="label">
						<b>{firstName}</b> {otherNames} <br/>
						<span className="description">{ content }</span>
					</div>
				</div>
			</div>
		);
	}
}
