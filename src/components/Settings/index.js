import React, { Component } from 'react';
import { Tabs, Tab } from 'material-ui/Tabs';
import { remove, pick, findIndex } from 'lodash';
import { withApollo } from 'react-apollo';
import uuidv4 from 'uuid/v4';

import Personal from './Personal';
import Workplace from './Workplace';
import Brand from './Brand';
import Company from './Company';
import { brandResolvers } from './settings.resolvers';
import { tabDesign } from '../styles';
import './settings.css';

const styles = {
  tabDesign
};

const removeEmpty = (obj) => {
  Object.keys(obj).forEach((key) => obj[key] === null || obj[key] === undefined || obj[key] === "" && delete obj[key]);
  return obj;
};

const brandFields = ['id', 'brandName', 'brandIconUrl'];

const initialState = {
  value: 'personal',
  brands: []
};

class Settings extends Component {
  constructor(props) {
    super(props);
    this.state = initialState;
  }

  componentDidMount() {
    this.props.client.query({
      query: brandResolvers.allBrandsQuery
    }).then((res) => {
      if (res.data && res.data.allBrands && res.data.allBrands.edges) {
        const brandNodes = res.data.allBrands.edges;
        if (brandNodes) {
          const brands = brandNodes.map(({ node }) => {
            let brand = pick(node, brandFields);
            if (!brand.brandIconUrl) brand.brandIconUrl = '/images/brands/ra.png';
            return brand;
          });
          this.setState({ brands });
        }
      }
    }).catch(err => console.log(err));
  }

  handleChange = (value) => {
    this.setState({ value: value });
  };

  deleteBrand = (id) => {
    const { brands } = this.state;
    this.props.client.mutate({
      mutation: brandResolvers.deleteBrandMutation,
      variables: { id }
    }).then(() => {
      remove(brands, { 'id': id });
      this.setState({ brands });
      // TODO: show notification for successful creation
    }).catch(err => console.error(err));
  };

  addOrUpdateBrand = (brand) => {
    const { brands } = this.state;
    // Just for dummy data (To be removed after actual data submission)
    if (typeof brand.brandIconUrl !== 'string' && !!brand.brandIconUrl) brand.brandIconUrl = brand.brandIconUrl.preview;
    if (!brand.id) {
      // Create
      brand.id = uuidv4();
      this.props.client.mutate({
        mutation: brandResolvers.createBrandMutation,
        variables: {
          input: {
            brand: removeEmpty(pick(brand, brandFields))
          }
        }
      }).then(() => {
        if (!brand.brandIconUrl) brand.brandIconUrl = '/images/brands/ra.png';
        brands.push(brand);
        this.setState({ brands });
        // TODO: show notification for successful creation
      }).catch(err => console.error(err));
    } else {
      // Update
      this.props.client.mutate({
        mutation: brandResolvers.updateBrandMutation,
        variables: {
          id: brand.id,
          brandInfo: removeEmpty(pick(brand, brandFields))
        }
      }).then(() => {
        // TODO: show notification for successful update
        const brandIndex = findIndex(brands, { id: brand.id });
        brands[brandIndex] = brand;
        this.setState({ brands });
      }).catch(err => console.error(err));
    }
  };

  getButtonStyle = (value) => ({
    ...styles.tabDesign.buttonStyle,
    fontWeight: (this.state.value === value && 700) || 500
  });

  render() {
    return (
      <section className="settings">
        <Tabs
          value={this.state.value}
          onChange={this.handleChange}
          inkBarStyle={styles.tabDesign.inkBarStyle}
          tabItemContainerStyle={styles.tabDesign.tabItemContainerStyle}>
          <Tab
            buttonStyle={this.getButtonStyle('personal')}
            label="Personal"
            value="personal">
            <Personal />
          </Tab>
          <Tab
            buttonStyle={this.getButtonStyle('workplace')}
            label="Workplace"
            value="workplace">
            <Workplace brands={this.state.brands} />
          </Tab>
          <Tab
            buttonStyle={this.getButtonStyle('brand')}
            label="Brand"
            value="brand">
            <Brand
              addOrUpdateBrand={this.addOrUpdateBrand}
              brands={this.state.brands}
              onDeleteBrand={this.deleteBrand} />
          </Tab>
          <Tab
            buttonStyle={this.getButtonStyle('company')}
            label="Company"
            value="company">
            <Company />
          </Tab>
        </Tabs>
      </section>
    );
  }
}

export default withApollo(Settings);
