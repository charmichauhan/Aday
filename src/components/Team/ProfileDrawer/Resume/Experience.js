import React from "react";
import { Image } from 'semantic-ui-react';
import '../../team.css';

/**
 * iterable component to list work experience
 * @author Rahkeem Morris
 * @since Sep 23, 2017
 * @param {hash} props receives properties of work experience from parent component
 * @todo allow for no input for both a startDate or endDate
 * @todo allow for input of only a startDate
 * @todo remove duration and bullet point when no duration cannot be computed, including "present"
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
              <p className="resume-h2">{exp.company}</p>
              <div className="resume-h3">
                <p className="resume-time-period">{exp.startDate}</p>
                <p style={{paddingTop:3, marginLeft: 5, marginRight: 5, marginBottom:0}}>–</p>
                <p className="resume-time-period">{exp.endDate}</p>
                <p style={{paddingTop:3, marginLeft: 5, marginRight: 5, marginBottom:0}}>•</p>
                <p className="resume-time-length">{exp.jobDuration}</p>
              </div>
            <p className="resume-h4">{exp.jobLocation}</p>
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
