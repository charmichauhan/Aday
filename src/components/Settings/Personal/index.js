import React, { Component } from 'react';
import Dropzone from 'react-dropzone';
import InputMask from 'react-input-mask';
import FontIcon from 'material-ui/FontIcon';
import IconButton from 'material-ui/IconButton';

import Avatar from '../../helpers/Avatar/index';
const initialState = {
	paymentOptions: [{
		id: 1,
		name: 'paypal',
		logo: '/images/paypal-icon.png',
		text: 'Send Payment'
	}],
	showPassword: {
		currentPassword: false,
		newPassword: false
	}
};

export default class Personal extends Component {
	constructor(props) {
		super(props);
		this.state = {
			...initialState,
			user: props.user
		};
	}

	handleShowPassword = (passwordType) => {
		const showPassword = this.state.showPassword;
		showPassword[passwordType] = !showPassword[passwordType];
		this.setState({ showPassword });
	};

	handleImageUpload = (files) => {
		// Image uploading code to be done here
		console.log('Image upload button clicked');
		this.setState({ blob: files[0] });
	};

	handleInputChange = (event) => {
		function escapeHtml(unsafe) {
			return unsafe
			.replace(/\+/g, '')
			.replace(/-/g, '')
			.replace(/\(/g, '')
			.replace(/\)/g, '')
			.replace(/ /g, '');
		}
		const { name, value } = event.target;
		let phoneNumber = name === 'phoneNumber' && escapeHtml(value);
		const user = Object.assign(this.state.user, { [name]: phoneNumber || value });
		return this.setState({ user });
	};

	render() {
		const { user, paymentOptions, showPassword } = this.state;
		return (
			<div className="content personal-content">
				<h2 className="heading">Personal Information</h2>
				<div className="personal-info-img">
					<div className="personal-info">
						<form>
							<ul>
								<li>
									<label htmlFor="firstName">First Name</label>
									<input
										className="form-control"
										type="text"
										name="firstName"
										onChange={this.handleInputChange}
										value={user.firstName} />
								</li>
								<li>
									<label htmlFor="lastName">Last Name</label>
									<input
										className="form-control"
										type="text"
										name="lastName"
										onChange={this.handleInputChange}
										value={user.lastName} />
								</li>
								<li>
									<label htmlFor="phoneNumber">Phone Number</label>
									<InputMask
										onChange={this.handleInputChange}
										className="form-control"
										name="phoneNumber"
										value={user.phoneNumber}
										mask="+1-(999) 999 9999" maskChar=" " />
								</li>
								<li>
									<label htmlFor="email">Email address</label>
									<input
										className="form-control"
										type="email"
										name="email"
										onChange={this.handleInputChange}
										value={user.email} />
								</li>
								<li>
									<label htmlFor="currentPassword">Current Password</label>
									<div className="field-password-view">
										<input
										className="form-control"
										name="currentPassword"
										onChange={this.handleInputChange}
										type={(showPassword.currentPassword && 'text') || 'password'} />
										<IconButton	onClick={() => this.handleShowPassword('currentPassword')} >
											<img
												className="input-inline-icon"
												src={(showPassword.currentPassword && "/images/no-view.png") || "/images/view.png"} />
										</IconButton>
									</div>
								</li>
								<li>
									<label htmlFor="newPassword">New Password</label>
									<div className="field-password-view">
										<input
											className="form-control"
											name="newPassword"
											onChange={this.handleInputChange}
											type={(showPassword.newPassword && 'text') || 'password'} />
										<IconButton	onClick={() => this.handleShowPassword('newPassword')} >
											<img
												className="input-inline-icon"
												src={(showPassword.newPassword && "/images/no-view.png") || "/images/view.png"} />
										</IconButton>
									</div>

								</li>
							</ul>
						</form>
					</div>
					{!this.state.blob && <div className="personal-img">
						<Dropzone
							multiple={false}
							accept="image/*"
							onDrop={this.handleImageUpload}
							style={{}}>
							<div className="personal-img-icon">
								<i><img src="/images/camera-icon.png" alt="Upload Image" /></i>
							</div>
						</Dropzone>
					</div>}
					{this.state.blob && <div className="personal-img">
						<Avatar src={this.state.blob.preview} size='large'/>
					</div>}
				</div>
				{/*<div className="payment-option">
					<h2 className="heading">PAYMENT OPTIONS</h2>
					{paymentOptions && paymentOptions.map(payment => (
						<div key={payment.id} className="payment-service">
							<i><img src={payment.logo} alt={payment.name} /></i>
							<span>{payment.name || 'Send Payment'}</span>
						</div>
					))}
				</div>*/}
			</div>
		)
	}
}
