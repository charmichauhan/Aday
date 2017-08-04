import React,{Component} from 'react';
import {Button,Icon} from 'semantic-ui-react';

export default class ToggleButton extends Component {
  constructor(props){
    super(props);
    this.handleToggleButton = this.handleToggleButton.bind(this);
    this.state = {
      handleToggle:true,
      positive:false,
      negative:true,
      label:'NO',
      labelPosition:'left',
      isAcceptApplicationForPosition: false
    }
  }
  componentWillMount(){
    const {formCallBack}=this.props;
    const newState={
      isAcceptApplicationForPosition:this.state.isAcceptApplicationForPosition
    }
    formCallBack(newState);
  }
  handleToggleButton(){
    const {formCallBack}=this.props;
    const {handleToggle,positive,negative,label,labelPosition}=this.state;
    if(handleToggle){
      this.setState({
        handleToggle:false,
        positive:true,
        negative:false,
        label:'YES',
        labelPosition:'right',
        isAcceptApplicationForPosition: true,
      });
    }else{
      this.setState({
        handleToggle:true,
        positive:false,
        negative:true,
        label:'NO',
        labelPosition:'left',
        isAcceptApplicationForPosition: false
      });
    }
    const newState={
      isAcceptApplicationForPosition:this.state.isAcceptApplicationForPosition
    }
    formCallBack(newState);
  }
  render(){
    const {positive,negative,label,labelPosition}=this.state;
  return(
    <div>
      <Button
         toggle
         type="button"
         positive={positive}
         negative={negative}
         onClick={this.handleToggleButton}
         size="mini"
        style={{height:"40px",fontSize:"15px"}}
         circular
         content={label}
         labelPosition={labelPosition}
         floated="left"
         icon='circle thin'
       />
       <br/><br/><br/>
    </div>
    );
  }
}
