import React from "react";
import { Image } from 'semantic-ui-react';
import '../../team.css';
import moment from "moment";

/**
 * iterable component to list education credential
 * @author Rahkeem Morris
 * @since Sep 24, 2017
 * @param {hash} props receives properties of education award from parent component
 */
const Education = (props) => {
  const myEducation = (
    <div className="section-item">
      {props.education.map((edu, index) =>
        <div className="section-subitem" key={index}>
          <div className="section-content">
            <div className="resume-image-lane">
              <Image className="resume-image" src={edu.institutionLogo}/>
            </div>
            <div className="resume-content">
              <p className="resume-h1">{edu.educationalInstitutionName}</p>
              <p className="resume-h2">{edu.awardType}</p>
              <div className="resume-h3">
                <p className="resume-time-period">{moment(edu.startDate).format("MMM YYYY")}</p>
                <p style={{paddingTop:3, marginLeft: 5, marginRight: 5, marginBottom:0}}>–</p>
                <p className="resume-time-period">{edu.endDate ? moment(edu.endDate).format("MMM YYYY") :
                                                   "Present"}</p>
              </div>
            </div>
          </div>
          <div className="section-content">
            <div className="resume-image-lane"></div>
              <p className="resume-p">
                {edu.awardDescription}
              </p>
          </div>
        </div>
    )}
  </div>
  )

  return (
    <div>
      <div style={{display:'flex', flexDirection:'row'}}>
        <Image src="/assets/Icons/education.png" className="resume-icon"/>
        <span className="resume-title">Education</span>
      </div>
      {myEducation}
    </div>
  )
};

export default Education
