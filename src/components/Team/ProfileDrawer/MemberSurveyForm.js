import React, {Component} from "react";
import CircleButton from '../../helpers/CircleButton';
import "antd/lib/select/style/css";
import "antd/lib/dropdown/style/css";
import "antd/lib/date-picker/style/css";


export default class MemberSurveyForm extends Component {

  render() {

    return (
      <div>
        <div className="box-header">
          <div className="body-text">
          <h2 className="text-uppercase box-heading">EEO Survey</h2>
          <p>
            <span className="label-name">Employee: </span>
            <span className="data">Dummy text</span>
          </p>
          <p>
            <span className="label-name">Male or Female: </span>
            <span className="data">Dummy text</span>
          </p>
          <p>
            <span className="label-name">Race or Ethnic Group: </span>
            <span className="data">Dummy text</span>
          </p>
          <p>
            <span className="label-name">Date Submitted: </span>
            <span className="data">Dummy text</span>
          </p>
        </div>
          <div className="box-footer">
            <div className="float-right">
              <a className="cancel-link">
                <span className="text-uppercase">Preview</span>
              </a>
              <a className="email-link">
                <span className="text-uppercase">Email EEO Survey</span>
              </a>
            </div>
          </div>
        </div>

        <div className="box-header">
          <div className="body-text">
          <h2 className="text-uppercase box-heading">Company policy Acceptance</h2>
          <div>
          <p>
            <span className="label-name">Employee Accepted? </span>
            <span className="data">No</span>
          </p>
          </div>
          </div>
          <div className="box-footer">
            <div className="float-right">
              <a className="cancel-link">
                <span className="text-uppercase">Preview</span>
              </a>
              <a className="email-link">
                <span className="text-uppercase">Email EEO Survey</span>
              </a>
            </div>
          </div>
        </div>
        <div className="box-header">
          <div className="body-text">
            <h2 className="text-uppercase box-heading">Background Check</h2>
            <div>
              <p>
                <span className="label-name">Results? </span>
                <span className="data">Satisfactory</span>
              </p>
            </div>
          </div>
          <div className="box-footer">
            <div className="float-right">
              <a className="order-link">
                <span className="text-uppercase">Order Report $5</span>
              </a>
              <a className="email-link">
                <span className="text-uppercase">View Results $1</span>
              </a>
            </div>
          </div>
        </div>
        <div className="text-center">
          <CircleButton type="white" title="DECIDE LATER" />
          <CircleButton type="blue" title="INVITE TO INTERVIEW" />
          <CircleButton type="green" title="APPROVE FOR TRAINING" />
          <div className="view-resume-btn text-center">
            <button className="btn text-uppercase btn-default">View Resume</button>
          </div>
        </div>
      </div>
    )
  }
}
