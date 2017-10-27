import React, { Component } from 'react'
import Drawer from 'material-ui/Drawer';
import IconButton from 'material-ui/IconButton';
import { closeButton } from '../../../styles';
import dataHelper from '../../../helpers/common/dataHelper';
import { Image, TextArea, Dropdown, Grid, Button } from 'semantic-ui-react';
import DrawerHelper from './CreateShiftDrawer';

export default class EditHelper extends Component {
	constructor(props) {
	    super(props);
	    this.state = {
	    	open: this.props.open || false,
	    	editOpen: false,
	    	recurring: false,
	    }
	 }

	handleCloseDrawer = () => {
    	this.setState({editOpen: false, open: false, recurring: false});
    	this.props.closeDrawer()
   	};

   	openCreateDrawer = (recurring) => {
   		this.setState({ recurring: recurring, editOpen: true})
   	};

    render() {

	   return (
	   	<div>
	   			
		 </div>
	   ) 
   } 
}
