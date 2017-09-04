import React, { Component } from 'react'
import Drawer from 'material-ui/Drawer';
import IconButton from 'material-ui/IconButton';
import { Image } from 'semantic-ui-react';
import cloneDeep from 'lodash/cloneDeep';

import { closeButton } from '../../styles';
import CircleButton from '../../helpers/CircleButton';

class DrawerHelper extends Component {

  constructor(props) {
    super(props);
    this.state = {
      corporation: cloneDeep(props.corporation)
    }
  }

  componentWillReceiveProps(nextProps) {
    const corporation = cloneDeep(nextProps.corporation);
    this.setState({ corporation });
  }

  handleChange = (event) => {
    const { corporation } = this.state;
    const { name, value } = event.target;
    corporation[name] = value;
    this.setState({ corporation });
  };

  render() {

    const { width, open, closeDrawer, handleSubmit } = this.props;
    const { corporation } = this.state;

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
              <input
                id="corporation-name"
                name="corporationName"
                value={corporation.corporationName}
                type="text"
                onChange={this.handleChange}
                className="form-control" />
            </div>
            <div className="drawer-footer">
              <div className="buttons text-center">
                <CircleButton handleClick={closeDrawer} type="white" title="Cancel" />
                <CircleButton handleClick={() => handleSubmit(corporation)} type="blue" title="Update Name" />
              </div>
            </div>
          </div>
        </div>
      </Drawer>
    );
  }
}

export default DrawerHelper;
