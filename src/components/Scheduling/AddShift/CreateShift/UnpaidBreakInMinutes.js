import React, { Component } from 'react';
import $ from 'webpack-zepto';
import { List, Input } from 'semantic-ui-react';
import _ from 'lodash';
import validator from 'validator';

import NumberButton from '../../../NumberButton/NumberButton';

const mins = [0, 15, 30, 45, 60, 90, 120];

export default class UnpaidBreakInMinutes extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedValue: ''
    }
  }

  componentWillMount() {
    const { formCallBack } = this.props;
    const value = {
      unpaidBreakInMinutes: this.state.selectedValue
    };
    formCallBack(value);
  }

  selectValue = (event) => {
    const { formCallBack } = this.props;
    const $target = $(event.target);
    const numberValue = $target.data('time-value');
    this.setState({ selectedValue: numberValue });
    const value = {
      unpaidBreakInMinutes: numberValue
    };
    formCallBack(value);
  };

  setValue = (event) => {
    const { formCallBack } = this.props;
    const { value } = event.target;
    let error;
    if (value !== '' && !validator.isNumeric(value)) {
      error = 'Value must be in integer';
    }
    formCallBack(value);
    this.setState({ selectedValue: value, error });
  };

  render() {
    const { selectedValue, error } = this.state;

    const getErrorClasses = (isError) => {
      return `alert alert-danger fade ${isError ? 'in' : 'out'} alert-dismissable`;
    };

    return (
      <div>
        <label className="text-uppercase blue-heading">
          <span className="red">UNPAID </span> BREAK IN MINUTES
        </label>
        <List horizontal>
          {
            _.map(mins, (value) => {
              const displayValue = value;
              const inputValue = String(value);
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
        <Input type='text' className="extra-min" value={selectedValue} onChange={this.setValue} style={{textAlign:'center', fontSize:17}}/>
        <div style={{ display: error && 'block' || 'none' }} className={getErrorClasses(error)}>
          <span>Value must be an integer</span>
        </div>
      </div>
    );
  }
}
