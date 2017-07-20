import React, { Component } from 'react';

const initialState = {
	paymentOptions: [{
		id: 1,
		name: 'paypal',
		logo: '/images/paypal-icon.png',
		text: 'Send Payment'
	}]
};

export default class Workplace extends Component {
	constructor(props) {
		super(props);
		this.state = {
			...initialState,
			user: props.user
		};
	}

	handleImageUploadClick = (event) => {
		// Image uploading code to be done here
		console.log('Image upload button clicked');
	};

	handleInputChange = (event) => {
		const { name, value } = event.target;
		const user = Object.assign(this.state.user, { [name]: value });
		return this.setState({ user });
	};

	render() {
		const { user, paymentOptions } = this.state;
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
									<input
										className="form-control"
										type="text"
										name="phoneNumber"
										onChange={this.handleInputChange}
										value={user.phoneNumber} />
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
									<input
										className="form-control"
										name="currentPassword"
										onChange={this.handleInputChange}
										type="password" />
								</li>
								<li>
									<label htmlFor="newPassword">New Password</label>
									<input
										className="form-control"
										name="newPassword"
										onChange={this.handleInputChange}
										type="password" />
								</li>
							</ul>
						</form>
					</div>
					<div className="personal-img">
						<div className="personal-img-icon" onClick={this.handleImageUploadClick}>
							<i><img src="/images/camera-icon.png" alt="Upload Image" /></i>
						</div>
					</div>
				</div>
				<div className="payment-option">
					<h2 className="heading">PAYMENT OPTIONS</h2>
					{paymentOptions && paymentOptions.map(payment => (
						<div key={payment.id} className="payment-service">
							<i><img src={payment.logo} alt={payment.name} /></i>
							<span>{payment.name || 'Send Payment'}</span>
						</div>
					))}
				</div>
			</div>
		)
	}
}
