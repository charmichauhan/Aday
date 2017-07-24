import React, { Component } from 'react';
import { Menu, Icon, Image } from 'semantic-ui-react';
import { NavLink } from 'react-router-dom';
import EmergencyShiftButton from './KendallLearning/EmergencyShiftButton';
import './nav.css';
const styles = {
    menuStyle:{
    	width:200,
		height:42
	}
};
export default class Nav extends Component {
	render() {
		return (
			<div className="left-menu_item">
				{/*<EmergencyShiftButton/>*/}
				<Menu vertical fluid>
					<Menu.Item className="menu-item">
						<Menu.Header><Image src="/images/logos_aday.png" width="102" height="31" centered={true}/></Menu.Header>
						<Menu.Header><Image src="/images/burger-king.png" width="75" height="75" centered={true}/></Menu.Header>
						<Menu.Header className="dropdown-menu-item">
							<select>
								<option value="volvo"><a>CHOOSE BRAND</a></option>
								<option value="saab">Brand1</option>
								<option value="opel">Brand2</option>
								<option value="audi">Brand3</option>
							</select>
						</Menu.Header>
						<Menu.Header>
							<select>
								<option value="volvo"><a>CHOOSE STORE</a></option>
								<option value="saab">Store1</option>
								<option value="opel">Store2</option>
								<option value="audi">Store3</option>
							</select>
						</Menu.Header>
					</Menu.Item>
					<Menu.Item className="menu-item">
						<Menu.Menu>
							<Menu.Item><i><Image src="/images/Sidebar/time-attendance.png"/></i><div className="menu_item_left"><span>DASHBOARD</span></div></Menu.Item>
							<Menu.Item><i><Image src="/images/Sidebar/emergency-shifts.png"/></i><div className="menu_item_left"><span>EMERGENCY SHIFT</span></div></Menu.Item>
						</Menu.Menu>
					</Menu.Item>
					<Menu.Item className="menu-item">
						<Menu.Menu>
							<Menu.Item className="menu-item-list" as={NavLink} to="/schedule/team"><i><Image src="/images/Sidebar/schedule.png"/></i><div className="menu_item_left"><span>SCHEDULE</span><i>12</i></div></Menu.Item>
							<Menu.Item className="menu-item-list" as={NavLink} to="/attendance/requests"><i><Image src="/images/Sidebar/time-attendance.png"/></i><div className="menu_item_left"><span>TIME & ATTENDANCE</span></div></Menu.Item>
							<Menu.Item className="menu-item-list"><i><Image src="/images/Sidebar/team-member.png"/></i><div className="menu_item_left"><span>TEAM MEMBERS</span></div></Menu.Item>
							<Menu.Item className="menu-item-list" as={NavLink} to="/hiring/opportunities"><i><Image src="/images/Sidebar/hiring.png"/></i><div className="menu_item_left"><span>HIRING</span></div></Menu.Item>
							<Menu.Item className="menu-item-list" as={NavLink} to="/positions"><i><Image src="/images/Sidebar/positions.png"/></i><div className="menu_item_left"><span>POSITIONS</span></div></Menu.Item>
							<Menu.Item className="menu-item-list" as={NavLink} to="/workplaces/mine"><i><Image src="/images/Sidebar/my-workplace.png"/></i><div className="menu_item_left"><span>MY WORKPLACE</span></div></Menu.Item>
							<Menu.Item className="menu-item-list" as={NavLink} to="/settings"><i><Image src="/images/Sidebar/settings.png"/></i><div className="menu_item_left"><span>SETTINGS</span></div></Menu.Item>
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
