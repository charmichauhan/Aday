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
      labelPosition:'left'
    }
  }
  handleToggleButton(){
    const {handleToggle,positive,negative,label,labelPosition}=this.state;
    if(handleToggle){
      this.setState({
        handleToggle:false,
        positive:true,
        negative:false,
        label:'YES',
        labelPosition:'right'
      });
    }else{
      this.setState({
        handleToggle:true,
        positive:false,
        negative:true,
        label:'NO',
        labelPosition:'left'
      });
    }
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
