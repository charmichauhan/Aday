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
import {userQuery, updateEmployeeById} from "../Team.graphql";
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
    // version to load data from query

    const person = {
      experience: userDetails.userEmployersByUserId.nodes,
      education: userDetails.userEducationsByUserId.nodes,
      reference: userDetails.userReferencesByUserId.nodes,
      availability: userDetails.userAvailabilitiesByUserId.nodes,
      language: userDetails.userLanguagesByUserId.nodes,
      address: userDetails.homeAddress ? JSON.parse(userDetails.homeAddress).home_address[0] : ""
    };

    // hard-coded version
    /*
    const person = {
      experience: [
        {
          employerName: 'Dunkin Donuts',
          city: 'Cambridge',
          state: 'MA',
          jobTitle: 'Crew Member',
          jobDescription: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa.',
          startDate: moment('Jul 2012', 'MMM-YYYY').toISOString(),
          endDate: moment('Jul 2015', 'MMM-YYYY').toISOString(),
          // not in table
          companyLogo: 'https://seeklogo.com/images/D/dunkin-donuts-logo-1E269BA8F1-seeklogo.com.png'
        },
        {
          employerName: 'Wal-mart',
          city: 'Malden',
          state: 'MA',
          jobTitle: 'Crew Member',
          jobDescription: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa.',
          // reformat
          startDate: moment('Jan 2010', 'MMM-YYYY').toISOString(),
          endDate: moment('Aug 2012', 'MMM-YYYY').toISOString(),
          // not in table
          companyLogo: 'https://lh3.googleusercontent.com/SXFAotyIHfIJwL05WxIe_yjhWDTkBUK5n2uAB4eNsW2sCDqyhdoytJU2xeyM8NIksMkt63SoE2Pq2g=w2560-h1440-rw-no'
        },
        {
          employerName: 'Freelance',
          city: 'Malden',
          state: 'MA',
          jobTitle: 'Bartender',
          jobDescription: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa.',
          // reformat
          startDate: moment('Jan 2010', 'MMM-YYYY').toISOString(),
          endDate: moment('Aug 2012', 'MMM-YYYY').toISOString(),
          // not in table
          companyLogo: '/assets/Icons/default-workplace.png'
        },
      ],
      education: [
        {
          educationalInstitutionName: 'City of Boston High School',
          city: 'Boston',
          state: 'MA',
          awardType: 'High School Diploma',
          fieldOfStudy: null,
          // reformat
          startDate: moment('Sep 2006', 'MMM-YYYY').toISOString(),
          endDate: moment('May 2010', 'MMM-YYYY').toISOString(),
          // not in table
          institutionLogo: '/assets/Icons/default-education.png',
          awardDescription: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa.'
        },
        {
          educationalInstitutionName: 'Opportunity Advancement Innovation',
          city: 'Boston',
          state: 'MA',
          awardType: 'Construction Industry Safety Course',
          fieldOfStudy: null,
          // reformat
          startDate: moment('Jan 2012', 'MMM-YYYY').toISOString(),
          endDate: moment('Jul 2012', 'MMM-YYYY').toISOString(),
          // not in table
          institutionLogo: 'http://www.marinelog.com/media/k2/items/cache/ad0ec80b2a19407fd396c1c0067174a0_L.jpg?t=943938000',
          awardDescription: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa.'
        },
      ],
      reference: [
        {
          firstName: 'Albeiro',
          lastName: 'Restrepo',
          referencePhoneNumber: '1-617-839-9830',
          // reformat
          referenceEmailAddress: '',
          relationship: 'Worked together at Dunkin Donuts',

          // not in table
          referenceDate: moment('Jul 2017', 'MMM-YYYY').toISOString(),
          avatar: 'https://s3.us-east-2.amazonaws.com/harvard-operations-pics/Operations/RA/albeiro-restrepo.jpg',
          referenceText: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa.'
        },
        {
          firstName: 'Anna',
          lastName: 'Reyes',
          referencePhoneNumber: '1-617-948-1049',
          // reformat
          referenceEmailAddress: '',
          relationship: 'Worked together at Wal-mart',

          // not in table
          referenceDate: moment('Jul 2017', 'MMM-YYYY').toISOString(),
          avatar: '/assets/Icons/default-reference.png',
          referenceText: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa.'
        },
      ],
      availability: [
        {
          hourRange: "part-time"
        }
      ],
      address: {address_line1:"249 Main Street",
                address_line2:"Apt B",
                city:"Malden",
                state:"MA"},
      language: [
        {
          languageName: 'English',
          // not in table
          proficiency: 'Native',
        },
        {
          languageName: 'Spanish',
          // not in table
          proficiency: 'Native',
        },
      ],
      // not in table (?)
      certificate: [
        {
          name: 'FrontEnd Developer',
          institution: 'Platzi',
          date: moment('Jan 2015', 'MMM-YYYY').toISOString(),
          description: 'Aenean commodo ligula eget dolor. Aenean massa.'
        },
        {
          name: 'Backend Developer',
          institution: 'Platzi',
          date: moment('Jan 2016', 'MMM-YYYY').toISOString(),
          description: 'Aenean commodo ligula eget dolor. Aenean massa.'
        }
      ]
    };
    */
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
                          style={{position: 'absolute', left: '15px', color: 'red', fontSize: 18, paddingLeft: 0}}
              />

              <span className="profile-title first-name-title" style={{color:"blue"}}>{userDetails.firstName}</span>
              &nbsp;&nbsp;
              <span className="profile-title last-name-title" style={{color:"blue"}}>{userDetails.lastName} </span>

              {userDetails.avatarUrl
                     ? <Image size='small' shape='circular' className="profile-img" src={ userDetails.avatarUrl}/>
                     :  <Image size='small' shape='circular' className="profile-img"
                          src="https://s3.us-east-2.amazonaws.com/aday-website/anonymous-profile.png"/>
              }
            </div>

            <div className="resume-subject text-center">
              <img src="/assets/Icons/down-quotes.png" className="quotation-mark down" style={{width:30}} />
              <span className="tagline">I{`'`}m looking for opportunities in the construction industry and to develop my career</span>
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
                          <p className="resume-h2">{person.availability[0] ? person.availability[0].hourRange : ''}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/*Home Address*/}
                  <div style={{display:'flex', flexDirection:'row'}}>
                    <Image src="/assets/Icons/house.png" className="resume-icon"/>
                    <div>
                      <span className="resume-title">Home Address</span>
                      <p className="resume-h4" style={{fontStyle:'italic'}}>As an employer, you have access to the team member{`'`}s home address</p>
                    </div>
                  </div>
                  <div className="section-item">
                    <div className="section-subitem">
                      <div className="section-content" style={{width:640}}>
                        <div className="resume-image-lane" />
                        {person.address &&
                          <div style={{flex:11}}>
                            <p className="resume-h2">{person.address.address_line1}</p>
                            <p className="resume-h2">{person.address.address_line2}</p>
                            <p className="resume-h2">{person.address.city + ", " + person.address.state}</p>
                          </div>
                        }
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
