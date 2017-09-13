import React, { Component } from 'react';
import Dropzone from 'react-dropzone';
import InputMask from 'react-input-mask';
import validator from 'validator';
import IconButton from 'material-ui/IconButton';
import { withApollo } from 'react-apollo';
import pick from 'lodash/pick';

import Loading from '../../helpers/Loading';
import AvatarEditor from '../../helpers/AvatarEditor';
import Notifier, { NOTIFICATION_LEVELS } from '../../helpers/Notifier';
import { personalResolvers } from '../settings.resolvers';
import CircleButton from '../../helpers/CircleButton';
import SuperAgent from 'superagent';

const initialState = {
  paymentOptions: [{
    id: 1,
    name: 'paypal',
    logo: '/images/paypal-icon.png',
    text: 'Send Payment'
  }],
  notify: false,
  notificationType: '',
  notificationMessage: '',
  showPassword: {
    currentPassword: false,
    newPassword: false
  },
  errorFields: {}
};

let personalFields = {};
const fields = ['id', 'firstName', 'lastName', 'userPhoneNumber', 'userEmail', 'avatarUrl', 'currentPassword', 'newPassword'];
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

class Personal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ...initialState,
      userId: localStorage.getItem('userId')
    };
  }

  componentDidMount() {
    this.props.client.query({
      query: personalResolvers.userInfoQuery,
      variables: {
        id: this.state.userId
      }
    }).then((res) => {
      if (res.data && res.data.userById) this.setState({ userInfo: res.data.userById });
    }).catch(err => this.showNotification('An error occurred.', NOTIFICATION_LEVELS.ERROR));
  }

  showNotification = (message, type) => {
    this.setState({
      notify: true,
      notificationType: type,
      notificationMessage: message
    });
  };

  hideNotification = () => {
    this.setState({
      notify: false,
      notificationType: '',
      notificationMessage: ''
    });
  }

  handleUpdateInfo = () => {
    const userInfo = pick(this.state.userInfo, fields);
    this.props.client.mutate({
      mutation: personalResolvers.updateUserMutation,
      variables: {
        id: userInfo.id,
        userInfo: userInfo
      }
    }).then((res) => {
      this.showNotification('Personal details updated successfully.', NOTIFICATION_LEVELS.SUCCESS);
    }).catch(err => this.showNotification('An error occurred.', NOTIFICATION_LEVELS.ERROR));
  };

  handleShowPassword = (passwordType) => {
    const showPassword = this.state.showPassword;
    showPassword[passwordType] = !showPassword[passwordType];
    this.setState({ showPassword });
  };

  handleDrop = (files) => {
    this.setState({ blob: files[0] });
  };

  handleImageUpload = (files) => {
    console.log(files);
    //when api feature added to prod: https://20170808t142850-dot-forward-chess-157313.appspot.com/api/uploadImg/
    SuperAgent.post('https://20170808t142850-dot-forward-chess-157313.appspot.com/api/uploadImage')
    .field('bucket', 'aday-user')
    .field('filename', localStorage.getItem('userId'))
    .field('id', localStorage.getItem('userId'))
    .field('table', 'user')
    .field('column', 'avatar_url')
    .attach("theseNamesMustMatch", files[0])
    .end((err, res) => {
      if (err) console.log(err);
      alert('File uploaded!');
    })
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
    let phoneNumber = name === personalFields.userPhoneNumber && escapeHtml(value);
    const isValid = hasError(name, value);
    const userInfo = Object.assign({}, this.state.userInfo, { [name]: phoneNumber || value });
    const errorFields = Object.assign({}, this.state.errorFields, { [name]: isValid });
    return this.setState({ userInfo, errorFields });
  };

  checkPasswords = () => {
    const { errorFields, userInfo } = this.state;
    const isEqual = userInfo[personalFields.currentPassword] === userInfo[personalFields.newPassword];
    if (userInfo[personalFields.currentPassword] && !isEqual) {
      errorFields[personalFields.currentPassword] = errorFields[personalFields.newPassword] = true;
      return this.setState({ errorFields });
    }
  };

  handleImageSave = (img) => {
    this.handleImageUpload(img);
  };

  render() {
    const { paymentOptions, userInfo, showPassword, errorFields, notify, notificationMessage, notificationType } = this.state;
    if (!userInfo) {
      return (<Loading />);
    }
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
                    value={userInfo.firstName} />
                </li>
                <li>
                  <label htmlFor={personalFields.lastName}>Last Name</label>
                  <input
                    className="form-control"
                    type="text"
                    name={personalFields.lastName}
                    onChange={this.handleInputChange}
                    value={userInfo.lastName} />
                </li>
                <li>
                  <label htmlFor={personalFields.userPhoneNumber}>Phone Number</label>
                  <InputMask
                    onChange={this.handleInputChange}
                    className="form-control"
                    name={personalFields.userPhoneNumber}
                    value={userInfo.userPhoneNumber}
                    mask="+1-(999) 999 9999" maskChar=" " />
                </li>
                <li>
                  <label htmlFor={personalFields.userEmail}>Email address</label>
                  <input
                    className="form-control"
                    type="email"
                    name={personalFields.userEmail}
                    onChange={this.handleInputChange}
                    value={userInfo.userEmail} />
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
          {!userInfo.avatarUrl && <div className="personal-img">
            <Dropzone
              multiple={false}
              accept="image/*"
              onDrop={this.handleImageDrop}
              style={{}}>
              <div className="personal-img-icon">
                <i><img src="/images/camera-icon.png" alt="Upload Image" /></i>
              </div>
            </Dropzone>
          </div>}
          {(userInfo.avatarUrl || this.state.blob) && <div className="personal-img">
            <AvatarEditor
              width={250}
              height={250}
              border={10}
              color={[74, 74, 74, 0.5]}
              onSave={this.handleImageSave}
              image={userInfo.avatarUrl || this.state.blob} />
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
        <div className="btn-circle-center">
          <CircleButton handleClick={this.handleUpdateInfo} type="blue"
                        title="Update info" />
        </div>
        <Notifier hideNotification={this.hideNotification} notify={notify} notificationMessage={notificationMessage} notificationType={notificationType} />
      </div>
    )
  }
}

export default withApollo(Personal);
