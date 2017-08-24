import React, { Component } from 'react'
import { List, ListItem } from 'material-ui/List';
import IconButton from 'material-ui/IconButton';
import Edit from 'material-ui/svg-icons/image/edit';
import Delete from 'material-ui/svg-icons/action/delete';
import { filter, pick, find, findIndex, remove } from 'lodash';
import { withApollo } from 'react-apollo';
import { Grid, GridColumn, Progress } from 'semantic-ui-react';
import uuidv4 from 'uuid/v4';

import WorkplaceDrawer from './WorkplaceDrawer';
import { workplaceResolvers } from '../settings.resolvers';
import Loading from '../../helpers/Loading';
import Modal from '../../helpers/Modal';
import CircleButton from '../../helpers/CircleButton';
import Notifier, { NOTIFICATION_LEVELS } from '../../helpers/Notifier';
import { colors } from '../../styles';

const styles = {
  drawer: {
    width: 600
  },
  actionButtons: {
    margin: '0',
    float: 'right'
  },
  listItem: {
    padding: '10px 5px',
  },
  listSecondaryText: {
    height: 'auto'
  },
  circleButton: {
    fontSize: 18,
    padding: '6px 5px',
    fontWeight: 'bold'
  }
};

const workplaceFields = [
  'id', 'workplaceName', 'corporationId',
  'brandId', 'isActive', 'workplaceImageUrl',
  'isUnion', 'isRatingsPublic', 'isActive'
];

const removeEmpty = (obj) => {
  Object.keys(obj).forEach((key) => obj[key] === null || obj[key] === undefined || obj[key] === "" && delete obj[key]);
  return obj;
};

const initialState = {
  open: false,
  openDeleteModal: false,
  notify: false,
  notificationMessage: '',
  notificationType: '',
  corporationId: localStorage.getItem('corporationId')
};

class Workplace extends Component {
  constructor(props) {
    super(props);
    this.state = initialState;
  }

  componentDidMount() {
    this.props.client.query({
      query: workplaceResolvers.allWorkplacesQuery,
      variables: { corporationId: this.state.corporationId }
    }).then((res) => {
      if (res.data && res.data.allWorkplaces && res.data.allWorkplaces.edges) {
        const workplaceNodes = res.data.allWorkplaces.edges;
        if (workplaceNodes) {
          const workplaces = workplaceNodes.map(({ node }) => {
            let workplace = pick(node, workplaceFields);
            workplace.brand = node.brandByBrandId;
            if (!workplace.workplaceImageUrl) workplace.workplaceImageUrl = '/images/workplaces/chao-center.jpg';
            return workplace;
          });
          this.setState({ workplaces });
        }
      }
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

  getDeleteActions = () => {
    return [
      { type: 'white', title: 'Cancel', handleClick: this.closeModal, image: false },
      { type: 'red', title: 'Delete Workplace', handleClick: this.handleDelete, image: '/images/modal/close.png' }
    ];
  };

  handleDeleteClick = (id) => {
    this.setState({ openDeleteModal: true, toDeleteWorkplace: id });
  };

  handleDelete = () => {
    const id = this.state.toDeleteWorkplace;
    this.props.client.mutate({
      mutation: workplaceResolvers.deleteWorkplaceMutation,
      variables: {
        id
      }
    }).then((res) => {
      const { workplaces } = this.state;
      remove(workplaces, { 'id': id });
      this.setState({ workplaces, openDeleteModal: false, toDeleteWorkplace: undefined });
      this.showNotification('Workplace has been deleted.', NOTIFICATION_LEVELS.WARNING);
    }).catch(err => this.showNotification('An error occurred.', NOTIFICATION_LEVELS.ERROR));
  };

  closeModal = () => {
    this.setState({ openDeleteModal: false });
  };

  handleDrawerSubmit = (workplace) => {
    // Make request to server to add workplace
    this.setState({ open: false });
    const { workplaces } = this.state;
    if (!workplace.id) {
      // Create
      workplace.id = uuidv4();
      workplace.corporationId = this.state.corporationId;
      workplace.isUnion = workplace.isRatingsPublic = workplace.isActive = true;
      this.props.client.mutate({
        mutation: workplaceResolvers.createWorkplaceMutation,
        variables: {
          workplace: removeEmpty(pick(workplace, workplaceFields))
        }
      }).then((res) => {
        this.showNotification('Workplace details added successfully.', NOTIFICATION_LEVELS.SUCCESS);
        workplace.brand = find(this.props.brands, { 'id': workplace.brandId });
        if (!workplace.workplaceImageUrl) workplace.workplaceImageUrl = '/images/workplaces/chao-center.jpg';
        workplaces.push(workplace);
        this.setState({ workplaces });
      }).catch(err => this.showNotification('An error occurred.', NOTIFICATION_LEVELS.ERROR));
    } else {
      // Update
      this.props.client.mutate({
        mutation: workplaceResolvers.updateWorkplaceMutation,
        variables: {
          id: workplace.id,
          workplaceInfo: removeEmpty(pick(workplace, workplaceFields))
        },
       updateQueries: {
          getAllWorkplacesQuery: (previousQueryResult, { mutationResult }) => {
              let newEdges = []
              previousQueryResult.allWorkplaces.nodes.map((value) => {
                    if(value.id != mutationResult.data.updateWorkplaceById.workplace.id){
                        newEdges.push(value)
                    } else {
                       newEdges.push(mutationResult.data.updateWorkplaceById.workplace)
                    }
              })
              previousQueryResult.allWorkplaces.edges = newEdges
              return {
                allWorkplaces: previousQueryResult.allShifts
              };
              },
          },
        }).then((res) => {
        this.showNotification('Workplace details updated successfully.', NOTIFICATION_LEVELS.SUCCESS);
        workplace.brand = find(this.props.brands, { 'id': workplace.brandId });
        if (!workplace.workplaceImageUrl) workplace.workplaceImageUrl = '/images/workplaces/chao-center.jpg';
        const workplaceIndex = findIndex(workplaces, { id: workplace.id });
        workplaces[workplaceIndex] = workplace;
        this.setState({ workplaces });

      }).catch(err => this.showNotification('An error occurred.', NOTIFICATION_LEVELS.ERROR));
    }
  };

  closeDrawer = (event) => {
    this.setState({ open: false });
  };

  openWorkplaceDrawer = (workplace) => {
    this.setState({ open: true, drawerWorkplace: workplace });
  };

  render() {
    const { workplaces, notify, notificationMessage, notificationType } = this.state;
    if (!workplaces) {
      return (<Loading />);
    }
    const claimedWorkplaces = filter(workplaces, { 'isClaimed': true });
    const progressLabel = `${(claimedWorkplaces.length * 100 / workplaces.length).toFixed(2)}% WORKPLACES`;
    return (
      <div className="content workplaces-content">
        <div className="workplace-add-button">
          <CircleButton style={styles.circleButton} type="blue" title="Add Workplace"
                        handleClick={() => this.openWorkplaceDrawer()} />
        </div>
        <div className="workplace-progress-bar">
          <p>{progressLabel}</p>
          <Progress value={claimedWorkplaces.length} total={workplaces.length} progress='ratio' />
        </div>
        <List>
          {workplaces && workplaces.map((workplace) =>
            <Grid key={workplace.id}>
              <GridColumn className="list-left-image-wrapper" width={2}>
                <img className="list-left-image" src={workplace.workplaceImageUrl} alt={workplace.name} />
              </GridColumn>
              <GridColumn width={14}>
                <ListItem
                  innerDivStyle={styles.listItem}
                  key={workplace.id}
                  primaryText={workplace.workplaceName}
                  secondaryText={
                    <p style={styles.listSecondaryText} className="workplace-list secondary">
                      <span htmlFor="type">{workplace.brand.brandName}</span>
                      <span className={(workplace.isClaimed && 'claimed') || 'unclaimed'}>
												{(workplace.isClaimed && 'claimed') || 'unclaimed'}
											</span>
                    </p>
                  }
                >
                  <IconButton style={styles.actionButtons}
                              onClick={() => this.openWorkplaceDrawer(workplace)}>
                    <Edit color={colors.primaryActionButtons} />
                  </IconButton>
                  <IconButton style={styles.actionButtons}
                              onClick={() => this.handleDeleteClick(workplace.id)}>
                    <Delete color={colors.primaryActionButtons} />
                  </IconButton>
                </ListItem>
              </GridColumn>
            </Grid>
          )}
        </List>
        <WorkplaceDrawer
          brands={this.props.brands}
          workplace={this.state.drawerWorkplace}
          width={styles.drawer.width}
          open={this.state.open}
          handleSubmit={this.handleDrawerSubmit}
          closeDrawer={this.closeDrawer} />
        <Modal
          title="Confirm Delete"
          isOpen={this.state.openDeleteModal}
          message="Are you sure that you want to delete this Workplace?"
          action={this.getDeleteActions()}
          closeAction={this.closeModal}
        />
        <Notifier hideNotification={this.hideNotification} notify={notify} notificationMessage={notificationMessage} notificationType={notificationType} />
      </div>
    )
  }
}

export default withApollo(Workplace);
