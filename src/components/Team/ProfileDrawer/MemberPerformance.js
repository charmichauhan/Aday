import React, {Component} from "react";
import {Progress} from 'antd';
import {Grid , Image} from "semantic-ui-react";
import TextEditor from 'wysiwyg-editor-react';
export default class MemberPerformance extends Component {
  constructor(props){
    super(props);
    this.state={
      editorText:"<b>Hello</b>"
    }
  }
  onTextUpdate = (val) =>{
    this.setState({editorText:val});
  };
  render(){
    let toolbar_buttons = ['bold','italic','link','image','list', 'print'];
    return(
      <div>
        <div className="text-center profile-drawer-tab">
          <Image src="/images/Sidebar/performance.png" size="mini"/>
          <h2 className="text-uppercase">PERFORMANCE</h2>
        </div>
        <div className="grid-wrapper">
        <Grid columns={2}>
          <Grid.Row>
            <Grid.Column width={2}>
              <Progress type="circle" percent={25} width={40}/>
            </Grid.Column>
            <Grid.Column width={14}>
              <div>
                <p className="cook-name">On Time Intervals</p>
                <span className="text-uppercase red">4 of 20 hours completed</span>
              </div>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={2}>
              <Progress type="circle" percent={25} width={40}/>
            </Grid.Column>
            <Grid.Column width={14}>
              <div>
                <p className="cook-name">Attendance</p>
                <span className="text-uppercase red">4 of 20 hours completed</span>
              </div>
            </Grid.Column>
          </Grid.Row>
        </Grid>
        </div>
        <div className="text-editor-wrapper">
          <TextEditor toolbar_buttons={toolbar_buttons}
                      className="text-editor" html={this.state.editorText} update={this.onTextUpdate}
          />
        </div>
        </div>
    )
  }
}
