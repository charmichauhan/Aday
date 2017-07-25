import React, { Component } from 'react'
import Drawer from 'material-ui/Drawer';
import IconButton from 'material-ui/IconButton';
import { Image, Dropdown } from 'semantic-ui-react';
import RaisedButton from 'material-ui/RaisedButton';
import { cloneDeep, map } from 'lodash';
import Dropzone from 'react-dropzone';

import CircleButton from '../../helpers/CircleButton/index';
import { stateOptions } from '../../helpers/common/states';
import { closeButton, colors } from '../../styles';

import './workplace-drawer.css';

const initialState = {
	workplace: {
		id: '',
		name: '',
		type: '',
		image: '',
		addressLine1: '',
		addressLine2: '',
		city: '',
		zip: ''
	}
};

const styles = {
	circleButton: {
		fontSize: 18,
		padding: '6px 5px',
		fontWeight: 'bold'
	},
	closeButton
};

class DrawerHelper extends Component {
	constructor(props) {
		super(props);
		this.state = {
			workplace: cloneDeep(props.workplace || initialState.workplace)
		};
	}

	componentWillReceiveProps(nextProps) {
		const workplace = cloneDeep(nextProps.workplace || initialState.workplace);
		this.setState({ workplace });
	}

	handleSubmitEvent = (event) => {
		// Resetting the field values.
		this.setState({ ...initialState });
		this.props.handleSubmit(event);
	};

	handleImageUpload = (files) => {
		debugger;
		// handle image upload code here.
		console.log('Image upload button clicked');
		const workplace = Object.assign(this.state.workplace, { image: files[0] });
		this.setState({ workplace, blob: files[0] });
	};

	handleNewImageUpload = (files) => {
		files[0].preview = window.URL.createObjectURL(files[0]);
		this.handleImageUpload(files);
	};

	handleChange = (event) => {
		const { name, value } = event.target;
		const workplace = Object.assign(this.state.workplace, { [name]: value });
		this.setState({ workplace });
	};

	render() {
		const {
			closeDrawer = () => {
			},
			workplace = {},
			brands = [],
			width = 600,
			open = true,
			openSecondary = true,
			docked = false
		} = this.props;
		const workplaceId = workplace && workplace.id;
		const messages = {
			title: (workplaceId && 'Update Workplace') || 'Add Workplace',
			buttonText: (workplaceId && 'Update Workplace') || 'Add Workplace'
		};
		const brandOptions = map(brands, brand => ({ key: brand.id, value: brand.id, text: brand.name }));
		const DrawerWorkplace = this.state.workplace;
		return (
			<Drawer docked={docked} width={width} openSecondary={openSecondary} onRequestChange={closeDrawer}
			        open={open}>
				<div className="drawer-section workplace-drawer-section">
					<div className="drawer-heading col-md-12">
						<IconButton style={styles.closeButton} onClick={closeDrawer}>
							<Image src='/images/Icons_Red_Cross.png' size="mini" />
						</IconButton>
						<h2 className="text-center text-uppercase">{messages.title}</h2>
					</div>
					{!DrawerWorkplace.image && !this.state.blob && <div className="upload-wrapper col-md-8 col-md-offset-2 text-center">
						<Dropzone
							multiple={false}
							accept="image/*"
							onDrop={this.handleImageUpload}
							style={{}}>
							<Image src='/images/cloudshare.png' size="small" className="upload-img" />
							<RaisedButton
								containerElement='label'
								className="upload-btn"
								label="Upload Workplace Image"
								backgroundColor="#0022A1"
								labelColor="#fff"
							/>
							<p className="text-uppercase upload-desc">
								Or Drag and Drop File
							</p>
						</Dropzone>
					</div>}
					{DrawerWorkplace.image && !this.state.blob &&
						<Image className="uploaded-image" src={DrawerWorkplace.image} size="large" />
					}
					{this.state.blob &&
						<Image className="uploaded-image" src={this.state.blob.preview} size="large" />
					}
					{(DrawerWorkplace.image || this.state.blob) && <RaisedButton
							backgroundColor={colors.primaryBlue}
							labelColor="#fafafa"
							className='upload-btn'
							containerElement='label'
							label='Change image'>
							<input type='file' onChange={(e) => this.handleNewImageUpload(e.target.files)} />
					</RaisedButton>}
					<div className="col-md-12 form-div">
						<div className="form-group">
							<label className="text-uppercase">Workplace Name</label>
							<input name="name"
							       onChange={this.handleChange}
							       value={DrawerWorkplace.name}
							       id="workplace-name"
							       type="text"
							       className="form-control" />
						</div>
						<div className="form-group">
							<label className="text-uppercase">Brand</label>
							<Dropdown className="form-control semantic-drawer-drop-down" placeholder="Brand" search
							          selection
							          options={brandOptions} />
						</div>
						<div className="form-group">
							<label className="text-uppercase">Address Line1</label>
							<input name="addressLine1"
							       onChange={this.handleChange}
							       value={DrawerWorkplace.addressLine1}
							       id="address-line1"
							       type="text"
							       className="form-control" />
						</div>
						<div className="form-group">
							<label className="text-uppercase">Address Line2</label>
							<input name="addressLine2"
							       onChange={this.handleChange}
							       value={DrawerWorkplace.addressLine2}
							       id="address-line2"
							       type="text"
							       className="form-control" />
						</div>
						<div className="inline-form form-inline">
							<div className="form-group">
								<label htmlFor="city" className="text-uppercase">City</label>
								<input name="city"
								       onChange={this.handleChange}
								       value={DrawerWorkplace.city}
								       type="text"
								       className="form-control"
								       id="city" />
							</div>
							<div className="form-group">
								<label className="text-uppercase">State</label>
								<Dropdown className="form-control semantic-drawer-drop-down" placeholder="State" search
								          selection
								          options={stateOptions} />
							</div>
							<div className="form-group">
								<label htmlFor="zip" className="text-uppercase">Zip Code:</label>
								<input name="zip"
								       onChange={this.handleChange}
								       value={DrawerWorkplace.zip}
								       type="text"
								       className="form-control"
								       id="zip" />
							</div>
						</div>
					</div>
				</div>
				<div className="drawer-footer">
					<div className="buttons text-center">
						{workplaceId && <CircleButton style={styles.circleButton} handleClick={closeDrawer} type="white"
						              title="Cancel" />}
						<CircleButton style={styles.circleButton} handleClick={this.handleSubmitEvent} type="blue"
						              title={messages.buttonText} />
					</div>
				</div>
			</Drawer>
		);
	};
}

export default DrawerHelper;
