import React, { Component } from 'react'
import { List, ListItem } from 'material-ui/List';
import IconButton from 'material-ui/IconButton';
import RaisedButton from 'material-ui/RaisedButton';
import Edit from 'material-ui/svg-icons/image/edit';
import Delete from 'material-ui/svg-icons/action/delete';
import { Grid, GridColumn } from 'semantic-ui-react';

import BrandDrawer from './BrandDrawer';
import { InfoModal } from '../../helpers/Modal';
import CircleButton from '../../helpers/CircleButton';
import { colors } from '../../styles';

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
  openDeleteModal: false,
  openInfoModal: false
};

export default class Brand extends Component {
  constructor(props) {
    super(props);
    this.state = initialState;
  }

  getDeleteActions = () => {
    return [
      <RaisedButton label="NO" labelColor="#FCDDDD" backgroundColor={colors.primaryRed} onClick={this.closeModal} />,
      <RaisedButton label="YES" labelColor="#FCDDDD" backgroundColor={colors.primaryGreen} onClick={this.handleDelete} />
    ];
  };

  getInfoActions = () => {
    return [
      <RaisedButton label="OK" backgroundColor={colors.primaryGreen} onClick={this.closeModal} />
    ];
  };

  handleDeleteClick = ({ id, brandName }, isInfo) => {
    if (isInfo) {
      this.setState({ openInfoModal: true, toDeleteBrand: id, toDeleteBrandName: brandName });
    }
    else {
      this.setState({ openDeleteModal: true, toDeleteBrand: id, toDeleteBrandName: brandName });
    }
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
    this.setState({ openDeleteModal: false, openInfoModal: false });
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
                <img className="list-left-image" src={brand.brandIconUrl + "?" + new Date().getTime()} alt={brand.brandName} />
              </GridColumn>
              <GridColumn width={14}>
                <ListItem
                  key={brand.id}
                  open={this.state.open} primaryText={brand.brandName}
                >
                  <IconButton style={styles.actionButtons} onClick={() => this.openBrandDrawer(brand)}>
                    <Edit color={colors.primaryActionButtons} />
                  </IconButton>
                  <IconButton style={styles.actionButtons} onClick={() => this.handleDeleteClick(brand, brand.workplaces && !!brand.workplaces.length)}>
                    <Delete color={colors.primaryActionButtons} />
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
        <InfoModal
          title="Delete Brand"
          isOpen={this.state.openDeleteModal}
          message={`Are you sure that you want to delete the ${this.state.toDeleteBrandName} brand?`}
          actions={this.getDeleteActions()}
          handleClickOutside={this.closeModal}
        />
        <InfoModal
          title="Warning"
          isOpen={this.state.openInfoModal}
          message="Before deleting a brand, you must delete all associated workplaces."
          actions={this.getInfoActions()}
          handleClickOutside={this.closeModal}
        />
      </div>
    )
  }
}
