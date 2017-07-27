import React, { Component } from 'react';
import { Tabs, Tab } from 'material-ui/Tabs';
import { remove, maxBy, findIndex } from 'lodash';

import Personal from './Personal';
import Workplace from './Workplace';
import Brand from './Brand';
import Company from './Company';
import { tabDesign } from '../styles';
import './settings.css';

const styles = {
  tabDesign
};

const initState = {
  user: {
    id: 101,
    firstName: 'Billy',
    lastName: 'Buchanan',
    email: 'billy.buchanan@gmail.com',
    phoneNumber: '+10123465789'
  },
  value: 'personal',
  companies: [{
    id: 1,
    name: 'Compass Group, USA',
  }],
  brands: [{
    id: 1,
    name: 'Restaurant Associates',
    image: '/images/brands/ra.png'
  }, {
    id: 2,
    name: 'Flik’s Hospitality Group',
    image: '/images/brands/compass.png'
  }],
  workplaces: [{
    id: 1,
    name: 'Chao Center',
    brand: 'Restaurant Associates',
    claimed: true,
    image: '/images/workplaces/chao-center.jpg'
  }, {
    id: 2,
    name: 'Spangler Center',
    brand: 'Restaurant Associates',
    claimed: false,
    image: '/images/workplaces/chao-center.jpg'
  }]
};

export default class Settings extends Component {
  constructor(props) {
    super(props);
    this.state = initState;
  }

  handleChange = (value) => {
    this.setState({ value: value });
  };

  deleteWorkplace = (id) => {
    const { workplaces } = this.state;
    remove(workplaces, { 'id': id });
    this.setState({ workplaces });
  };

  addOrUpdateWorkPlace = (workplace) => {
    const { workplaces } = this.state;
    // Just for dummy data (To be removed after actual data submission)
    if (typeof workplace.image !== 'string') workplace.image = workplace.image.preview;
    if (!workplace.id) {
      workplace.id = maxBy(workplaces, 'id').id + 1;
      workplaces.push(workplace);
      this.setState({ workplaces });
    } else {
      const workplaceIndex = findIndex(workplaces, { id: workplace.id });
      workplaces[workplaceIndex] = workplace;
      this.setState({ workplaces });
    }
  };

  deleteBrand = (id) => {
    const { brands } = this.state;
    remove(brands, { 'id': id });
    this.setState({ brands });
  };

  addOrUpdateBrand = (brand) => {
    const { brands } = this.state;
    // Just for dummy data (To be removed after actual data submission)
    if (typeof brand.image !== 'string') brand.image = brand.image.preview;
    if (!brand.id) {
      brand.id = maxBy(brands, 'id').id + 1;
      brands.push(brand);
      this.setState({ brands });
    } else {
      const workplaceIndex = findIndex(brands, { id: brand.id });
      brands[workplaceIndex] = brand;
      this.setState({ brands });
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
            <Personal user={this.state.user} />
          </Tab>
          <Tab
            buttonStyle={this.getButtonStyle('workplace')}
            label="Workplace"
            value="workplace">
            <Workplace
              addOrUpdateWorkPlace={this.addOrUpdateWorkPlace}
              onDeleteWorkplace={this.deleteWorkplace}
              brands={this.state.brands}
              workplaces={this.state.workplaces} />
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
            <Company companies={this.state.companies} />
          </Tab>
        </Tabs>
      </section>
    );
  }
}
