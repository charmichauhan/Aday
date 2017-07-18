import React from 'react'
import Drawer from 'material-ui/Drawer';
import IconButton from 'material-ui/IconButton';
import { Image } from 'semantic-ui-react';

import CircleButton from '../../helpers/CircleButton/index';

const styles = {
	circleButton: {
		fontSize: 18,
		padding: '6px 5px',
		fontWeight: 'bold'
	}
};

const DrawerHelper = (props) => {
	const {
		closeDrawer = () => {},
		handleSubmit = () => {},
		width = 500,
		open = true,
		openSecondary = true,
		anchor = 'right',
		brands = []
	} = props;

	// Add a select item to list
	if (brands[0] && brands[0].id !== -1) {
		brands.unshift({
			id: -1,
			name: 'Select Brand'
		});
	}
	const handleSubmitEvent = (event) => {
		// Resetting the field values.
		document.getElementById('workplace-name').value = '';
		document.getElementById('address-line').value = '';
		handleSubmit(event);
	};
	return (
		<Drawer anchor={anchor} width={width} openSecondary={openSecondary} open={open} >
			<div className="drawer-section add-workplace-drawer-section">
				<div className="drawer-heading col-md-12">
					<IconButton onClick={closeDrawer} >
						<Image src='/images/Icons_Red_Cross.png' size="mini"/>
					</IconButton>
					<h2 className="text-center text-uppercase">Add Workplace</h2>
				</div>
				<div className="col-md-12 form-div">
					<div className="form-group">
						<label className="text-uppercase">Workplace Name</label>
						<input id="workplace-name" type="text" className="form-control" />
					</div>
					<div className="form-group">
						<label className="text-uppercase">Brand</label>
						<select className="form-control">
							{brands && brands.map(brand =>
								<option key={brand.id} value={brand.id}>{brand.name}</option>
							)}
						</select>
					</div>
					<div className="form-group">
						<label className="text-uppercase">Address Line</label>
						<input id="address-line" type="text" className="form-control" />
					</div>
					<div className="buttons text-center">
						<CircleButton style={styles.circleButton} handleClick={closeDrawer} type="white" title="Cancel" />
						<CircleButton style={styles.circleButton} handleClick={handleSubmitEvent} type="blue" title="Add Workplace" />
					</div>

				</div>
			</div>
		</Drawer>
	);
};

export default DrawerHelper;
