import React from 'react'
import Drawer from 'material-ui/Drawer';
import IconButton from 'material-ui/IconButton';
import { Image } from 'semantic-ui-react';

import { closeButton } from '../../styles';
import CircleButton from '../../helpers/CircleButton/index';

const DrawerHelper = (props) => {

  const handleSubmit = (event) => {
    // Resetting the field values.
    document.getElementById('company-name').value = '';
    props.handleSubmit(event);
  };

  const { width, open, closeDrawer, company } = props;
  return (
    <Drawer
      width={width}
      openSecondary={true}
      docked={false}
      onRequestChange={closeDrawer} open={open}>
      <div className="drawer-section edit-drawer-section">
        <div className="drawer-heading col-md-12">
          <IconButton style={closeButton} onClick={closeDrawer}>
            <Image src='/images/Icons_Red_Cross.png' size="mini" />
          </IconButton>
          <h2 className="text-center text-uppercase">Edit Company Name</h2>
        </div>
        <div className="col-md-12 form-div">
          <div className="form-group">
            <label className="text-uppercase">Company Name</label>
            <input id="company-name" value={company.name} type="text" className="form-control" />
          </div>
          <div className="drawer-footer">
            <div className="buttons text-center">
              <CircleButton handleClick={closeDrawer} type="white" title="Cancel" />
              <CircleButton handleClick={handleSubmit} type="blue" title="Update Name" />
            </div>
          </div>

        </div>
      </div>
    </Drawer>
  );
};

export default DrawerHelper;
