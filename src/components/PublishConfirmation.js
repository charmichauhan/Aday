import React, { Component } from 'react';
import { Image, Divider, Header } from 'semantic-ui-react';

export default class DeleteConfirmationTemplate extends Component {
	render() {
		return (
			<div>
				<Header as='h2' style={{ textAlign: 'center', color: '#0022A1' }}>
					CONFIRM
					<Image
						height="90%"
						width="90%"
						floated="right"
						src="/images/Assets/Icons/Buttons/delete-round-small.png" shape="circular"
						style={{ top: -11, right: -68 }}
						onClick={this.props.func} />
				</Header>
				<Divider style={{ marginTop: '5%' }} />
				<div style={{ marginTop: '4%' }}>
					<p style={{ fontSize: '20px', fontStyle: 'normal', color: 'rgba(0, 0, 0, 0.87)' }}>
						Are you sure that you want to publish shifts to employees?
					</p>
					<div>
						<Image.Group>
							<Image
								src="/images/Assets/Icons/Buttons/go-back-button.png"
								shape="circular"
							/>
							<Image
								src="/images/Assets/Icons/Buttons/confirm-button.png"
								shape="circular"
							/>
						</Image.Group>
					</div>
				</div>
			</div>
		);
	}
}
