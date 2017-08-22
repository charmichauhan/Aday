import React, { Component } from 'react'
import { List, ListItem } from 'material-ui/List';
import Edit from 'material-ui/svg-icons/image/edit';
import IconButton from 'material-ui/IconButton';
import { findIndex } from 'lodash';
import { withApollo } from 'react-apollo';

import EditCompanyDrawer from './EditCompanyDrawer';
import { companyResolvers } from '../settings.resolvers';
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

const initialState = {
  open: false,
  companies: [{
    id: 1,
    name: 'Compass Group, USA',
  }],
  drawerCompany: {
    id: '',
    name: ''
  },
  corporationId: localStorage.getItem('corporationId')
};

class Company extends Component {
  constructor(props) {
    super(props);
    this.state = initialState;
  }

  componentDidMount() {
    this.props.client.query({
      query: companyResolvers.getCorporationQuery,
      variables: {
        id: this.state.corporationId
      }
    }).then((res) => {
      if (res.data && res.data.corporationById) this.setState({ corporationInfo: res.data.corporationById });
    }).catch(err => console.log(err));
  }

  handleEditClick = (company) => {
    this.setState({ open: true, drawerCompany: company });
  };

  handleSubmit = (company) => {
    const { companies } = this.state;
    const companyIndex = findIndex(companies, { id: company.id });
    companies[companyIndex] = company;
    this.setState({ open: false, companies });
  };

  closeDrawer = (event) => {
    this.setState({ open: false });
  };

  render() {
    return (
      <div className="content company-content">
        <List>
          {this.state.companies &&
          this.state.companies.map((company) =>
            <ListItem
              key={company.id}
              primaryText={company.name}
              rightIconButton={
                <IconButton onClick={() => this.handleEditClick(company)}>
                  <Edit color={colors.primaryActionButtons} />
                </IconButton>
              }
            />
          )}
        </List>
        <EditCompanyDrawer
          width={styles.drawer.width}
          open={this.state.open}
          company={this.state.drawerCompany}
          handleSubmit={this.handleSubmit}
          closeDrawer={this.closeDrawer} />
      </div>
    )
  }
}

export default withApollo(Company);
