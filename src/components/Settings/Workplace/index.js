import React, { Component } from 'react'
import { List, ListItem } from 'material-ui/List';
import IconButton from 'material-ui/IconButton';
import Edit from 'material-ui/svg-icons/image/edit';
import Delete from 'material-ui/svg-icons/action/delete';
import { filter, pick, findIndex } from 'lodash';
import { withApollo } from 'react-apollo';
import { Grid, GridColumn, Progress } from 'semantic-ui-react';
import uuidv4 from 'uuid/v4';

import WorkplaceDrawer from './WorkplaceDrawer';
import { workplaceResolvers } from '../settings.resolvers';
import Loading from '../../helpers/Loading';
import Modal from '../../helpers/Modal';
import CircleButton from '../../helpers/CircleButton';

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

const initialState = {
  open: false,
  openDeleteModal: false,
  corporationId: '3b14782b-c220-4927-b059-f4f22d01c230'
};

class Workplace extends Component {
  constructor(props) {
    super(props);
    this.state = initialState;
  }

  componentDidMount() {
    this.props.client.query({
      query: workplaceResolvers.allWorkplacesQuery,
      // TODO: get corporation details dynamically.
      variables: { corporationId: this.state.corporationId }
    }).then((res) => {
      if (res.data && res.data.allWorkplaces && res.data.allWorkplaces.edges) {
        const workplaceNodes = res.data.allWorkplaces.edges;
        if (workplaceNodes) {
          const workplaces = workplaceNodes.map(({ node }) => {
            let workplace = pick(node, ['id', 'workplaceName', 'brandId', 'address', 'isActive', 'workplaceImageUrl']);
            workplace.brand = node.brandByBrandId;
            if (!workplace.workplaceImageUrl) workplace.workplaceImageUrl = '/images/workplaces/chao-center.jpg';
            return workplace;
          });
          this.setState({ workplaces });
        }
      }
    }).catch(err => console.log(err));
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
    this.props.onDeleteWorkplace(this.state.toDeleteWorkplace);
    this.setState({ openDeleteModal: false, toDeleteWorkplace: undefined });
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
      workplace = pick(workplace, ['id', 'workplaceName', 'brandId', 'address', 'isActive', 'workplaceImageUrl']);
      workplace.id = uuidv4();
      workplace.corporationId = this.state.corporationId;
      workplace.isUnion = workplace.isUnion = workplace.isRatingsPublic = workplace.isActive = true;
      this.props.client.mutate({
        mutation: workplaceResolvers.createWorkplaceMutation,
        variables: {
          workplace
        }
      }).then((res) => {
        debugger;
        workplaces.push(workplace);
        this.setState({ workplaces });
        // TODO: show notification for successful creation
      }).catch(err => console.log(err));
    } else {
      // Update
      this.props.client.mutate({
        mutation: workplaceResolvers.updateWorkplaceMutation,
        variables: {
          id: workplace.id,
          workplaceInfo: pick(workplace, ['id', 'workplaceName', 'brandId', 'address', 'isActive', 'workplaceImageUrl'])
        }
      }).then((res) => {
        debugger;
        // TODO: show notification for successful update
        const workplaceIndex = findIndex(workplaces, { id: workplace.id });
        workplaces[workplaceIndex] = workplace;
        this.setState({ workplaces });
      }).catch(err => console.log(err));
    }
  };

  closeDrawer = (event) => {
    this.setState({ open: false });
  };

  openWorkplaceDrawer = (workplace) => {
    this.setState({ open: true, drawerWorkplace: workplace });
  };

  render() {
    const { workplaces } = this.state;
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
                    <Edit />
                  </IconButton>
                  <IconButton style={styles.actionButtons}
                              onClick={() => this.handleDeleteClick(workplace.id)}>
                    <Delete />
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

      </div>
    )
  }
}

export default withApollo(Workplace);
