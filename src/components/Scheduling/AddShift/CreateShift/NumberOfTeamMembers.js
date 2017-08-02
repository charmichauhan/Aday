import React,{Component} from 'react';
import $ from 'webpack-zepto';
import NumberButton from '../../../NumberButton/NumberButton';
import {List} from 'semantic-ui-react';
import _ from 'lodash';

export default class NumberOfTeamMenmbers extends Component {
  constructor(props){
    super(props);
    this.selectValue = this.selectValue.bind(this);
    this.state = {
      selectedValue:''
    }
  }
  componentWillMount(){
    const {formCallBack}=this.props;
    const value={
      numberOfTeamMembers:this.state.selectedValue
    }
    formCallBack(value);
  }
  selectValue(event){
    const {formCallBack}=this.props
    const $target=$(event.target);
    const numberValue=$target.data('time-value');
    console.log(numberValue);
    this.setState({selectedValue: numberValue });
    const value={
      numberOfTeamMembers:numberValue
    }
    formCallBack(value);
   }

  render(){
    const {selectedValue} = this.state;
    return(
      <div style={{marginTop: "40px"}}>
         <p style={{fontSize:'18px',fontStyle:'normal',color:'#666666'}}>NUMBER OF TEAM MEMBERS</p>
         <List horizontal style={{marginTop: "-10px"}}>
         {
           _.map(_.range(1, 12), (value) => {
           const displayValue = value === 11 ? '+' : value;
           const inputValue =  String(value);
           const liKey = `number-button-li-${inputValue}`;
           const buttonKey = `number-button-${inputValue}`;
           return (
             <List.Item key={liKey}>
               <NumberButton
                 key={buttonKey}
                 display={displayValue}
                 dataValue={displayValue}
                 currentValue={selectedValue}
                 onClick={this.selectValue}
                 />
              </List.Item>
             );
            })
           }
        </List>
      </div>
    );
  }
}
