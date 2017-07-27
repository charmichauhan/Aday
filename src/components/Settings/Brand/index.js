import React, { Component } from 'react'
import { List, ListItem } from 'material-ui/List';
import IconButton from 'material-ui/IconButton';
import Edit from 'material-ui/svg-icons/image/edit';
import Delete from 'material-ui/svg-icons/action/delete';
import { Grid, GridColumn } from 'semantic-ui-react';

import BrandDrawer from './BrandDrawer';
import Modal from '../../helpers/Modal';
import CircleButton from '../../helpers/CircleButton/index';

const styles = {
  drawer: {
    width: 600
  },
  actionButtons: {
    margin: '-15px -10px 0 0',
    float: 'right'
  }
};

const initialState = {
  open: false,
  openDeleteModal: false
};

export default class Brand extends Component {
  constructor(props) {
    super(props);
    this.state = initialState;
  }

  getDeleteActions = () => {
    return [
      { type: 'white', title: 'Cancel', handleClick: this.closeModal, image: false },
      { type: 'red', title: 'Delete Brand', handleClick: this.handleDelete, image: true }
    ];
  };

  handleDeleteClick = (id) => {
    this.setState({ openDeleteModal: true, toDeleteBrand: id });
  };

  handleDelete = () => {
    this.props.onDeleteBrand(this.state.toDeleteBrand);
    this.setState({ openDeleteModal: false, toDeleteBrand: undefined });
  };

  handleDrawerSubmit = (brand) => {
    this.setState({ open: false });
    this.props.addOrUpdateBrand(brand);
  };

  closeModal = () => {
    this.setState({ openDeleteModal: false });
  };

  closeDrawer = (event) => {
    this.setState({ open: false });
  };

  openBrandDrawer = (brand) => {
    this.setState({ open: true, drawerBrand: brand });
  };

  render() {
    return (
      <div className="content brands-content">
        <div className="brand-add-button">
          <CircleButton type="blue" title="Add Brand" handleClick={() => this.openBrandDrawer()} />
        </div>
        <List>
          {this.props.brands &&
          this.props.brands.map((brand) =>
            <Grid key={brand.id}>
              <GridColumn className="list-left-image-wrapper" width={2}>
                <img className="list-left-image" src={brand.image} alt={brand.name} />
              </GridColumn>
              <GridColumn width={14}>
                <ListItem
                  key={brand.id}
                  open={this.state.open} primaryText={brand.name}
                >
                  <IconButton style={styles.actionButtons} onClick={() => this.openBrandDrawer(brand)}>
                    <Edit />
                  </IconButton>
                  <IconButton style={styles.actionButtons} onClick={() => this.handleDeleteClick(brand.id)}>
                    <Delete />
                  </IconButton>
                </ListItem>
              </GridColumn>
            </Grid>
          )}
        </List>
        <BrandDrawer
          width={styles.drawer.width}
          open={this.state.open}
          brand={this.state.drawerBrand}
          handleSubmit={this.handleDrawerSubmit}
          closeDrawer={this.closeDrawer} />
        <Modal
          title="Confirm Delete"
          isOpen={this.state.openDeleteModal}
          message="Are you sure that you want to delete this brand?"
          action={this.getDeleteActions()}
          closeAction={this.closeModal}
        />
      </div>
    )
  }
}
