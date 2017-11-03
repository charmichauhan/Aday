import React, {Component} from "react";
import Drawer from "material-ui/Drawer";
import IconButton from "material-ui/IconButton";
import RaisedButton from "material-ui/RaisedButton";
import {Image, Rating, Button} from "semantic-ui-react";
import {find, pick} from "lodash";
import {leftCloseButton} from "../../styles";
import {graphql, gql, compose} from "react-apollo";
import TabPanel from "./TabPanel";
import {userQuery, releventPositionsQuery, updateEmployeeById} from "../Team.graphql";
import "../team.css";
var Halogen = require('halogen');
import Notifier, { NOTIFICATION_LEVELS } from '../../helpers/Notifier';

const uuidv4 = require('uuid/v4');

class ProfileDrawerComponent extends Component {
  constructor(props){
    super(props);
    this.state = {
      dayHour: null,
      weekHour: null,
      monthHour: null,
      updated: false,
      notify: false
      }
    }

    dayHour = (event) => {
      this.setState({ dayHour: event.target.value });
    }

    weekHour = (event) => {
      this.setState({ weekHour: event.target.value });
    }

    monthHour = (event) => {
      this.setState({ monthHour: event.target.value });
    }


  showNotification = (message, type) => {
    this.setState({
      notify: true,
      notificationType: type,
      notificationMessage: message
    });
  };

  hideNotification = () => {
    this.setState({
      notify: false,
      notificationType: '',
      notificationMessage: ''
    });
  }

    saveLimits(v){
      let employeeInfo = {}
      if (this.state.dayHour){
        employeeInfo['dayHourLimit'] = this.state.dayHour
      }
      if (this.state.weekHour){
        employeeInfo['weekHourLimit'] = this.state.weekHour
      }
      if (this.state.monthHour){
        employeeInfo['monthHourLimit'] = this.state.monthHour
      }

      this.props.updateEmployee({
      variables: {
        id: v,
        employeeInfo: employeeInfo
        },
          updateQueries: {
              userById: (previousQueryResult, { mutationResult }) => {
                      let employeeData = mutationResult.data.updateEmployeeById.employee
                      previousQueryResult.userById.employeesByUserId.edges = [{ 'node': employeeData, '__typename': "EmployeesEdge" }]
                      return {
                        userById: previousQueryResult.userById
                      };
              },
         },
        }).then(({ data }) => {
              this.showNotification('Limits Updated Successfully.', NOTIFICATION_LEVELS.SUCCESS);
              console.log(data)
        })
      }


  render() {
    const {
      shift = {},
      width = 640,
      openSecondary = true,
      docked = false,
      open
    } = this.props;

    if (this.props.userQuery.loading || this.props.releventPositionsQuery.loading) {
        return(<div><Halogen.BeatLoader color='#00A863'/></div>)
    }

    let userDetails = this.props.userQuery && this.props.userQuery.userById;
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

                         <span className="profile-title first-name-title" style={{marginLeft:50}}>{userDetails.firstName}</span>
                         &nbsp;&nbsp;
                         <span className="profile-title last-name-title">{userDetails.lastName} </span>


                     {userDetails.avatarUrl
                            ? <Image centered={true} size='small' shape='circular' className="profile-img" src={ userDetails.avatarUrl}/>
                            :  <Image centered={true} size='small' shape='circular' className="profile-img"
                                 src="https://s3.us-east-2.amazonaws.com/aday-website/anonymous-profile.png"/>
                     }

                     <div className="drawer-right" style={{paddingTop:0, marginRight:0}}>

                     <Button inverted style={{borderRadius:5}} color='red' onClick={this.props.openResumeDrawer}>RESUME</Button>

                     {/*
                        <RaisedButton
                            label="RESUME"
                            onClick={this.props.openResumeDrawer}
                            backgroundColor="#E33821"
                        />
                    */}

                    </div>

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
                  {this.state.updated? <div style={{ fontSize: "16px", color: "black" }}> Hourly Limits Updated. </div>:"" }
                     <div className="form-group daily">
                         <label htmlFor="daily" className="text-uppercase">Max <span style={{color:'darkred'}}> Daily </span> Hours</label>
                         <input htmlFor="hourly-limits" type="text" className="form-control" onChange={this.dayHour} placeholder={userDetails.employeesByUserId.edges[0].node.dayHourLimit}/>
                     </div>
                     <div className="form-group weekly">
                         <label htmlFor="weekly" htmlFor="hourly-limits" className="text-uppercase">Max <span style={{color:'darkred'}}> Weekly </span> Hours</label>
                         <input type="text" htmlFor="hourly-limits" className="form-control" onChange={this.weekHour} placeholder={userDetails.employeesByUserId.edges[0].node.weekHourLimit}/>
                     </div>
                     <div className="form-group monthly">
                         <label htmlFor="monthly" htmlFor="hourly-limits" className="text-uppercase">Max <span style={{color:'darkred'}}> Monthly </span> Hours</label>
                         <input type="text" className="form-control" onChange={this.monthHour} placeholder={userDetails.employeesByUserId.edges[0].node.monthHourLimit}/>
                    </div>
                 </form>
             <div className="profile-drawer-content text-center">
                <p className="meta-info">Team members with their maximum weekly hours set at or below 30 hours per week are not included in the automated schedule</p>
             </div>
             <div className="update-limit-btn text-center">
                 <RaisedButton
                     onClick={() => this.saveLimits(userDetails.employeesByUserId.edges[0].node.id)}
                     label="Update Limits"
                     backgroundColor="#0022A1"
                     labelColor="#FFFFFF"
                 />
             </div>
              <TabPanel
                userDetails={userDetails}
                releventPositionsQuery={this.props.releventPositionsQuery}
              />
         </div>
     </div>
        </div>
          <Notifier hideNotification={this.hideNotification} notify={this.state.notify} notificationMessage={this.state.notificationMessage}
                  notificationType={this.state.notificationType} />
      </Drawer>
    );
  };
}

const ProfileDrawer = compose(
  graphql(userQuery, {
    name: "userQuery",
    options: (ownProps) => ({
      variables: {
        id: ownProps.userId,
        corporationId: localStorage.getItem("corporationId")
      }
    })
  }),
  graphql(releventPositionsQuery, {
    name: "releventPositionsQuery",
    options: (ownProps) => ({
      variables: {
        corporationId: localStorage.getItem("corporationId"),
        brandId: localStorage.getItem("brandId"),
        userId:  ownProps.userId
      }
    })
  }),
  graphql(updateEmployeeById, {name: "updateEmployee"})
)(ProfileDrawerComponent);

export default ProfileDrawer;
