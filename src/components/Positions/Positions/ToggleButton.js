import React,{Component} from 'react';
import {Button,Icon} from 'semantic-ui-react';

export default class ToggleButton extends Component {
  constructor(props){
    super(props);
    this.handleToggleButton = this.handleToggleButton.bind(this);
    this.state = {
      opportunityId: this.props.opportunityId,
      handleToggle: !this.props.initial,
      positive: this.props.initial,
      negative: !this.props.initial,
      label: this.props.initial? 'YES': 'NO',
      labelPosition: this.props.initial? 'right': 'left',
      value: this.props.initial || false
    }
  }
  // make buttom refresh when new position is opened in drawer
  componentWillReceiveProps(newProps){
    if(newProps.opportunityId != this.props.opportunityId) {
      this.setState({
        opportunityId: newProps.opportunityId,
        handleToggle: !newProps.initial,
        positive: newProps.initial,
        negative: !newProps.initial,
        label: newProps.initial? 'YES': 'NO',
        labelPosition: newProps.initial? 'right': 'left',
        value: newProps.initial || false
      });
    }
  }
  componentWillMount(){
    const {formCallBack}=this.props;
    const newState={
      value: this.state.value
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
        value: false,
      });
    }else{
      this.setState({
        handleToggle:true,
        positive:false,
        negative:true,
        label:'NO',
        labelPosition:'left',
        value: true
      });
    }
    const newState={
      value:this.state.value
    }
    formCallBack(newState);
  }
  render(){
    const {positive,negative,label,labelPosition}=this.state;
  return(
    <div style={{marginTop: 15}}>
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
