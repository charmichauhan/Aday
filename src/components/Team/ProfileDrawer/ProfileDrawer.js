import React, {Component} from "react";
import Drawer from "material-ui/Drawer";
import IconButton from "material-ui/IconButton";
import RaisedButton from "material-ui/RaisedButton";
import {Image, Rating} from "semantic-ui-react";
import { find, pick, cloneDeep } from "lodash";
import {leftCloseButton} from "../../styles";
import {graphql, compose} from "react-apollo";
import TabPanel from "./TabPanel";
import {userQuery, releventPositionsQuery} from "../Team.graphql";
import "../team.css";
const uuidv4 = require('uuid/v4');

class ProfileDrawerComponent extends Component {

  filterCrossTraining = (releventPositionsQuery) => {
    releventPositionsQuery.filter((w) => {
        if (w.jobsByPositionId.nodes.length > 0) {
          debugger;
          for (let i = 0; i < w.jobsByPositionId.nodes.length ; i++) {
            if (!w.jobsByPositionId.nodes[i].isPositionActive) {
              return true;
            }
          }
        }
      }
    )
  };

  getActiveInactive = (positions) => {
    debugger;
    const active = {};
    const inactive = {};
    positions.forEach((position) => {
      if (position.jobsByPositionId.nodes.length > 0) {

        position.jobsByPositionId.nodes.forEach((job) => {
          if (job.isPositionActive) {
            if (active[position.id]) {
              active[position.id].jobsByPositionId.nodes.push(job);
            } else {
              active[position.id] =  cloneDeep(position);
              active[position.id].jobsByPositionId.nodes = [job];
            }
          } else {
            if (inactive[position.id]) {
              inactive[position.id].jobsByPositionId.nodes.push(job);
            } else {
              inactive[position.id] =  cloneDeep(position);
              inactive[position.id].jobsByPositionId.nodes = [job];
            }
          }
        });
      }
    });
    return { active: Object.values(active), inactive: Object.values(inactive) };
  };

  render() {
    const {
      shift = {},
      width = 640,
      openSecondary = true,
      docked = false,
      open
    } = this.props;
    if (this.props.userQuery.loading || this.props.releventPositionsQuery.loading) {
      return (<div>Loading</div>)
    }
    let userDetails = this.props.userQuery && this.props.userQuery.userById;

    let releventPositionsQuery = [...this.props.releventPositionsQuery.fetchRelevantPositions.nodes];
    const { active, inactive } = this.getActiveInactive(releventPositionsQuery);
    const releventfilteredPositions = inactive;
    releventPositionsQuery = active;

    debugger;
    const styles = {
      positionCheckbox: {
        textTransform: 'uppercase',
        color: '#4a4a4a',
        display: 'inline-block',
        width: '70%',
        verticalAlign: 'middle'
      },
      iconStyles: {
        margin: '5px 6px',
        width: 42,
        height: 42
      },
      trainingCheckbox: {
        textTransform: 'uppercase',
        color: '#4a4a4a',
        display: 'inline-block',
        width: '52%',
        marginLeft: '10px',
        verticalAlign: 'middle'
      }
    };
    return (
      <Drawer docked={docked} width={width}
              openSecondary={openSecondary}
              onRequestChange={this.props.handleCloseDrawer}
              open={open}>
        <div className="drawer-section profile-drawer">
          <div className="profile-drawer-heading">
            <div className="drawer-heading col-md-12">
              <IconButton style={leftCloseButton} onClick={this.props.handleCloseDrawer}>
                <Image src="/images/Icons_Red_Cross.png" size="mini"/>
              </IconButton>
              <h5 className="confirm-popup"> {userDetails.firstName} {userDetails.lastName} </h5>
              <div className="drawer-right">
                <RaisedButton label="RESUME" onClick={this.props.openResumeDrawer}/>
              </div>

              {
                userDetails.avatarUrl ? <Image centered='true' size='small' shape='circular' className="profile-img"
                                               src={ userDetails.avatarUrl}/> :
                  <Image centered='true' size='small' shape='circular' className="profile-img"
                         src="https://s3.us-east-2.amazonaws.com/aday-website/anonymous-profile.png"/>
              }

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

              <TabPanel
                userDetails={userDetails}
                releventPositionsQuery={releventPositionsQuery}
                releventfilteredPositions={releventfilteredPositions}
              />


            </div>
          </div>
        </div>
      </Drawer>
    );
  };
}

const ProfileDrawer = compose(
  graphql(userQuery, {
    name: "userQuery",
    options: (ownProps) => ({
      variables: {
        id: ownProps.userId
      }
    })
  }),
  graphql(releventPositionsQuery, {
    name: "releventPositionsQuery",
    options: (ownProps) => ({
      variables: {
        corporationId: localStorage.getItem("corporationId"),
        brandId: localStorage.getItem("brandId"),
        workplaceId: localStorage.getItem("workplaceId"),
        userId: localStorage.getItem("userId")
      }
    })
  })
)(ProfileDrawerComponent);

export default ProfileDrawer;
