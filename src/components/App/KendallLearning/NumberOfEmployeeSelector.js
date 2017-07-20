import React,{Component} from 'react';
import TimeSelectorNumberButton from './TimePicker/NumberButton/TimeSelectorButton';
import {List} from 'semantic-ui-react';
import _ from 'lodash';

export default class NumberOfEmployeeSelector extends Component {
  constructor(props){
    super(props);
     
  }
  render(){
    return(
      <div style={{marginTop:'26%'}}>
         <p style={{fontSize:'20px',fontStyle:'normal',color:'rgba(0, 0, 0, 0.87)'}}>NUMBER OF TEAM MEMBERS</p>
         <List horizontal>
         {
           _.map(_.range(1, 13), (value) => {
           const inputValue =  String(value);
           const liKey = `number-button-li-${inputValue}`;
           const buttonKey = `number-button-${inputValue}`;
           return (
             <List.Item key={liKey}>
               <TimeSelectorNumberButton
                 key={buttonKey}
                 display={value}
                 dataValue={inputValue}
                 currentValue='1'
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
