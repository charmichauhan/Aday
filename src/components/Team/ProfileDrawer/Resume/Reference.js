import React from "react";
import { Image } from 'semantic-ui-react';
import '../../team.css';
import moment from "moment";

/**
 * iterable component to list references
 * @author Rahkeem Morris
 * @since Sep 24, 2017
 * @param {hash} props receives properties of reference from parent component
 * @todo format phone number
 */
const Reference = (props) => {
  const myReference = (
    <div className="section-item">
      {props.reference.map((ref, index) =>
        <div className="section-subitem" key={index}>
          <div className="section-content">
            <div className="resume-image-lane">
              <Image style={{borderRadius:'50%'}} className="resume-image" src={ref.avatar}/>
            </div>
            <div className="resume-content">
              <p className="resume-h1">{ref.firstName}&nbsp;{ref.lastName}</p>
              <p className="resume-h2">{ref.referencePhoneNumber}</p>
              <div className="resume-h3">
                <p className="resume-time-period"><strong>Reference Date</strong>:&nbsp;{moment(ref.referenceDate).format("MMM YYYY")}</p>
              </div>
            <p className="resume-h4"><strong>Relationship:</strong>&nbsp;{ref.relationship}</p>
            </div>
          </div>
          <div className="section-content">
            <div className="resume-image-lane"></div>
              <p className="resume-p">
                {ref.referenceText}
              </p>
          </div>
        </div>
    )}
  </div>
  )

  return (
    <div>
      <div style={{display:'flex', flexDirection:'row'}}>
        <Image src="/assets/Icons/references.png" className="resume-icon"/>
        <span className="resume-title">References</span>
      </div>
      {myReference}
    </div>
  )
};

export default Reference
