import React, { Component } from 'react';
import { Menu, Icon, Image } from 'semantic-ui-react';
import { NavLink } from 'react-router-dom';
import EmergencyShiftButton from './KendallLearning/EmergencyShiftButton';
import { gql, graphql } from 'react-apollo';
import './nav.css';
const styles = {
    menuStyle:{
    	width:200,
		height:42
	}
};

class NavComponent extends Component {
	render() {
		  if (this.props.data.loading) {
             return (<div>Loading</div>)
         }
        
         if (this.props.data.error) {
             console.log(this.props.data.error)
             return (<div>An unexpected error occurred</div>)
        }

        const brandLogo = this.props.data.brandById.brandIconUrl
		return (
			<div className="left-menu_item">
				{/*<EmergencyShiftButton/>*/}
				<Menu vertical fluid>
					<Menu.Item className="menu-item">
						<Menu.Header><Image src="/images/logos_aday.png" width="102" height="31" centered={true}/></Menu.Header>
						<Menu.Header><Image src={brandLogo} width="75" height="75" centered={true}/></Menu.Header>
						<Menu.Header>
							<select>
								<option value=""><a>CHOOSE WORKPLACE</a></option>
								{
                                    this.props.data.brandById.workplacesByBrandId.edges.map((v,i)=>(				
										<option value={v.node.id}> { v.node.workplaceName } </option>
									)
								)}
							</select>
						</Menu.Header>
					</Menu.Item>
					<Menu.Item className="menu-item">
						<Menu.Menu>
							<Menu.Item><EmergencyShiftButton/></Menu.Item>
						</Menu.Menu>
					</Menu.Item>
					<Menu.Item className="menu-item">
						<Menu.Menu>
							<Menu.Item className="menu-item-list" as={NavLink} to="/schedule/team"><i><Image src="/images/Sidebar/schedule.png"/></i><div className="menu_item_left"><span>SCHEDULE</span></div></Menu.Item>
							<Menu.Item className="menu-item-list" as={NavLink} to="/attendance/requests"><i><Image src="/images/Sidebar/time-attendance.png"/></i><div className="menu_item_left"><span>TIME & ATTENDANCE</span></div></Menu.Item>
						</Menu.Menu>
					</Menu.Item>
					<Menu.Item className="menu-item-logout">
						<Menu.Item className="menu-item-list"><i><Image src="/images/Sidebar/logout-icon.png"/></i><div className="menu_item_left"><span>LOGOUT</span></div></Menu.Item>
					</Menu.Item>
				</Menu>
			</div>
		);
	}
}


const allWorkplaces = gql`
  query allWorkplaces($brandid: Uuid!){ 
 	brandById(id: $brandid){
 	id
  	brandIconUrl
	workplacesByBrandId{
	    edges{
		    node{
				id
		        workplaceName
		      }
		    }		 
		}
	}
}`

const Nav = graphql(allWorkplaces, {
   options: (ownProps) => ({ 
     variables: {
       brandid: "5a14782b-c220-4927-b059-f4f22d01c230",
     }
   }),
 })(NavComponent)


export default Nav

// NOT FOR DEMO 

/*
			
			<Menu.Item><i><Image src="/images/Sidebar/time-attendance.png"/></i><div className="menu_item_left"><span>DASHBOARD</span></div></Menu.Item>

							<Menu.Header className="dropdown-menu-item">
							<select>
								<option value="volvo"><a>CHOOSE BRAND</a></option>
								<option value="saab">Brand1</option>
								<option value="opel">Brand2</option>
								<option value="audi">Brand3</option>
							</select>
						</Menu.Header>
	<Menu.Item className="menu-item-list"><i><Image src="/images/Sidebar/team-member.png"/></i><div className="menu_item_left"><span>TEAM MEMBERS</span></div></Menu.Item>
							<Menu.Item className="menu-item-list" as={NavLink} to="/hiring/opportunities"><i><Image src="/images/Sidebar/hiring.png"/></i><div className="menu_item_left"><span>HIRING</span></div></Menu.Item>
							<Menu.Item className="menu-item-list"><i><Image src="/images/Sidebar/positions.png"/></i><div className="menu_item_left"><span>POSITIONS</span></div></Menu.Item>
							<Menu.Item className="menu-item-list" as={NavLink} to="/workplaces/mine"><i><Image src="/images/Sidebar/my-workplace.png"/></i><div className="menu_item_left"><span>MY WORKPLACE</span></div></Menu.Item>
							<Menu.Item className="menu-item-list"><i><Image src="/images/Sidebar/settings.png"/></i><div className="menu_item_left"><span>SETTINGS</span></div></Menu.Item>

							<i>12</i>

*/
