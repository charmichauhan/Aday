import React, {Component} from "react";
import Drawer from "material-ui/Drawer";
import IconButton from "material-ui/IconButton";
import RaisedButton from "material-ui/RaisedButton";
import {Image, Rating, Grid} from "semantic-ui-react";
import Delete from 'material-ui/svg-icons/action/delete';
import Checkbox from 'material-ui/Checkbox';
import {find, pick} from "lodash";
import {leftCloseButton} from "../../styles";
import "../team.css";
const uuidv4 = require('uuid/v4');
const styles={
  iconStyles: {
    margin: '5px 6px',
    width: 36,
    height: 36
  }
}
export default class ProfileDrawer extends Component {

  render() {
    const {
      shift = {},
      width = 600,
      openSecondary = true,
      docked = false,
      open
    } = this.props;
    return (
      <Drawer docked={docked} width={width}
              openSecondary={openSecondary}
              onRequestChange={this.handleCloseDrawer}
              open={open}>
        <div className="drawer-section profile-drawer">
          <div className="profile-drawer-heading">
            <div className="drawer-heading col-md-12">
              <IconButton style={leftCloseButton} onClick={this.props.handleCloseDrawer}>
                <Image src="/images/Icons_Red_Cross.png" size="mini"/>
              </IconButton>
              <h5 className="confirm-popup">ALBERTO KELLY </h5>
              <div className="drawer-right">
                <RaisedButton label="RESUME" onClick={this.props.openResumeDrawer}/>
              </div>
              <Image centered='true' size='small' shape='circular' className="profile-img"
                     src="https://s3.us-east-2.amazonaws.com/harvard-operations-pics/Operations/RA/andreas-horava.jpg"/>
            </div>
          </div>
          <div className="heading-rating">
            <Rating icon='star' defaultRating={5} maxRating={5}/>
          </div>
          <div className="drawer-content scroll-div">
            <div className="member-list">
              <div className="text-center profile-drawer-title">
                <h2 className="text-uppercase">Hourly Limits</h2>
              </div>
              <form className="form-inline max-hours-form">
                <div className="form-group daily">
                  <label htmlFor="daily" className="text-uppercase">Max <strong> Daily </strong> Hours</label>
                  <input type="text" className="form-control"/>
                </div>
                <div className="form-group weekly">
                  <label htmlFor="weekly" className="text-uppercase">Max <strong> Weekly </strong> Hours</label>
                  <input type="text" className="form-control"/>
                </div>
                <div className="form-group monthly">
                  <label htmlFor="monthly" className="text-uppercase">Max <strong> Monthly </strong> Hours</label>
                  <input type="text" className="form-control"/>
                </div>


              </form>
              <div className="profile-drawer-content text-center">
                <p>Team members with their maximum weekly hours set at or below 30 hours per week are not
                  included in the automated schedule</p>
              </div>
              <div className="update-limit-btn text-center">
                <button className="btn text-uppercase btn-default">Update Limits</button>
              </div>
              <div className="text-center profile-drawer-title">
                <h2 className="text-uppercase">Alberto's Positions</h2>
              </div>
              <div className="grid-positions">
                <Grid columns={3}>
                  <Grid.Row>
                    <Grid.Column width={3}>
                      <i className="icon-circle-td"><Image src="/images/Sidebar/positions.png" size="mini" /></i>
                    </Grid.Column>
                    <Grid.Column width={10}>
                      <div>
                        <p className="cook-name">Second Order Cook</p>
                        <Rating icon='star' defaultRating={5} maxRating={5}/>
                        <span className="text-uppercase green">Primary Position</span>
                      </div>
                    </Grid.Column>
                    <Grid.Column width={3}>
                      <Delete style={styles.iconStyles} color="gray" />
                    </Grid.Column>
                  </Grid.Row>
                  <Grid.Row>
                    <Grid.Column width={3}>
                      <i className="icon-circle-td"><Image src="/images/Sidebar/positions.png" size="mini"/></i>
                    </Grid.Column>
                    <Grid.Column width={10}>
                      <div>
                        <p className="cook-name">First Order Cook</p>
                        <Rating icon='star' defaultRating={5} maxRating={5}/>
                        <Checkbox/> <span className="text-uppercase green">Primary Position</span>
                      </div>
                    </Grid.Column>
                    <Grid.Column width={3}>
                      <Delete style={styles.iconStyles} color="gray" />
                    </Grid.Column>
                  </Grid.Row>
                  <Grid.Row>
                    <Grid.Column width={3}>
                      <i className="icon-circle-td"><Image src="/images/Sidebar/positions.png" size="mini" /></i>
                    </Grid.Column>
                    <Grid.Column width={10}>
                      <div>
                        <p className="cook-name">Catering</p>
                        <Rating icon='star' defaultRating={5} maxRating={5}/>
                        <span className="text-uppercase green">Primary Position</span>
                      </div>
                    </Grid.Column>
                    <Grid.Column width={3}>
                      <Delete style={styles.iconStyles} color="gray" />
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
              </div>
              <div className="text-center profile-drawer-title">
                <h2 className="text-uppercase">Cross-Training Progress</h2>
              </div>
              <div className="grid-positions">
                <Grid columns={3}>
                  <Grid.Row>
                    <Grid.Column width={3}>
                      <i className="icon-circle-td"><Image src="/images/Sidebar/positions.png" size="mini" /></i>
                    </Grid.Column>
                    <Grid.Column width={10}>
                      <div>
                        <Rating icon='star' defaultRating={5} maxRating={5}/>
                      </div>
                    </Grid.Column>
                    <Grid.Column width={3}>
                      <i className="fa fa-check fa-3x" />
                    </Grid.Column>
                  </Grid.Row>
                  <Grid.Row>
                    <Grid.Column width={3}>
                      <i className="icon-circle-td"><Image src="/images/Sidebar/positions.png" size="mini" /></i>
                    </Grid.Column>
                    <Grid.Column width={10}>
                      <div>
                        <Rating icon='star' defaultRating={5} maxRating={5}/>
                      </div>
                    </Grid.Column>
                    <Grid.Column width={3}>
                      <i className="fa fa-check fa-3x" />
                    </Grid.Column>
                  </Grid.Row>
                  <Grid.Row>
                    <Grid.Column width={3}>
                      <i className="icon-circle-td"><Image src="/images/Sidebar/positions.png" size="mini" /></i>
                    </Grid.Column>
                    <Grid.Column width={10}>
                      <div>
                        <Rating icon='star' defaultRating={5} maxRating={5}/>
                      </div>
                    </Grid.Column>
                    <Grid.Column width={3}>
                      <i className="fa fa-check fa-3x" />
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
              </div>
            </div>
          </div>
          <div className="block-limit-btn text-center">
            <button className="btn text-uppercase btn-default">Block Alberto</button>
          </div>
        </div>
      </Drawer>
    );
  };
}
