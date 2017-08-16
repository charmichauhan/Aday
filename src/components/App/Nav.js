import React, { Component } from 'react';
import { Menu, Icon, Image } from 'semantic-ui-react';
import { NavLink } from 'react-router-dom';
import EmergencyShiftButton from './KendallLearning/EmergencyShiftButton';
import { gql, graphql,compose} from 'react-apollo';
import './nav.css';

const styles = {
    menuStyle:{
      width:200,
	  height:42
	}
};

class NavComponent extends Component {
  constructor(props){
    super(props);
  }
  changeWorkplace = () => {
    let workplaceId = document.getElementById("workplace").value;
    localStorage.setItem("workplaceId", workplaceId);
    this.props.handleChange();
  };
  logout = () => {
  	document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  	this.props.history.push('/login')
  }
  handleChangeBrand = () => {
    let brandId = document.getElementById("brand").value;
    localStorage.setItem("brandId", brandId);
    localStorage.setItem("workplaceId", "");
    document.getElementById("workplace").value = "";
    this.forceUpdate();
    this.props.handleChange();
  };

	render() {
		if (this.props.data.loading || this.props.allBrands.loading) {
             return (<div>Loading</div>)
         }

         if (this.props.data.error) {
             console.log(this.props.data.error)
             return (<div>An unexpected error occurred</div>)
        }
    const brandId = localStorage.getItem("brandId");
    const brandLogo = "";
		const brands = this.props.allBrands && this.props.allBrands.allCorporationBrands.nodes;
    const filteredWorkplaces = this.props.data.allWorkplaces.nodes.filter((w) => w.brandId == brandId);
		return (
			<div className="left-menu_item">
				{/*<EmergencyShiftButton/>*/}
				<Menu vertical fluid>
					<Menu.Item className="menu-item left-menu-logo">
						<Menu.Header><Image src="/images/logos_aday.png" width="102" height="31" centered={true}/></Menu.Header>
						<Menu.Header><Image src="" width="100" height="100" centered={true}/></Menu.Header>
						<Menu.Header className="dropdown-menu-item">
							<select onChange={this.handleChangeBrand} id="brand" value={brandId}>
                { brands.map((v,i)=>(
                    <option value={v.brandByBrandId.id} key={i}>{v.brandByBrandId.brandName}</option>
                  ))
                }
							</select>
						</Menu.Header>
						<Menu.Header>
							<select onChange={this.changeWorkplace} id="workplace">
								<option value="">CHOOSE WORKPLACE</option>
                {
                  filteredWorkplaces.map((v,i)=>(
											<option value={v.id} key={i}> { v.workplaceName } </option>
                    )
                  )}
							</select>
						</Menu.Header>
					</Menu.Item>
					<div className="left-menu-fixed">
					<Menu.Item className="menu-item">
						<Menu.Menu>
              <Menu.Item><i><Image src="/images/Sidebar/time-attendance.png"/></i><div className="menu_item_left"><span>DASHBOARD</span></div></Menu.Item>
						</Menu.Menu>
					</Menu.Item>
					<Menu.Item className="menu-item">
						<Menu.Menu>
							<Menu.Item className="menu-item-list" name="schedule" as={NavLink} to="/schedule/team" active={this.props.isemployeeview}><i><Image src="/images/Sidebar/schedule.png"/></i><div className="menu_item_left"><span>SCHEDULE</span></div></Menu.Item>
							<Menu.Item className="menu-item-list" as={NavLink} to="/attendance/requests"><i><Image src="/images/Sidebar/time-attendance.png"/></i><div className="menu_item_left"><span>TIME & ATTENDANCE</span></div></Menu.Item>
							<Menu.Item className="menu-item-list" as={NavLink} to="/team"><i><Image src="/images/Sidebar/team-member.png"/></i><div className="menu_item_left"><span>TEAM MEMBERS</span></div></Menu.Item>
							<Menu.Item className="menu-item-list" as={NavLink} to="/hiring"><i><Image src="/images/Sidebar/hiring.png"/></i><div className="menu_item_left"><span>HIRING</span></div></Menu.Item>
							<Menu.Item className="menu-item-list" as={NavLink} to="/positions"><i><Image src="/images/Sidebar/positions.png"/></i><div className="menu_item_left"><span>POSITIONS</span></div></Menu.Item>
							<Menu.Item className="menu-item-list" as={NavLink} to="/workplaces/mine"><i><Image src="/images/Sidebar/my-workplace.png"/></i><div className="menu_item_left"><span>MY WORKPLACE</span></div></Menu.Item>
							<Menu.Item className="menu-item-list" as={NavLink} to="/settings"><i><Image src="/images/Sidebar/settings.png"/></i><div className="menu_item_left"><span>SETTINGS</span></div></Menu.Item>
						</Menu.Menu>
					</Menu.Item>
					</div>
  					<Menu.Item className="menu-item-logout">
						<Menu.Item className="menu-item-list"><i><Image onClick={this.logout} src="/images/Sidebar/logout-icon.png"/></i><div className="menu_item_left"><span>LOGOUT</span></div></Menu.Item>
					</Menu.Item>
				</Menu>
			</div>
		);
	}
}

const allWorkplaces = gql`
  query getAllWorkplacesQuery ($corporationId: Uuid!) {
    allWorkplaces (condition: {corporationId: $corporationId}) {
      nodes{
        workplaceName,
        id,
        brandId
      }
    }
}
`

const allBrands = gql`
  query ($corporationId: Uuid!){
    allCorporationBrands(condition: {corporationId: $corporationId}){
      nodes{
        brandByBrandId{
          id
          brandName
          brandIconUrl
        }
      }
    }
  }
  `

const Nav = compose(
  graphql(allWorkplaces, {
    options: (ownProps) => ({
      variables: {
        corporationId: localStorage.getItem('corporationId') ,
      }
    }),
  }),
  graphql(allBrands, { name:"allBrands",
    options: (ownProps) => ({
      variables: {
        corporationId: localStorage.getItem('corporationId') ,
      },
    }),
  })
)(NavComponent);

export default Nav
