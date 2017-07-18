import React, { Component } from 'react'
import camericon from '../../../../public/images/camer-icon.png'
import PayPal from '../../../../public/images/paypal-icon.png'
const initialState = {
	paymentOptions: [{
		id: 1,
		name: 'paypal',
		logo: 'logo'
	}]
};

export default class Workplace extends Component {
	constructor(props) {
		super(props);
		this.state = initialState;
	}

	render() {
		return (
			<div className="content personal-content">
				<h2 className="heading">Personal Information</h2>
				<div className="personal-info-img">
					<div className="personal-info">
						<form>
							<ul>
								<li>
									<label htmlFor="">First Name</label>
									<input className="form-control" type="text" placeholder="Billy" />
								</li>
								<li>
									<label htmlFor="">Last Name</label>
									<input className="form-control" type="text" placeholder="Buchanan" />
								</li>
								<li>
									<label htmlFor="">Phone Number</label>
									<input className="form-control" type="text" placeholder="+1-(###) ###-####" />
								</li>
								<li>
									<label htmlFor="">Email address</label>
									<input className="form-control" type="email" placeholder="billy.buchanan@gmail.com" />
								</li>
								<li>
									<label htmlFor="">Current Password</label>
									<input className="form-control" type="password"/>
								</li>
								<li>
									<label htmlFor="">New Password</label>
									<input className="form-control" type="password" />
								</li>
							</ul>
						</form>
					</div>10px 40px 20px
					<div className="personal-img">
						<div className="personal-img-icon">
							<i><img src={camericon} alt="" /></i>
						</div>
					</div>
				</div>
				<div className="payment-option">
					<h2 className="heading">PAYMENT OPTIONS</h2>
					<div className="paypal-ment">
						<i><img src={PayPal} alt="" /></i>
						<span>Send Payment</span>
					</div>
				</div>
			</div>
		)
	}
}
