import React, { Component } from 'react'
import Drawer from 'material-ui/Drawer';
import { find, pick } from 'lodash';
import { Header, Icon, Table, Image, List } from 'semantic-ui-react';
import FlatButton from 'material-ui/FlatButton';
import { Switch } from 'antd';

import CircleButton from '../../../helpers/CircleButton';
import Loading from '../../../helpers/Loading';

const unassignedTeamMember = {
  user: {
    id: 0,
    firstName: 'Unassigned',
    lastName: '',
    avatarUrl: 'http://www.iiitdm.ac.in/img/bog/4.jpg',
  },
  content: 'There is currenlty an open position',
  status: 'unassigned'
};

const User = ({ user }) => (
  <div className="content">
    <div className="avatar">
      <Image avatar src={user.avatarUrl} />
    </div>
    <div className="label text-uppercase">
      <b>{user.firstName}</b> {user.lastName}
    </div>
  </div>
);

class ShiftHistoryDrawerComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      shift: { ...props.shift, advance: {} }
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.open !== this.props.open) {
      this.setState((state) => ({
        shift: {
          ...state.shift,
          advance: state.shift.advance
        }
      }));
    }
  }

  handleBack = () => {
    this.props.handleBack(this.state.shift);
  };

  showDetails = (historyDetails, i) => {
    historyDetails[i].showDetails = !historyDetails[i].showDetails;
    this.setState({ historyDetails });
  };

  onAllowShadowingChange = (allowShadowing) => {
    this.setState((state) => ({
      shift: {
        ...state.shift,
        advance: state.shift.advance && { ...state.shift.advance, allowShadowing }
      }
    }));
  };

  render() {
    const {
      width = 600,
      open,
      openSecondary = true,
      docked = false
    } = this.props;

    const { shift: { advance } } = this.state;
    return (
      <Drawer docked={docked} width={width} openSecondary={openSecondary} onRequestChange={this.handleCloseDrawer}
              open={open}>
        <div className="drawer-section brand-drawer-section">
          <div className="drawer-heading drawer-head col-md-12">

            <FlatButton label="Back" onClick={this.handleBack}
                        icon={<Icon name="chevron left" className="floatLeft" /> } />
            <Header as='h2' textAlign='center'>
              ADVANCED OPTIONS
            </Header>

          </div>
          <div className="drawer-content advance-shift-drawer-content">

            {/* Allow job shadowing */}
            <div className="col-md-12">
              <p className="text-uppercase blue-heading">
                <strong> Allow Job Shadowers </strong> for increased sales and reduced costs
              </p>
              <div className="wrapper-element">
                <Switch checked={advance.allowShadowing || true}
                        name="allowJobShadowing" onChange={this.onAllowShadowingChange}
                        className="switchStyle"
                        circleStyles={{border: '1px solid #000', background: '#f00'}}
                        checkedChildren="YES" unCheckedChildren="NO" />
              </div>
              <div className="font-italic">
                <p>If you have more employees than shifts to be filled, the scheduling algorithm may
                  assign trainees to shifts that are assigned to approved job trainers. By default,
                  this option is enabled because cross-training results in improved sales and reduced costs.
                </p>
              </div>
            </div>

          </div>
        </div>
        <div className="drawer-footer">
          <div className="buttons text-center">
            <CircleButton type="white" title="GO BACK" handleClick={this.handleBack} />
          </div>
        </div>
      </Drawer>
    );
  };
}

export default ShiftHistoryDrawerComponent
