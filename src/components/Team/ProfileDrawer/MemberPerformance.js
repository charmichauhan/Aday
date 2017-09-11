import React, {Component} from "react";
import {Image} from "semantic-ui-react";
import { Switch } from 'antd';
import CircleButton from '../../helpers/CircleButton';
import {Editor, EditorState} from 'draft-js';
import "draft-js/dist/Draft.css";

export default class MemberPerformance extends Component {

  constructor(props) {
    super(props);
    this.state = {editorState: EditorState.createEmpty()};
    this.onChange = (editorState) => this.setState({editorState});
  }

  render(){
    return(
      <div>
        <div className="text-center profile-drawer-tab">
          <Image src="/images/Sidebar/performance.png" size="mini" />
          <h2 className="text-uppercase">PERFORMANCE</h2>
        </div>
        <div className="performance-content">
          <h3 className="text-uppercase">Training Auto-Progression</h3>
          <div className="wrapper-element">
            <Switch defaultChecked={false} onChange={this.onChange}
                    className="switchStyle" circleStyles={{border: '1px solid #000', background: '#f00'}}
                    checkedChildren="YES" unCheckedChildren="NO" />
          </div>
          <div className="performance-tagline">
            <p>Automatically approve Alberto for training on the next least costly training after successful completion of the requirements of the current training</p>
          </div>
          <div>
            <Editor editorState={this.state.editorState} onChange={this.onChange} />
          </div>
        </div>
      </div>
    )
  }
}
