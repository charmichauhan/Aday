import React, { Component } from 'react';
import { Menu, Image } from 'semantic-ui-react';
import { NavLink, withRouter } from 'react-router-dom';
import { gql, graphql, compose } from 'react-apollo';
const Halogen = require('halogen').SyncLoader;

const styles = {
  brandLogo: {
    width: 120,
    marginTop: 15
  }
};

import './nav.css';

class NavComponent extends Component {
  constructor(props) {
    super(props);
  }

  changeWorkplace = (e) => {
    let workplace = e.target.value.split(',');
    let workplaceId = workplace[0];
    let isUnion = workplace[1];
    localStorage.setItem('workplaceId', workplaceId);
    localStorage.setItem('isUnion', isUnion);
    this.forceUpdate();
    this.props.handleChange({ workplaceId });
  };
  logout = () => {
    document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    localStorage.clear();
    this.props.history.push('/login');
  };
  handleChangeBrand = () => {
    let brandId = document.getElementById('brand').value;
    localStorage.setItem('brandId', brandId);
    localStorage.setItem('workplaceId', '');
    localStorage.setItem('isUnion', '');
    document.getElementById('workplace').value = '';
    this.forceUpdate();
    this.props.handleChange({ brandId });
  };

  render() {
    if (this.props.data.loading || this.props.allBrands.loading) {
      return (<div><Halogen color='#00A863' /></div>)
    }

    if (this.props.data.error) {
      console.log(this.props.data.error);
      return (<div>An unexpected error occurred</div>)
    }
    const brandId = localStorage.getItem('brandId');
    const workplaceId = localStorage.getItem('workplaceId');
    const isUnion = localStorage.getItem('isUnion');
    const brand = this.props.allBrands.allBrands.nodes.filter((w) => w.id == brandId);
    let brandLogo = '';
    if (brand[0]) {
      brandLogo = brand[0].brandIconUrl;
    }
    const brands = this.props.allBrands.allBrands.nodes;
    const filteredWorkplaces = this.props.data.allWorkplaces.nodes.filter((w) => w.brandId == brandId);
    return (
      <div className="left-menu_item">
        <Menu vertical fluid>
          <Menu.Item className="menu-item left-menu-logo">
            <Menu.Header><Image src={brandLogo} style={styles.brandLogo} centered={true} /></Menu.Header>
            <Menu.Header className="dropdown-menu-item">
              <select onChange={this.handleChangeBrand} id="brand" value={brandId}>
                {brands.map((v, i) => (
                  <option value={v.id} key={i}>{v.brandName}</option>
                ))}
              </select>
            </Menu.Header>
            <Menu.Header>
              <select onChange={this.changeWorkplace} id="workplace" value={workplaceId + ',' + isUnion }>
                <option value="">CHOOSE WORKPLACE</option>
                {filteredWorkplaces.map((v, i) => (
                  <option value={ v.id + ',' + v.isUnion } key={i}>{ v.workplaceName }</option>
                ))}
              </select>
            </Menu.Header>
          </Menu.Item>
          <div className="left-menu-fixed">
            <Menu.Item className="menu-item">
              <Menu.Menu>
                <Menu.Item><i><Image src="/images/Sidebar/dashboard-white.png" /></i>
                  <div className="menu_item_left"><span>Dashboard</span></div>
                </Menu.Item>
                <Menu.Item className="menu-item-list" name="schedule" as={NavLink} to="/schedule/team"
                           active={this.props.isemployeeview}><i><Image src="/images/Sidebar/schedule-white.png" /></i>
                  <div className="menu_item_left"><span>Schedule</span></div>
                </Menu.Item>
                <Menu.Item className="menu-item-list" as={NavLink} to="/attendance"><i><Image
                  src="/images/Sidebar/star-performance.png" /></i>
                  <div className="menu_item_left"><span>Performance</span></div>
                </Menu.Item>
                <Menu.Item className="menu-item-list" as={NavLink} to="/team">
                  <i><Image  src="/images/Sidebar/team-members-white.png" /></i>
                  <div className="menu_item_left"><span>Team Members</span></div>
                </Menu.Item>
                <Menu.Item className="menu-item-list" as={NavLink} to="/hiring"><i><Image
                  src="/images/Sidebar/hiring-white.png" /></i>
                  <div className="menu_item_left"><span>Hiring</span></div>
                </Menu.Item>
                <Menu.Item className="menu-item-list" as={NavLink} to="/positions"><i><Image
                  src="/images/Sidebar/positions-white.png" /></i>
                  <div className="menu_item_left"><span>Positions</span></div>
                </Menu.Item>
                <Menu.Item className="menu-item-list" as={NavLink} to="/workplaces/mine"><i><Image
                  src="/images/Sidebar/my-workplace-white.png" /></i>
                  <div className="menu_item_left"><span>My Workplace</span></div>
                </Menu.Item>
                <Menu.Item className="menu-item-list" as={NavLink} to="/settings"><i><Image
                  src="/images/Sidebar/settings-white.png" /></i>
                  <div className="menu_item_left"><span>Settings</span></div>
                </Menu.Item>
              </Menu.Menu>
            </Menu.Item>
          </div>
          <Menu.Item className="menu-item-footer">
            <Menu.Item onClick={this.logout} className="menu-item-list">
              <i><Image src="/images/Sidebar/logout-white.png" /></i>
              <div className="menu_item_left"><span>LOGOUT</span></div>
            </Menu.Item>
          </Menu.Item>
        </Menu>
      </div>
    );
  }
}

const allWorkplaces = gql`
  query getAllWorkplacesQuery ($corporationId: Uuid!) {
    allWorkplaces (condition: {corporationId: $corporationId, isActive: true}) {
      nodes{
        workplaceName,
        id,
        brandId,
        isUnion
      }
    }
  }
`;

const allBrands = gql`
  query ($corporationId: Uuid!){
    allBrands(condition: {isActive: true}){
      nodes{
        id
        brandName
        brandIconUrl
        corporationBrandsByBrandId(condition:{ corporationId: $corporationId }){
          nodes{
            brandId
          }
        }
      }
    }
  }`;

const Nav = compose(
  graphql(allWorkplaces, {
    options: (ownProps) => ({
      variables: {
        corporationId: localStorage.getItem('corporationId'),
      }
    }),
  }),
  graphql(allBrands, {
    name: 'allBrands',
    options: (ownProps) => ({
      variables: {
        corporationId: localStorage.getItem('corporationId'),
      },
    }),
  })
)(NavComponent);

export default withRouter(Nav);
