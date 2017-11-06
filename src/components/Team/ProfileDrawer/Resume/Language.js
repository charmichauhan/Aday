import React from "react";
import { Image } from 'semantic-ui-react';
import '../../team.css';

/**
 * iterable component to list of languages user is proficient
 * @author Rahkeem Morris
 * @since Sep 24, 2017
 * @param {hash} props receives properties with languages from parent component
 * @todo add proficiency
 */
const Language = (props) => {
  const myLanguage = (
    <div>
      {props.language.map((lang, index) =>
        <div  key={index}>
          <div className="section-content" style={{width:640}}>
            <div className="resume-image-lane" />
            <div className="resume-content" style={{flex:11}}>
              <p className="resume-h2">•&nbsp;&nbsp;{lang.languageName}</p>
            </div>
          </div>
        </div>
    )}
  </div>
  )

  return (
    <div>
      <div style={{display:'flex', flexDirection:'row'}}>
        <Image src="/assets/Icons/languages.png" className="resume-icon"/>
        <span className="resume-title">Languages</span>
      </div>
      {myLanguage}
    </div>
  )
};

export default Language
