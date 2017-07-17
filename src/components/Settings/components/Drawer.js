import React from 'react'
import Drawer from 'material-ui/Drawer';
import IconButton from 'material-ui/IconButton';
import Close from 'material-ui/svg-icons/navigation/close';
import {red600} from 'material-ui/styles/colors';

import CircleButton from '../../helpers/CircleButton';

const styles = {
	icons: {
		mediumIcon: {
			width: 48,
			height: 48,
			color: '#c3c3c3',
		},
		medium: {
			width: 96,
			height: 96,
			padding: 24,
			boxShadow: '1px 2px 3px #fff',
			borderRadius: '50%'
		},
	}
};

const DrawerHelper = (props) => {
	return (
		<Drawer width={props.width} openSecondary={true} open={props.open} >
			<div className="main-section">
				<div className="heading">
					<IconButton
						iconStyle={styles.mediumIcon}
						style={styles.medium}
					    onClick={props.closeDrawer}
					>
						<Close color={red600} />
					</IconButton>
					<h2 className="text-center text-uppercase">Add Company</h2>
				</div>
				<div className="col-md-12 form-div">
				<div className="form-group">
					<label className="text-uppercase">Company Name</label>
					<input type="text" className="form-control" />
				</div>
				<div className="buttons text-center">
					<CircleButton handleClick={props.closeDrawer} type="white" title="Cancel" />
					<CircleButton handleClick={props.handleSubmit} type="blue" title="Add Company" />
				</div>

				</div>
			</div>
		</Drawer>
	);
};

export default DrawerHelper;
