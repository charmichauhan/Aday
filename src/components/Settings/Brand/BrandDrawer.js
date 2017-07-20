import React, { Component } from 'react'
import Drawer from 'material-ui/Drawer';
import IconButton from 'material-ui/IconButton';
import { Image } from 'semantic-ui-react';
import RaisedButton from 'material-ui/RaisedButton';
import cloneDeep from 'lodash/cloneDeep';

import CircleButton from '../../helpers/CircleButton/index';

const initialState = {
	brand: {
		id: '',
		name: '',
		image: ''
	}
};

class DrawerHelper extends Component {
	constructor(props) {
		super(props);
		this.state = {
			brand: cloneDeep(props.brand) || cloneDeep(initialState.brand)
		};
	}

	componentWillReceiveProps(nextProps) {
		const brand = cloneDeep(nextProps.brand) || cloneDeep(initialState.brand);
		this.setState({ brand });
	}

	handleSubmitEvent = (event) => {
		// Resetting the field values.
		document.getElementById('brand-name').value = '';
		this.setState({ ...initialState });
		this.props.handleSubmit(event);
	};

	handleImageUploadClick = (event) => {
		// handle image upload code here.
		console.log('Image upload button clicked');
	};

	handleChange = (event) => {
		const { name, value } = event.target;
		const brand = Object.assign(this.state.brand, { [name]: value });
		this.setState({ brand });
	};

	render() {
		const {
			closeDrawer = () => {
			},
			brand = {},
			width = 500,
			open = true,
			openSecondary = true,
			docked = false
		} = this.props;
		const brandId = brand && brand.id;
		const messages = {
			title: (brandId && 'Update Brand') || 'Add Brand',
			buttonText: (brandId && 'Update Brand') || 'Add Brand'
		};
		const DrawerBrand = this.state.brand;
		return (
			<Drawer docked={docked} width={width} openSecondary={openSecondary} onRequestChange={closeDrawer}
			        open={open}>
				<div className="drawer-section add-brand-drawer-section">
					<div className="drawer-heading col-md-12">
						<IconButton onClick={closeDrawer}>
							<Image src='/images/Icons_Red_Cross.png' size="mini" />
						</IconButton>
						<h2 className="text-center text-uppercase">{messages.title}</h2>
					</div>
					{DrawerBrand.image && <div className="upload-wrapper col-md-8 col-md-offset-2 text-center">
						<Image onClick={this.handleImageUploadClick} src='/images/cloudshare.png' size="small"
						       className="upload-img" />
						<RaisedButton
							className="upload-btn"
							label="Upload Workplace Image"
							backgroundColor="#0022A1"
							labelColor="#fff"
							onClick={this.handleImageUploadClick}
						/>
						<p className="text-uppercase upload-desc">
							Or Drag and Drop File
						</p>
					</div>}
					{DrawerBrand.image && <Image className="uploaded-image" src={DrawerBrand.image} size="large" />}
					<div className="col-md-12 form-div">
						<div className="form-group">
							<label className="text-uppercase">Brand Name</label>
							<input
								id="brand-name"
								type="text"
								name="name"
								value={DrawerBrand.name}
								onChange={this.handleChange}
								className="form-control" />
						</div>
					</div>
				</div>
				<div className="drawer-footer">
					<div className="buttons text-center">
						<CircleButton handleClick={closeDrawer} type="white" title="Cancel" />
						<CircleButton handleClick={this.handleSubmitEvent} type="blue"
						              title={messages.buttonText} />
					</div>
				</div>
			</Drawer>
		);
	};
}

export default DrawerHelper;
