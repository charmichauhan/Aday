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
      selectedValue:'1'
    }
  }
  selectValue(event){
    const $target=$(event.target);
    const numberValue=$target.data('time-value');
    console.log(numberValue);
    this.setState({selectedValue: numberValue });
   }

  render(){
    const {selectedValue} = this.state;
    return(
      <div style={{marginTop:'35%'}}>
         <p style={{fontSize:'20px',fontStyle:'normal',color:'rgba(0, 0, 0, 0.87)'}}>NUMBER OF TEAM MEMBERS</p>
         <List horizontal>
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
