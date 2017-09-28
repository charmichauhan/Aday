import React, {Component} from "react";
import Drawer from "material-ui/Drawer";
import IconButton from "material-ui/IconButton";
import { Header, Icon, Table, Image, List ,Divider} from 'semantic-ui-react';
import FlatButton from 'material-ui/FlatButton';
import CircleButton from '../../helpers/CircleButton';
import moment from "moment";
import {find, pick} from "lodash";
import {leftCloseButton} from "../../styles";
import '../team.css';
const uuidv4 = require('uuid/v4');
import {userQuery, releventPositionsQuery, updateEmployeeById} from "../Team.graphql";
import {graphql, compose, gql} from "react-apollo";

import Experience from "./Resume/Experience";
import Education from "./Resume/Education";
import Reference from "./Resume/Reference";
import Language from "./Resume/Language";

class ResumeDrawerComponent extends Component {
    constructor(props){
      super(props);
      this.state = {
        }
      }

  render() {
    const {
      shift = {},
      width = 640,
      openSecondary = true,
      docked = false,
      open
    } = this.props;

    let userDetails = this.props.userQuery && this.props.userQuery.userById;

    const person = {
      experience: [
        {
          companyLogo: 'https://seeklogo.com/images/D/dunkin-donuts-logo-1E269BA8F1-seeklogo.com.png',
          jobTitle: 'Crew Member',
          company: 'Dunkin Donuts',
          startDate: 'Jul 2012',
          endDate: 'Jul 2015',
          jobDuration:'3 yrs 1 mo',
          jobLocation:'Cambridge, MA',
          jobDescription: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa.'
        },
        {
          companyLogo: 'https://lh3.googleusercontent.com/SXFAotyIHfIJwL05WxIe_yjhWDTkBUK5n2uAB4eNsW2sCDqyhdoytJU2xeyM8NIksMkt63SoE2Pq2g=w2560-h1440-rw-no',
          jobTitle: 'Crew Member',
          company: 'Wal-mart',
          startDate: 'Jan 2010',
          endDate: 'Aug 2012',
          jobDuration:'2 yrs 6 mo',
          jobLocation:'Malden, MA',
          jobDescription: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa.'
        },
        {
          companyLogo: '/assets/Icons/default-workplace.png',
          jobTitle: 'Bartender',
          company: 'Freelance',
          startDate: 'Jan 2010',
          endDate: 'Aug 2012',
          jobDuration:'2 yrs 6 mo',
          jobLocation:'Boston, MA',
          jobDescription: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa.'
        },
      ],
      education: [
        {
          institutionLogo: '/assets/Icons/default-education.png',
          institutionName: 'City of Boston High School',
          awardName: 'High School Diploma',
          startDate: 'Sep 2006',
          endDate: 'May 2010',
          awardDescription: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa.'
        },
        {
          institutionLogo: 'http://www.marinelog.com/media/k2/items/cache/ad0ec80b2a19407fd396c1c0067174a0_L.jpg?t=943938000',
          institutionName: 'Opportunity Advancement Innovation',
          awardName: 'Construction Industry Safety Course',
          startDate: 'Jan 2012',
          endDate: 'Jul 2012',
          awardDescription: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa.'
        },
      ],
      reference: [
        {
          avatar: 'https://s3.us-east-2.amazonaws.com/harvard-operations-pics/Operations/RA/albeiro-restrepo.jpg',
          firstName: 'Albeiro',
          lastName: 'Restrepo',
          phoneNumber: '1-617-839-9830',
          referenceDate: 'Jul 15, 2017',
          relationship: 'Worked together at Dunkin Donuts',
          referenceText: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa.'
        },
        {
          avatar: '/assets/Icons/default-reference.png',
          firstName: 'Anna',
          lastName: 'Reyes',
          phoneNumber: '1-617-948-1049',
          referenceDate: 'Jul 23, 2017',
          relationship: 'Worked together at Wal-mart',
          referenceText: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa.'
        },
      ],
      availability: 'Part-Time',
      address: {
        line1: '249 Main Street',
        line2: 'Apt B',
        line3: 'Malden, MA 03813'
      },
      language: [
        {
          language: 'English',
          proficiency: 'Native',
        },
        {
          language: 'Spanish',
          proficiency: 'Native',
        },
      ],
      certificate: [
        {
          name: 'FrontEnd Developer',
          institution: 'Platzi',
          date: 'Jan 2015',
          description: 'Aenean commodo ligula eget dolor. Aenean massa.'
        },
        {
          name: 'Backend Developer',
          institution: 'Platzi',
          date: 'Jan 2016',
          description: 'Aenean commodo ligula eget dolor. Aenean massa.'
        }
      ]
    };

    return (

      <Drawer docked={docked} width={width}
              openSecondary={openSecondary}
              onRequestChange={this.props.backProfileDrawer}
              open={open}>
        <div className="drawer-section resume-drawer profile-drawer">
          <div className="profile-drawer-heading">
            <div className="drawer-heading col-md-12" >
              <FlatButton label="Back" onClick={this.props.backProfileDrawer}
                          icon={<Icon name="chevron left" className="floatLeft" style={{fontSize: 26}} /> }
                          style={{position: 'absolute', left: '15px', color: '#E33821', fontSize: 18, paddingLeft: 0}}
              />

              <span className="profile-title first-name-title" style={{color:"#0021A1"}}>{userDetails.firstName}</span>
              &nbsp;&nbsp;
              <span className="profile-title last-name-title" style={{color:"#0021A1"}}>{userDetails.lastName} </span>

              {userDetails.avatarUrl
                     ? <Image centered='true' size='small' shape='circular' className="profile-img" src={ userDetails.avatarUrl}/>
                     :  <Image centered='true' size='small' shape='circular' className="profile-img"
                          src="https://s3.us-east-2.amazonaws.com/aday-website/anonymous-profile.png"/>
              }
            </div>

            <div className="resume-subject text-center">
              <img src="/assets/Icons/down-quotes.png" className="quotation-mark down" style={{width:30}} />
              <span className="tagline">I'm looking for opportunities in the construction industry and to develop my career</span>
              <img src="/assets/Icons/up-quotes.png" className="quotation-mark up" style={{width:30}} />
            </div>

            <div className="resume-contact">
              <div style={{display:'flex', flexDirection:'row'}}>
                <Image src="/assets/Icons/mail-mini.png" style={{width:24, height:16, marginRight:8, marginTop:4, marginBottom:4}}/>
                <span className="resume-h2" style={{color:"#4A4A4A", fontFamily:'Lato-Light', fontWeight:100}}>{userDetails.userEmail}</span>
              </div>
              <div style={{display:'flex', flexDirection:'row', marginBottom:15}}>
                <Image src="/assets/Icons/phone-mini.png" style={{width:24, height:24, marginRight: 8}}/>
                <span className="resume-h2" style={{color:"#4A4A4A", fontFamily:'Lato-Light', fontWeight:100}}>{userDetails.userPhoneNumber}</span>
              </div>
            </div>
          </div>
          <div className="drawer-content scroll-div">
            <div className="member-list">

              <div className="resume-qualification">
                <div className="qualification-title">

                  <Experience experience={person.experience} />
                  <Education education={person.education} />
                  <Reference reference={person.reference} />

                  {/*Availability*/}
                  <div style={{display:'flex', flexDirection:'row'}}>
                    <Image src="/assets/Icons/availability.png" className="resume-icon"/>
                    <span className="resume-title">Ideal Availability</span>
                  </div>
                  <div className="section-item">
                    <div className="section-subitem">
                      <div className="section-content" style={{width:640}}>
                        <div className="resume-image-lane" />
                        <div style={{flex:11}}>
                          <p className="resume-h2">{person.availability}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/*Home Address*/}
                  <div style={{display:'flex', flexDirection:'row'}}>
                    <Image src="/assets/Icons/house.png" className="resume-icon"/>
                    <div>
                      <span className="resume-title">Home Address</span>
                      <p className="resume-h4" style={{fontStyle:'italic'}}>As an employer, you have access to the team member's home address</p>
                    </div>
                  </div>
                  <div className="section-item">
                    <div className="section-subitem">
                      <div className="section-content" style={{width:640}}>
                        <div className="resume-image-lane" />
                        <div style={{flex:11}}>
                          <p className="resume-h2">{person.address.line1}</p>
                          <p className="resume-h2">{person.address.line2}</p>
                          <p className="resume-h2">{person.address.line3}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Language language={person.language} />

                  </div>
                </div>
              </div>
            </div>
          <div className="drawer-footer text-center">
            <CircleButton type="white" title="GO BACK" handleClick={this.props.backProfileDrawer}/>
          </div>
        </div>
      </Drawer>
    );
  };
}

const ResumeDrawer = compose(
  graphql(userQuery, {
    name: "userQuery",
    options: (ownProps) => ({
      variables: {
        id: ownProps.userId,
        corporationId: localStorage.getItem("corporationId")
      }
    })
  }),
  graphql(updateEmployeeById, {name: "updateEmployee"})
)(ResumeDrawerComponent);

export default ResumeDrawer;
