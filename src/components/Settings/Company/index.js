import React, { Component } from 'react'
import { List, ListItem } from 'material-ui/List';
import Edit from 'material-ui/svg-icons/image/edit';
import IconButton from 'material-ui/IconButton';
import { withApollo } from 'react-apollo';
import pick from 'lodash/pick';

import EditCorporationDrawer from './EditCorporationDrawer';
import { corporationResolvers } from '../settings.resolvers';
import Loading from '../../helpers/Loading';
import Notifier, { NOTIFICATION_LEVELS } from '../../helpers/Notifier';
import { colors } from '../../styles';

const styles = {
  drawer: {
    width: 600
  },
  iconStyles: {
    margin: '5px 6px',
    width: 36,
    height: 36
  }
};

const corporationFields = ['id', 'corporationName'];

const initialState = {
  open: false,
  notify: false,
  notificationType: '',
  notificationMessage: '',
  drawerCorporation: {
    id: '',
    corporationName: ''
  },
  corporationId: localStorage.getItem('corporationId')
};

class Corporation extends Component {
  constructor(props) {
    super(props);
    this.state = initialState;
  }

  componentDidMount() {
    this.props.client.query({
      query: corporationResolvers.getCorporationQuery,
      variables: {
        id: this.state.corporationId
      }
    }).then((res) => {
      if (res.data && res.data.corporationById) this.setState({ corporationInfo: res.data.corporationById });
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

  handleEditClick = (corporation) => {
    this.setState({ open: true, drawerCorporation: corporation });
  };

  handleSubmit = (corporation) => {
    this.props.client.mutate({
      mutation: corporationResolvers.updateCorporationMutation,
      variables: {
        id: corporation.id,
        corporationInfo: pick(corporation, corporationFields)
      }
    }).then((res) => {
      this.showNotification('Company updated successfully.', NOTIFICATION_LEVELS.SUCCESS);
      this.setState({ open: false, corporationInfo: corporation });
    }).catch(err => this.showNotification('An error occurred.', NOTIFICATION_LEVELS.ERROR));
  };

  closeDrawer = (event) => {
    this.setState({ open: false });
  };

  render() {
    const { corporationInfo, notify, notificationMessage, notificationType } = this.state;
    if (!corporationInfo) {
      return (<Loading />);
    }
    return (
      <div className="content corporation-content">
        <List>
          <ListItem
            key={corporationInfo.id}
            primaryText={corporationInfo.corporationName}
            rightIconButton={
              <IconButton onClick={() => this.handleEditClick(corporationInfo)}>
                <Edit color={colors.primaryActionButtons} />
              </IconButton>
            }
          />
        </List>
        <EditCorporationDrawer
          width={styles.drawer.width}
          open={this.state.open}
          corporation={this.state.drawerCorporation}
          handleSubmit={this.handleSubmit}
          closeDrawer={this.closeDrawer} />
        <Notifier hideNotification={this.hideNotification} notify={notify} notificationMessage={notificationMessage} notificationType={notificationType} />
      </div>
    )
  }
}

export default withApollo(Corporation);
