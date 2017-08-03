import React, { Component } from 'react';
import Dropzone from 'react-dropzone';
import InputMask from 'react-input-mask';
import validator from 'validator';
import IconButton from 'material-ui/IconButton';

import AvatarEditor from '../../helpers/AvatarEditor';

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
  },
  errorFields: {}
};

let personalFields = {};
const fields = ['firstName', 'lastName', 'phoneNumber', 'email', 'currentPassword', 'newPassword'];
fields.forEach(field => personalFields[field] = field);

function hasError(field, value) {
  switch (field) {
    case personalFields.newPassword:
    case personalFields.currentPassword:
      return !validator.isAlphanumeric(value);
    default:
      return true;
  }

}

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
    console.log('Image upload code goes here');
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
    let phoneNumber = name === personalFields.phoneNumber && escapeHtml(value);
    const isValid = hasError(name, value);
    const user = Object.assign(this.state.user, { [name]: phoneNumber || value });
    const errorFields = Object.assign(this.state.errorFields, { [name]: isValid });
    return this.setState({ user, errorFields });
  };

  checkPasswords = () => {
    const { errorFields, user } = this.state;
    const isEqual = user[personalFields.currentPassword] === user[personalFields.newPassword];
    if (user[personalFields.currentPassword] && !isEqual) {
      errorFields[personalFields.currentPassword] = errorFields[personalFields.newPassword] = true;
      return this.setState({ errorFields });
    }
  };

  handleImageSave = (img) => {
  };

  render() {
    const { user, paymentOptions, showPassword, errorFields } = this.state;
    return (
      <div className="content personal-content">
        <h2 className="heading">Personal Information</h2>
        <div className="personal-info-img">
          <div className="personal-info">
            <form>
              <ul>
                <li>
                  <label htmlFor={personalFields.firstName}>First Name</label>
                  <input
                    className="form-control"
                    type="text"
                    name={personalFields.firstName}
                    onChange={this.handleInputChange}
                    value={user.firstName} />
                </li>
                <li>
                  <label htmlFor={personalFields.lastName}>Last Name</label>
                  <input
                    className="form-control"
                    type="text"
                    name={personalFields.lastName}
                    onChange={this.handleInputChange}
                    value={user.lastName} />
                </li>
                <li>
                  <label htmlFor={personalFields.phoneNumber}>Phone Number</label>
                  <InputMask
                    onChange={this.handleInputChange}
                    className="form-control"
                    name={personalFields.phoneNumber}
                    value={user.phoneNumber}
                    mask="+1-(999) 999 9999" maskChar=" " />
                </li>
                <li>
                  <label htmlFor={personalFields.email}>Email address</label>
                  <input
                    className="form-control"
                    type="email"
                    name={personalFields.email}
                    onChange={this.handleInputChange}
                    value={user.email} />
                </li>
                <li className={(errorFields.currentPassword && 'has-error') || ''}>
                  <label htmlFor={personalFields.currentPassword}>Current Password</label>
                  <div className="field-password-view">
                    <input
                      className="form-control"
                      name={personalFields.currentPassword}
                      onChange={this.handleInputChange}
                      type={(showPassword.currentPassword && 'text') || 'password'} />
                    <IconButton onClick={() => this.handleShowPassword('currentPassword')}>
                      <img
                        className="input-inline-icon"
                        alt=""
                        src={(showPassword.currentPassword && '/images/no-view.png') || '/images/view.png'} />
                    </IconButton>
                  </div>
                </li>
                <li className={(errorFields.newPassword && 'has-error') || ''}>
                  <label htmlFor={personalFields.newPassword}>New Password</label>
                  <div className="field-password-view">
                    <input
                      className="form-control"
                      name={personalFields.newPassword}
                      onChange={this.handleInputChange}
                      onBlur={this.checkPasswords}
                      type={(showPassword.newPassword && 'text') || 'password'} />
                    <IconButton onClick={() => this.handleShowPassword('newPassword')}>
                      <img
                        className="input-inline-icon"
                        alt=""
                        src={(showPassword.newPassword && '/images/no-view.png') || '/images/view.png'} />
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
            <AvatarEditor
              width={250}
              height={250}
              border={10}
              color={[74, 74, 74, 0.5]}
              onSave={this.handleImageSave}
              image={this.state.blob} />
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
