import React from 'react'
import Drawer from 'material-ui/Drawer';
import IconButton from 'material-ui/IconButton';
import { Image } from 'semantic-ui-react';

import CircleButton from '../../helpers/CircleButton/index';

const DrawerHelper = (props) => {
	const handleSubmit = (event) => {
		// Resetting the field values.
		document.getElementById('company-name').value = '';
		props.handleSubmit(event);
	};
	return (
		<Drawer width={props.width} openSecondary={true} open={props.open} >
			<div className="drawer-section edit-drawer-section">
				<div className="drawer-heading col-md-12">
					<IconButton onClick={props.closeDrawer} >
						<Image src='/images/Icons_Red_Cross.png' size="mini"/>
					</IconButton>
					<h2 className="text-center text-uppercase">Edit Company Name</h2>
				</div>
				<div className="col-md-12 form-div">
				<div className="form-group">
					<label className="text-uppercase">Company Name</label>
					<input id="company-name" type="text" className="form-control" />
				</div>
				<div className="buttons text-center">
					<CircleButton handleClick={props.closeDrawer} type="white" title="Cancel" />
					<CircleButton handleClick={handleSubmit} type="blue" title="Update Name" />
				</div>

				</div>
			</div>
		</Drawer>
	);
};

export default DrawerHelper;
