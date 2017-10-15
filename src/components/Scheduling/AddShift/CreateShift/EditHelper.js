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
		this.props.closeDrawer()
    	this.setState({editOpen: false, open: false, recurring: false});
   	};

   	openCreateDrawer = (recurring) => {
   		if (recurring){
   			this.setState({ recurring: true})
   		} else {
       		this.setState({editOpen: true});
    	};
   	};

    render() {
	   return (
	   	<div>
      	<Drawer
        width={this.props.width}
        className="shift-section"
        openSecondary={true}
        docked={false}
        onRequestChange={this.handleCloseDrawer} open={this.state.open}>
        <div className="drawer-section edit-drawer-section">
          <div className="drawer-heading col-md-12" style={{
            display: 'flex',
            flexDirection: 'row',
            backgroundColor: 'ghostwhite',
            borderBottom: '1px solid #DCDCDC'
          }}>

            <div style={{ flex: 3, alignSelf: 'center', marginLeft: 5 }}>
              <IconButton className="pull-left" style={closeButton} onClick={this.handleCloseDrawer}>
                <Image src='/images/Icons_Red_Cross.png' size="mini" />
              </IconButton>
            </div>  

            <div style={{ flex: 11, alignSelf: 'center' }}>
              <span className="drawer-title"> Editing A Repeating Shift </span>
            </div>

            <div style={{ flex: 2, alignSelf: 'center' }}>
            </div>
          </div>

          <div className="col-md-12 form-div edit-drawer-content">
          	    <Grid.Row>
	                <Grid.Column width={2} style={{ marginLeft: 20, paddingTop: 10 }}>
	                 	<Button onClick={() => this.openCreateDrawer(false)}> Single Edit </Button>
	                </Grid.Column>
	                <Grid.Column width={5} style={{ marginLeft: 40, marginRight: 40, paddingTop: -50 }}>
	                 Edit the shift on this day. This will NOT affect any other shift in this repeating shift series.
	                </Grid.Column>
	             </Grid.Row>	
	            
	            <Grid.Row>
                <Grid.Column width={2} style={{ marginLeft: 20, paddingTop: 10 }}>
                  		<Button onClick={() => this.openCreateDrawer(true)}> All Repeating </Button>
                </Grid.Column>
               	<Grid.Column width={5} style={{ marginLeft: 40, marginRight: 40, paddingTop: -50 }}>
	                 Edit will affect every shift in this repeating shift series. This will recreate repeating shifts on days where shifts have been previously deleted.
	            </Grid.Column>
              </Grid.Row>		
          </div>

          		

          </div>
          	</Drawer>
	          	<DrawerHelper
			      width={this.props.width}
			      open={this.state.editOpen}
			      shift={this.props.shift}
			      users={this.props.users}
			      managers={this.props.managers}
			      weekStart={this.props.weekStart}
			      handleSubmit={this.props.handleSubmit}
			      handleAdvance={this.props.handleAdvance}
			      closeDrawer={this.handleCloseDrawer} 
			      isPublished={this.props.isPublished}
			      recurringEdit={false}
				  /> 
	           	<DrawerHelper
			      width={this.props.width}
			      open={this.state.recurring}
			      shift={this.props.shift}
			      users={this.props.users}
			      managers={this.props.managers}
			      weekStart={this.props.weekStart}
			      handleSubmit={this.props.handleSubmit}
			      handleAdvance={this.props.handleAdvance}
			      closeDrawer={this.handleCloseDrawer} 
			      isPublished={this.props.isPublished}
			      recurringEdit={true}
				  /> 
		 </div>
	   ) 
   } 
}
