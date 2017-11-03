import React, { Component } from 'react'
import { List, ListItem } from 'material-ui/List';
import IconButton from 'material-ui/IconButton';
import Edit from 'material-ui/svg-icons/image/edit';
import Delete from 'material-ui/svg-icons/action/delete';
import RaisedButton from 'material-ui/RaisedButton';
import { filter, pick, find, findIndex, remove } from 'lodash';
import { withApollo } from 'react-apollo';
import { Grid, GridColumn, Progress } from 'semantic-ui-react';
import uuidv4 from 'uuid/v4';
import moment from 'moment';

import WorkplaceDrawer from './WorkplaceDrawer';
import { workplaceResolvers } from '../settings.resolvers';
import Loading from '../../helpers/Loading';
import { InfoModal } from '../../helpers/Modal';
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
  'isUnion', 'isRatingsPublic', 'isActive', 'address'
];

const managerPositionPrototype = {
  positionName: 'Manager',
  positionDescription: 'Manager of the workplace',
  exchangeLevel: 'WORKPLACE_SPECIFIC',
  partTimeWage: 19.99,
  minimumAge: 18
};

const removeEmpty = (obj) => {
  Object.keys(obj).forEach((key) => obj[key] === null || obj[key] === undefined || obj[key] === '' && delete obj[key]);
  return obj;
};

const initialState = {
  open: false,
  openDeleteModal: false,
  openInfoModal: false,
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
            const shiftNodes = node.shiftsByWorkplaceId && node.shiftsByWorkplaceId.nodes;
            if (shiftNodes && shiftNodes.length) {
              workplace.shifts = shiftNodes.map(({ id, startTime }) => ({ id, startTime }));
              workplace.futureShifts = workplace.shifts.filter(({ startTime }) => {
                return moment.utc(startTime) - moment.utc(new Date()) >= 0;
              });
            } else {
              workplace.shifts = workplace.futureShifts = [];
            }
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
  };

  getDeleteActions = () => {
    return [
      <RaisedButton label="NO" labelColor="#FCDDDD" backgroundColor={colors.primaryRed} onClick={this.closeModal} />,
      <RaisedButton label="YES" labelColor="#FCDDDD" backgroundColor={colors.primaryGreen} onClick={this.handleDelete} />,
    ];
  };

  getInfoActions = () => {
    return [
      <RaisedButton label="OK" labelColor="#FCDDDD" backgroundColor={colors.primaryGreen} onClick={this.closeModal} />,
    ];
  };

  handleDeleteClick = ({ id, workplaceName }, isInfo) => {
    if (isInfo) {
      this.setState({ openInfoModal: true, toDeleteWorkplace: id, toDeleteWorkplaceName: workplaceName });
    } else {
      this.setState({ openDeleteModal: true, toDeleteWorkplace: id, toDeleteWorkplaceName: workplaceName });
    }
  };

  handleDelete = () => {
    const id = this.state.toDeleteWorkplace;
    this.props.client.mutate({
      mutation: workplaceResolvers.updateWorkplaceMutation,
      variables: {
        id,
        workplaceInfo: { isActive: false, dateDeactivated: new Date().toUTCString() }
      },
      updateQueries: {
          getAllWorkplacesQuery: (previousQueryResult, { mutationResult }) => {
            let newEdges = [];
            previousQueryResult.allWorkplaces.nodes.map((value) => {
              if (value.id != mutationResult.data.updateWorkplaceById.workplace.id) {
                newEdges.push(value);
              }
            });
            previousQueryResult.allWorkplaces.nodes = newEdges;
            return {
              allWorkplaces: previousQueryResult.allWorkplaces
            };
          },
        },
    }).then((res) => {
      const { workplaces } = this.state;
      remove(workplaces, { 'id': id });
      this.setState({ workplaces, openDeleteModal: false, toDeleteWorkplace: undefined });
      this.showNotification('Workplace has been deleted.', NOTIFICATION_LEVELS.WARNING);
    }).catch(err => this.showNotification('An error occurred.', NOTIFICATION_LEVELS.ERROR));
  };

  closeModal = () => {
    this.setState({ openDeleteModal: false, openInfoModal: false });
  };

  handleDrawerSubmit = (workplace) => {
    // Make request to server to add workplace
    this.setState({ open: false });
    const { workplaces } = this.state;
    if (!workplace.id) {
      const workplace_id = uuidv4();
      // Create
      workplace.id = workplace_id;
      workplace.corporationId = this.state.corporationId;
      workplace.isUnion = workplace.isRatingsPublic = workplace.isActive = true;
      workplace.address = workplace.address + ' ' + workplace.address2 + ' ' +
             workplace.city + ' ' + workplace.state + ' ' +  workplace.zip;
      this.props.client.mutate({
        mutation: workplaceResolvers.createWorkplaceMutation,
        variables: {
          workplace: removeEmpty(pick(workplace, workplaceFields))
        },
        updateQueries: {
          getAllWorkplacesQuery: (previousQueryResult, { mutationResult }) => {
            let newEdges = [];
            previousQueryResult.allWorkplaces.nodes.push(mutationResult.data.createWorkplace.workplace);
            return {
              allWorkplaces: previousQueryResult.allWorkplaces
            };
          },
        },
      }).then((res) => {
        this.showNotification('Workplace details added successfully.', NOTIFICATION_LEVELS.SUCCESS);
        workplace.brand = find(this.props.brands, { 'id': workplace.brandId });
        if (!workplace.workplaceImageUrl) workplace.workplaceImageUrl = '/images/workplaces/chao-center.jpg';
        workplaces.push(workplace);
        this.setState({ workplaces });

        // Adding manager position for the workplace
        const position = {
          ...managerPositionPrototype,
          id: uuidv4(),
          brandId: workplace.brandId,
          workplaceId: workplace_id
        };
        this.props.client.mutate({
          mutation: workplaceResolvers.createPositionMutation,
          variables: { position },
        }).then((res) => {
          console.log('Manager position created for workplace.');
        }).catch(err => console.error('Error creating manager position. err: ', err));

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
            let newEdges = [];
            previousQueryResult.allWorkplaces.nodes.map((value) => {
              if (value.id != mutationResult.data.updateWorkplaceById.workplace.id) {
                newEdges.push(value);
              } else {
                newEdges.push(mutationResult.data.updateWorkplaceById.workplace);
              }
            });
            previousQueryResult.allWorkplaces.edges = newEdges;
            return {
              allWorkplaces: previousQueryResult.allShifts
            };
          },
        }
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
                <img className="list-left-image" src={workplace.workplaceImageUrl + "?" + new Date().getTime()} alt={workplace.name} />
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
                              onClick={() => this.handleDeleteClick(workplace, workplace.futureShifts && !!workplace.futureShifts.length)}>
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
        <InfoModal
          title="Delete Workplace"
          isOpen={this.state.openDeleteModal}
          message={`Are you sure that you want to delete the ${this.state.toDeleteWorkplaceName} workplace?`}
          actions={this.getDeleteActions()}
          handleClickOutside={this.closeModal}
        />
        <InfoModal
          title="Warning"
          isOpen={this.state.openInfoModal}
          message="Before deleting a workplace, you must delete all or allow to be worked any future shifts."
          actions={this.getInfoActions()}
          handleClickOutside={this.closeModal}
        />
        <Notifier hideNotification={this.hideNotification} notify={notify} notificationMessage={notificationMessage}
                  notificationType={notificationType} />
      </div>
    )
  }
}

export default withApollo(Workplace);
