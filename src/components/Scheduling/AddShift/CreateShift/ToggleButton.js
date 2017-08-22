import React,{Component} from 'react';
import {Button,Icon} from 'semantic-ui-react';

export default class ToggleButton extends Component {
  constructor(props){
    super(props);
    this.handleToggleButton = this.handleToggleButton.bind(this);
    if (this.props.trainees){
      this.state = {
        handleToggle: true,
        positive: true,
        negative: false,
        label:'YES',
        labelPosition:'right',
        jobShadowingOpportunity: true
      }
    } else {
      this.state = {
        handleToggle: this.props.trainees || false,
        positive: this.props.trainees || false,
        negative: !this.props.trainees || true,
        label:'NO',
        labelPosition:'left',
        jobShadowingOpportunity: this.props.trainees || false
      }
    }
  }
  componentWillMount(){
    const {formCallBack}=this.props;
    const newState={
      jobShadowingOpportunity:this.state.jobShadowingOpportunity
    }
    formCallBack(newState);
  }
  handleToggleButton(){
    const {formCallBack}=this.props;
    const {handleToggle,positive,negative,label,labelPosition}=this.state;
    if(!handleToggle){
      this.setState({
        handleToggle:true,
        positive:true,
        negative:false,
        label:'YES',
        labelPosition:'right',
        jobShadowingOpportunity: true,
      });
    }else{
      this.setState({
        handleToggle:false,
        positive:false,
        negative:true,
        label:'NO',
        labelPosition:'left',
        jobShadowingOpportunity: false
      });
    }
    const newState={
      jobShadowingOpportunity: !this.state.jobShadowingOpportunity
    }
    formCallBack(newState);
  }
  render(){
    const {positive,negative,label,labelPosition}=this.state;
  return(
      <Button
         toggle
         type="button"
         positive={positive}
         negative={negative}
         onClick={this.handleToggleButton}
         size="tiny"
         circular
         content={label}
         labelPosition={labelPosition}
         floated="left"
         icon='circle thin'
       />
    );
  }
}
