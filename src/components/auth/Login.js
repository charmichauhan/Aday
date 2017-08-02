import React, { Component } from 'react';
import './style/style.css';

export default class Login extends Component {
	render() {
		return (
			<div>
				<section id="wrapper" className="new-login-register">
					<div className="lg-info-panel">
						<div className="inner-panel">
							<div className="lg-content">
								<h2>YOUR FAVORITE WORKDAY, EVERYDAY</h2>
								<div>
									<a href="https://itunes.apple.com" target="_blank">
										<img alt="Apple Itunes store" src="/images/apple_appstore.png" />
									</a>
									<a href="https://play.google.com/" target="_blank">
										<img alt="Google Play" src="/images/google_play.png" />
									</a>
								</div>
							</div>
						</div>
					</div>
					<div className="new-login-box">
					<div className="white-box">
						<img width="66" src="/images/logos_aday.png" /><br/><br/>
						<h3 className="box-title m-b-0">Sign In to Aday</h3>
						<medium>Enter your information below</medium>
						<form className="form-horizontal new-lg-form" id="loginform" action="">
							<div className="form-group  m-t-20">
								<div className="col-xs-12">
									<label>Email Address</label>
									<input className="form-control" type="text" required="" placeholder="Username" />
								</div>
							</div>
							<div className="form-group">
								<div className="col-xs-12">
								<label>Password</label>
								<input className="form-control" type="password" required="" placeholder="Password" />
								</div>
							</div>
							<div className="form-group">
								<div className="col-md-12">
								<div className="checkbox checkbox-info pull-left p-t-0">
									<input id="checkbox-signup" type="checkbox" />
									<label htmlFor="checkbox-signup"> Remember me </label>
								</div>
								<a href="javascript:void(0)" id="to-recover" className="text-dark pull-right"><i className="fa fa-lock m-r-5"></i> Forgot password?</a> </div>
							</div>
							<div className="form-group text-center m-t-20">
								<div className="col-xs-12">
								<button className="btn btn-info btn-lg btn-block btn-rounded text-uppercase waves-effect waves-light" type="submit">Log In</button>
								</div>
							</div>
							<div className="row">
							</div>
							<div className="form-group m-b-0">
								<div className="col-sm-12 text-center">
								<p>Don't have an account? <a href="register.html" className="text-primary m-l-5"><b>Sign Up</b></a></p>
								</div>
							</div>
						</form>
						<form className="form-horizontal" id="recoverform" action="">
							<div className="form-group ">
								<div className="col-xs-12">
								<h3>Recover Password</h3>
								<p className="text-muted">Enter your Email and instructions will be sent to you! </p>
								</div>
							</div>
							<div className="form-group ">
								<div className="col-xs-12">
								<input className="form-control" type="text" required="" placeholder="Email" />
								</div>
							</div>
							<div className="form-group text-center m-t-20">
								<div className="col-xs-12">
								<button className="btn btn-primary btn-lg btn-block text-uppercase waves-effect waves-light" type="submit">Reset</button>
								</div>
							</div>
						</form>
					</div>
					</div>            
				</section>
			</div>
		);
	}
}
