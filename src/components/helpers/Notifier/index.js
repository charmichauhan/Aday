import React, { Component } from 'react';
import Snackbar from 'material-ui/Snackbar';

import { notificationStyles } from '../../styles';

export const NOTIFICATION_LEVELS  = {
  ERROR: 'error',
  SUCCESS: 'success',
  WARNING: 'warning',
  INFO: 'info'
};

const notificationDuration = 4000;
const notificationLevels = ['', ...Object.values(NOTIFICATION_LEVELS)];
const initialState = {
  notify: false,
  notificationType: '',
  notificationMessage: '',
  customStyle: {}

};

export default class Notifier extends Component {

  static propTypes = {
    notificationMessage: React.PropTypes.string,
    notificationType: React.PropTypes.oneOf(notificationLevels),
    notify: React.PropTypes.bool.isRequired,
    customStyle: React.PropTypes.object
  };

  constructor(props) {
    super(props);
    this.state = {
      ...initialState
    }
  }

  componentWillReceiveProps(nextProps) {
    const { notify, notificationMessage, notificationType } = nextProps;
    if (notify && notificationMessage && this.state.notificationMessage !== notificationMessage) {
      this.setState({ notify, notificationMessage, notificationType });
    }
  }

  getStyleByType = (type) => {
    let style;
    if (type === NOTIFICATION_LEVELS.SUCCESS) {
      style = notificationStyles.success;
    } else if (type === NOTIFICATION_LEVELS.ERROR) {
      style = notificationStyles.error;
    } else if (type === NOTIFICATION_LEVELS.WARNING) {
      style = notificationStyles.warning;
    } else {
      style = notificationStyles.success;
    }
    if (this.props.customStyle) {
      return { style, ...this.props.customStyle };
    }
    return style;
  };

  handleRequestClose = () => {
    this.setState({
      notify: false,
      notificationMessage: ''
    });
    this.props.hideNotification();
  };

  render() {
    return (
      <Snackbar
        open={this.state.notify}
        message={this.state.notificationMessage}
        autoHideDuration={notificationDuration}
        bodyStyle={this.getStyleByType(this.state.notificationType)}
        onRequestClose={this.handleRequestClose}
      />
    );
  }
}
