import React from 'react'
import Drawer from 'material-ui/Drawer';
import IconButton from 'material-ui/IconButton';
import { Image } from 'semantic-ui-react';
import RaisedButton from 'material-ui/RaisedButton';

import CircleButton from '../../helpers/CircleButton/index';
import './add-workplace-drawer.css';

const styles = {
	circleButton: {
		fontSize: 18,
		padding: '6px 5px',
		fontWeight: 'bold'
	}
};

const DrawerHelper = (props) => {
	let brandsCopy;
	const {
		closeDrawer = () => {
		},
		handleSubmit = () => {
		},
		width = 500,
		open = true,
		openSecondary = true,
		docked = false,
		brands = []
	} = props;

	// Add a select item to list
	if (brands[0] && brands[0].id !== -1) {
		brandsCopy = [{
			id: -1,
			name: 'Select Brand'
		}, ...brands];
	}

	const states = [{
		id: -1,
		name: 'SELECT STATE',
		value: -1
	}, {
		id: 1,
		name: 'California',
		value: 'ca'
	}, {
		id: 2,
		name: 'Texas',
		value: 'tx'
	}];

	const handleSubmitEvent = (event) => {
		// Resetting the field values.
		document.getElementById('workplace-name').value = '';
		document.getElementById('address-line').value = '';
		handleSubmit(event);
	};

	const handleImageUploadClick = (event) => {
		// handle image upload code here.
		console.log('Image upload button clicked');
	};

	return (
		<Drawer docked={docked} width={width} openSecondary={openSecondary} onRequestChange={closeDrawer} open={open}>
			<div className="drawer-section add-workplace-drawer-section">
				<div className="drawer-heading col-md-12">
					<IconButton onClick={closeDrawer}>
						<Image src='/images/Icons_Red_Cross.png' size="mini" />
					</IconButton>
					<h2 className="text-center text-uppercase">Add Workplace</h2>
				</div>
				<div className="upload-wrapper col-md-8 col-md-offset-2 text-center">
					<Image onClick={handleImageUploadClick} src='/images/cloudshare.png' size="small" className="upload-img"/>
					<RaisedButton
						className="upload-btn"
						label="Upload Workplace Image"
						backgroundColor="#0022A1"
						labelColor="#fff"
						onClick={handleImageUploadClick}
					/>
					<p className="text-uppercase upload-desc">
						Or Drag and Drop File
					</p>
				</div>
				<div className="col-md-12 form-div">
					<div className="form-group">
						<label className="text-uppercase">Workplace Name</label>
						<input id="workplace-name" type="text" className="form-control" />
					</div>
					<div className="form-group">
						<label className="text-uppercase">Brand</label>
						<select className="form-control">
							{brandsCopy && brandsCopy.map(brand =>
								<option key={brand.id} value={brand.id}>{brand.name}</option>
							)}
						</select>
					</div>
					<div className="form-group">
						<label className="text-uppercase">Address Line1</label>
						<input id="address-line" type="text" className="form-control" />
					</div>
					<div className="form-group">
						<label className="text-uppercase">Address Line2</label>
						<input id="address-line" type="text" className="form-control" />
					</div>
					<div className="inline-form form-inline">
						<div className="form-group">
							<label htmlFor="city" className="text-uppercase">City</label>
							<input type="email" className="form-control" id="city" />
						</div>
						<div className="form-group">
							<label className="text-uppercase">State</label>
							<select className="form-control">
								{states && states.map(state =>
									<option key={state.id} value={state.id}>{state.name}</option>
								)}
							</select>
						</div>
						<div className="form-group">
							<label htmlFor="zip" className="text-uppercase">Zip Code:</label>
							<input type="password" className="form-control" id="zip" />
						</div>
					</div>
					<div className="buttons text-center">
						<CircleButton style={styles.circleButton} handleClick={closeDrawer} type="white"
						              title="Cancel" />
						<CircleButton style={styles.circleButton} handleClick={handleSubmitEvent} type="blue"
						              title="Add Workplace" />
					</div>

				</div>
			</div>
		</Drawer>
	);
};

export default DrawerHelper;
