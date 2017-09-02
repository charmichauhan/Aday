import React, {Component} from "react";
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
            <div className="float-left">
            <span className="text-uppercase">Preview Survey</span>
            </div>
            <div className="float-right">
              <a className="cancel-link">
                <span className="text-uppercase">Cancel</span>
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
            <div className="float-left">
              <span className="text-uppercase">Preview Survey</span>
            </div>
            <div className="float-right">
              <a className="cancel-link">
                <span className="text-uppercase">Cancel</span>
              </a>
              <a className="email-link">
                <span className="text-uppercase">Email EEO Survey</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
