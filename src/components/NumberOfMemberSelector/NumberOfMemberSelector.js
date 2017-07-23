import React,{Component} from 'react';
import $ from 'webpack-zepto';
import NumberButton from '../NumberButton/NumberButton';
import {List} from 'semantic-ui-react';
import _ from 'lodash';

export default class NumberOfEmployeeSelector extends Component {
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
    this.setState({selectedValue: numberValue });
  }
  render(){
    const {selectedValue} = this.state;
    return(
      <div>
        <List horizontal>
         {
           _.map(_.range(1, 13), (value) => {
           const inputValue =  String(value);
           const liKey = `number-button-li-${inputValue}`;
           const buttonKey = `number-button-${inputValue}`;
           return (
             <List.Item key={liKey}>
               <NumberButton
                 key={buttonKey}
                 display={value}
                 dataValue={value}
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
