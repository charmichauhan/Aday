import React from 'react'
import Drawer from 'material-ui/Drawer';
import IconButton from 'material-ui/IconButton';
import { Image } from 'semantic-ui-react';

import CircleButton from '../../helpers/CircleButton/index';

const DrawerHelper = (props) => {
	const {
		closeDrawer = () => {},
		handleSubmit = () => {},
		width = 500,
		open = true,
		openSecondary = true,
		docked = false
	} = props;
	const handleSubmitEvent = (event) => {
		// Resetting the field values.
		document.getElementById('brand-name').value = '';
		handleSubmit(event);
	};
	return (
		<Drawer docked={docked} width={width} openSecondary={openSecondary} onRequestChange={closeDrawer} open={open} >
			<div className="drawer-section add-brand-drawer-section">
				<div className="drawer-heading col-md-12">
					<IconButton onClick={closeDrawer} >
						<Image src='/images/Icons_Red_Cross.png' size="mini"/>
					</IconButton>
					<h2 className="text-center text-uppercase">Add Brand</h2>
				</div>
				<div className="col-md-12 form-div">
					<div className="form-group">
						<label className="text-uppercase">Brand Name</label>
						<input id="brand-name" type="text" className="form-control" />
					</div>
					<div className="buttons text-center">
						<CircleButton handleClick={closeDrawer} type="white" title="Cancel" />
						<CircleButton handleClick={handleSubmitEvent} type="blue" title="Add Brand" />
					</div>

				</div>
			</div>
		</Drawer>
	);
};

export default DrawerHelper;
