import React, { Component } from 'react';
import './style/style.css';
import { gql, graphql, compose } from 'react-apollo';



class LoginComponent extends Component {

  constructor(props){
    super(props);
    this.state = {email: '', password: '', badLogin: false};
    this. handleEmailChange = this. handleEmailChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.login=this.login.bind(this);
  }


  handleEmailChange(event) {
    this.setState({email: event.target.value});
  }

   handlePasswordChange(event) {
    this.setState({password: event.target.value});
  }


  login(){
  		document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
	     this.props.mutate({
	          variables: { data: {
	          	email: this.state.email,
	          	password: this.state.password
	          }
	        }
	      }).then(({ data }) => {
                  if (data.authenticate.jwt){
                  	document.cookie = "token="+ data.authenticate.jwt;
                  	localStorage.setItem("email", this.state.email);
                   	this.props.history.push('/schedule/team');
                  }else{
                  	 this.setState({badLogin: true});
                  }
			}).catch((error) => {
				  document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                  console.log('there was an error sending the query', error);
              });
	  }

	
	render() {
		let error = (<div></div>)
		if(this.state.badLogin){
			error = (<div style={{color: 'red'}}> email or password not found </div>)
		}
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
							<div className="form-group  m-t-20">
								<div className="col-xs-12">
									<p> {error} </p>
									<label>Email Address</label>
									<input className="form-control" type="text" required="" placeholder="Username"  value={this.state.email} onChange={this.handleEmailChange}/>
								</div>
							</div>
							<div className="form-group">
								<div className="col-xs-12">
								<label>Password</label>
								<input className="form-control" type="password" required="" placeholder="Password" value={this.state.password} onChange={this.handlePasswordChange}/>
								</div>
							</div>
							<div  className="form-group">
								<div className="col-xs-12">
								<p> </p>
								</div>
							</div>
							<div className="form-group text-center m-t-20">
								<div className="col-xs-12">
								<p> </p>
								<button onClick={() => this.login()} className="btn btn-info btn-lg btn-block btn-rounded text-uppercase waves-effect waves-light">Log In</button>
								</div>
							</div>
							<div className="row">
							</div>
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




const authenticate = gql
    `mutation authenticate($data: AuthenticateInput!){ 
        authenticate(input:$data) {
  				jwt
		}
	}`

const Login = graphql(authenticate)(LoginComponent)
export default Login



/*								<div className="col-md-12">
								<div className="checkbox checkbox-info pull-left p-t-0">
									<input id="checkbox-signup" type="checkbox" />
									<label htmlFor="checkbox-signup"> Remember me </label>
								</div>
								<a href="javascript:void(0)" id="to-recover" className="text-dark pull-right"><i className="fa fa-lock m-r-5"></i> Forgot password?</a> 
								</div>

															<div className="form-group m-b-0">
								<div className="col-sm-12 text-center">
								<p>Don't have an account? <a href="register.html" className="text-primary m-l-5"><b>Sign Up</b></a></p>
								</div>
							</div>
*/
