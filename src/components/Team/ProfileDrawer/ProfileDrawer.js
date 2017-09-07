import React, {Component} from "react";
import Drawer from "material-ui/Drawer";
import IconButton from "material-ui/IconButton";
import RaisedButton from "material-ui/RaisedButton";
import {Image, Rating} from "semantic-ui-react";
import {find, pick} from "lodash";
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
          for (let i = 0; i < w.jobsByPositionId.nodes.length ; i++) {
            if (!w.jobsByPositionId.nodes[i].isPositionActive) {
              return true;
            }
          }
        }
      }
    )
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
    let releventPositionsQuery = [...this.props.releventPositionsQuery.allPositions.nodes];
    let releventfilteredPositions = releventPositionsQuery.filter((w) => {
        if (w.jobsByPositionId.nodes.length > 0) {
          for (let i = 0; i < w.jobsByPositionId.nodes.length ; i++) {
            if (!w.jobsByPositionId.nodes[i].isPositionActive) {
              return true;
            }
          }
        }
      }
    );

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
     <Drawer
         docked={docked}
         width={width}
         openSecondary={openSecondary}
         onRequestChange={this.props.handleCloseDrawer}
         open={open}>

         <div className="drawer-section profile-drawer">
             <div className="profile-drawer-heading">
                 <div className="drawer-heading col-md-12">
                     <IconButton style={leftCloseButton} onClick={this.props.handleCloseDrawer}>
                        <Image src="/images/Icons_Red_Cross.png" size="mini"/>
                     </IconButton>

                     <span className="profile-title first-name-title">{userDetails.firstName}</span>
                     &nbsp;&nbsp;
                     <span className="profile-title last-name-title">{userDetails.lastName} </span>

                     {userDetails.avatarUrl
                            ? <Image centered='true' size='small' shape='circular' className="profile-img" src={ userDetails.avatarUrl}/>
                            :  <Image centered='true' size='small' shape='circular' className="profile-img"
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
                         <label htmlFor="daily" className="text-uppercase">Max <span style={{color:'darkred'}}> Daily </span> Hours</label>
                         <input type="text" className="form-control"/>
                     </div>
                     <div className="form-group weekly">
                         <label htmlFor="weekly" className="text-uppercase">Max <span style={{color:'darkred'}}> Weekly </span> Hours</label>
                         <input type="text" className="form-control"/>
                     </div>
                     <div className="form-group monthly">
                         <label htmlFor="monthly" className="text-uppercase">Max <span style={{color:'darkred'}}> Monthly </span> Hours</label>
                         <input type="text" className="form-control"/>
                    </div>
                 </form>
             <div className="profile-drawer-content text-center">
                <p className="meta-info">Team members with their maximum weekly hours set at or below 30 hours per week are not included in the automated schedule</p>
             </div>
             <div className="update-limit-btn text-center">
                 <RaisedButton
                     label="Update Limits"
                     backgroundColor="#0022A1"
                     labelColor="#FFFFFF"
                 />
             </div>
              <TabPanel
                userDetails={userDetails}
                releventPositionsQuery={releventPositionsQuery}
                releventfilteredPositions={releventfilteredPositions}
              />
         </div>
     </div>
          <div className="block-limit-btn text-center">
            <button className="btn text-uppercase btn-default">Block {userDetails.firstName}</button>
          </div>
        </div>
      </Drawer>
    );
  };
}

/*
 * Removed from the pilot with Restaurant Associates
<div className="drawer-right">
                <RaisedButton label="RESUME" onClick={this.props.openResumeDrawer}/>
              </div>
*/

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
        userId: localStorage.getItem("userId")
      }
    })
  })
)(ProfileDrawerComponent);

export default ProfileDrawer;
