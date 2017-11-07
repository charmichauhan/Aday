import React from "react";
import { Image } from 'semantic-ui-react';
import '../../team.css';
import moment from "moment";

/**
 * iterable component to list work experience
 * @author Rahkeem Morris
 * @since Sep 23, 2017
 * @param {hash} props receives properties of work experience from parent component
 */
const Experience = (props) => {
  const myExperience = (
    <div className="section-item">
      {props.experience.map((exp, index) =>
        <div className="section-subitem" key={index}>
          <div className="section-content">
            <div className="resume-image-lane">
              <Image className="resume-image" src={exp.companyLogo}/>
            </div>
            <div className="resume-content">
              <p className="resume-h1">{exp.jobTitle}</p>
              <p className="resume-h2">{exp.emplyerName}</p>
              <div className="resume-h3">
                <p className="resume-time-period">{moment(exp.startDate).format("MMM YYYY")}</p>
                <p style={{paddingTop:3, marginLeft: 5, marginRight: 5, marginBottom:0}}>–</p>
                <p className="resume-time-period">{exp.endDate ? moment(exp.endDate).format("MMM YYYY") :
                                                   "Present"}</p>
                <p style={{paddingTop:3, marginLeft: 5, marginRight: 5, marginBottom:0}}>•</p>
                <p className="resume-time-length">{exp.endDate ? moment(exp.endDate).diff(moment(exp.startDate), 'months') + " months" :
                                                   moment().diff(moment(exp.startDate), 'months') + " months"}</p>
              </div>
            <p className="resume-h4">{exp.city + ", " + exp.state}</p>
            </div>
          </div>
          <div className="section-content">
            <div className="resume-image-lane"></div>
              <p className="resume-p">
                {exp.jobDescription}
              </p>
          </div>
        </div>
    )}
  </div>
  )

  return (
    <div>
      <div style={{display:'flex', flexDirection:'row'}}>
        <Image src="/assets/Icons/experience.png" className="resume-icon"/>
        <span className="resume-title">Work Experience</span>
      </div>
      {myExperience}
    </div>
  )
};

export default Experience
