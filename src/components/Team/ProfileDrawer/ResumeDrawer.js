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

export default class ResumeDrawer extends Component {

  render() {
    const {
      shift = {},
      width = 640,
      openSecondary = true,
      docked = false,
      open
    } = this.props;
    return (
      <Drawer docked={docked} width={width}
              openSecondary={openSecondary}
              onRequestChange={this.props.backProfileDrawer}
              open={open}>
        <div className="drawer-section resume-drawer profile-drawer">
          <div className="profile-drawer-heading">
            <div className="drawer-heading col-md-12">
              <FlatButton label="Back" onClick={this.props.backProfileDrawer}
                          icon={<Icon name="chevron left" className="floatLeft" style={{fontSize: 26}} /> }
                          style={{position: 'absolute', left: '15px', color: '#E33821', fontSize: 18, paddingLeft: 0}}
              />
              <h5 className="confirm-popup"> <strong> ALBERTO </strong> KELLY </h5>
              <Image centered='true' size='small' shape='circular' className="profile-img"
                     src="https://s3.us-east-2.amazonaws.com/harvard-operations-pics/Operations/RA/andreas-horava.jpg"/>
            </div>
          </div>
          <div className="drawer-content scroll-div">
            <div className="member-list">
              <div className="resume-subject text-center">
                <img src="/images/Sidebar/down-quotes.png" className="quotation-mark down" size="mini" />
                <span className="tagline">I like to work with carefree and generouspeople because that’s who I am :) </span>
                <img src="/images/Sidebar/up-quotes.png" className="quotation-mark up" size="mini" />
              </div>
              <div className="resume-qualification">
                <div className="experience">
                  <div className="qualification-title text-center">
                    <div className="display-table">
                    <Image centered='true' size='mini' className="heading-img"
                           src="/images/Sidebar/briefcase.png" />
                    <h2 className="heading text-uppercase text-center">Work Experience</h2>
                    </div>
                  </div>
                  <div className="qualification-content">
                    <div className="content-heading">
                      <h2 className="text-uppercase">Employer 1</h2>
                    </div>
                    <div className="brief-content">
                      <p className="address">
                        Dunkin' Donuts <br />
                        153 Massachusetts Ave <br />
                        Boston, MA 02115 <br />
                      </p>
                      <p className="extra-work">
                        Worked on cash register and also was training to become a shift manager
                      </p>
                    </div>
                  </div>
                </div>
                <div className="education">
                  <div className="qualification-title text-center">
                    <div className="display-table">
                    <Image centered='true' size='mini' className="heading-img"
                           src="/images/Sidebar/education.png" />
                    <h2 className="heading text-uppercase text-center">Education</h2>
                    </div>
                  </div>
                  <div className="qualification-content">
                    <div className="content-heading">
                      <h2 className="text-uppercase">College</h2>
                    </div>
                    <div className="brief-content">
                      <p className="address">
                        Boston College <br />
                        140 Commonwealth Avenue <br />
                        Chestnut Hill, MA 02467 <br />
                      </p>
                      <p className="address">
                        Bachelor's Degree<br />
                        Psychology <br />
                        August 2012 - May 2017
                      </p>
                    </div>

                    <div className="brief-content">
                      <p className="address">
                        Boston College <br />
                        140 Commonwealth Avenue <br />
                        Chestnut Hill, MA 02467 <br />
                      </p>
                      <p className="address">
                        Masters Degree<br />
                        Psychology <br />
                        August 2012 - May 2017
                      </p>
                    </div>
                  </div>

                  <div className="qualification-content">
                    <div className="content-heading">
                      <h2 className="text-uppercase">High School</h2>
                    </div>
                    <div className="brief-content">
                      <p className="address">
                        Boston College High School<br />
                        150 William T Morrisey Blvd <br />
                        Boston, MA 02467 <br />
                        August 2008 - May 2012
                      </p>
                    </div>
                  </div>
                </div>
                <div className="experience">
                  <div className="qualification-title text-center">
                    <i className="fa fa-edit fa-2x" color="gray"></i>
                    <h2 className="heading text-uppercase text-center">References</h2>
                  </div>
                  <div className="qualification-content">
                    <div className="content-heading">
                      <h2 className="text-uppercase">Reference 1</h2>
                    </div>
                    <div className="brief-content">
                      <p className="address">
                        Lane Kane <br />
                        (403) 482-4821 <br />
                      </p>
                    </div>
                  </div>
                </div>
                <div className="experience">
                  <div className="qualification-title text-center">
                    <div className="display-table">
                    <Image centered='true' size='mini' className="heading-img"
                           src="/images/Sidebar/availability.png" />
                    <h2 className="heading text-uppercase text-center">Availability</h2>
                    </div>
                  </div>
                  <div className="qualification-content">
                    <div className="brief-content">
                      <h4 className="address text-uppercase">
                        Desired Hours: Full - Time
                      </h4>
                    </div>
                  </div>
                </div>
                <div className="home-address">
                  <div className="qualification-title text-center">
                    <div className="display-table">
                    <Image centered='true' size='mini' className="heading-img"
                           src="/images/Sidebar/home.png" />
                    <h2 className="heading text-uppercase text-center">Home Address</h2>
                    </div>
                  </div>
                  <div className="qualification-content">
                    <div className="brief-content">
                      <p className="address">
                        140 Commonwealth Avenue<br />
                        Apt. 204 <br />
                        Allston, MA 02134
                      </p>
                    </div>
                  </div>
                </div>
                <div className="contact-info">
                  <div className="qualification-title text-center">
                    <div className="display-table">
                    <Image centered='true' size='mini' className="heading-img"
                           src="/images/Sidebar/contact.png" />
                    <h2 className="heading text-uppercase text-center">Contact Info</h2>
                    </div>
                  </div>
                  <div className="qualification-content">
                    <div className="brief-content">
                      <p className="address">
                        <Image size='mini' src="/images/Sidebar/phone.png" className="contact-info-img" />
                        <span> 617-405-5829 </span>
                      </p>
                    </div>
                    <div className="brief-content">
                      <p className="address">
                        <Image size='mini' src="/images/Sidebar/mail.png" className="contact-info-img" />
                        <span> iwillbfresh@gmail.com </span>
                      </p>
                    </div>
                  </div>
                </div>
                <div className="contact-info">
                  <div className="qualification-title text-center">
                    <div className="display-table">
                    <Image centered='true' size='mini' className="heading-img"
                           src="/images/Sidebar/language.png" />
                    <h2 className="heading text-uppercase text-center">Languages</h2>
                    </div>
                  </div>
                  <div className="qualification-content">
                    <div className="brief-content">
                      <p className="text-uppercase address">
                        English
                      </p>
                    </div>
                    <div className="brief-content">
                      <p className="text-uppercase address">
                        Spanish
                      </p>
                    </div>
                  </div>
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

