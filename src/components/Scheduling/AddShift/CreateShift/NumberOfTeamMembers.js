import React, { Component } from 'react';
import $ from 'webpack-zepto';
import NumberButton from '../../../NumberButton/NumberButton';
import { List, Input } from 'semantic-ui-react';
import _ from 'lodash';
import validator from 'validator';

export default class NumberOfTeamMembers extends Component {
  constructor(props) {
    super(props);
    this.selectValue = this.selectValue.bind(this);
    this.state = {
      selectedValue: this.props.numberOfTeamMembers || 1
    }
  }

  componentWillMount() {
    const { formCallBack } = this.props;
    const value = {
      numberOfTeamMembers: this.state.selectedValue
    };
    formCallBack(value);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.numberOfTeamMembers !== this.state.selectedValue) {
      this.setState({ selectedValue: nextProps.numberOfTeamMembers});
    }
  }

  selectValue(event) {
    const { formCallBack } = this.props;
    const $target = $(event.target);
    let numberValue = $target.data('time-value');
    if (typeof numberValue === 'string' && numberValue.length) numberValue = parseInt(numberValue);
    this.setState({ selectedValue: numberValue });
    const value = {
      numberOfTeamMembers: numberValue
    };
    formCallBack(value);
  }

  setValue = (event) => {
    const { formCallBack } = this.props;
    let { value } = event.target;
    let error;
    if (value !== '' && !validator.isNumeric(value)) {
      error = 'Value must be in integer';
    }
    if (!error && typeof value === 'string' && value.length) value = parseInt(value);
    formCallBack({ numberOfTeamMembers: value });
    this.setState({ selectedValue: value, error });
  };

  render() {

    const { selectedValue, error } = this.state;

    const getErrorClasses = (isError) => {
      return `alert alert-danger fade ${isError ? 'in' : 'out'} alert-dismissable`;
    };

    return (
      <div>
        <label className="text-uppercase blue-heading">NUMBER OF TEAM MEMBERS</label>
        <List horizontal>
          {
            _.map(_.range(1, 8), (value) => {
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
{/*        <input  className="extra-min" value={selectedValue} onChange={this.setValue}/> */}
        <Input type='text' className="extra-min" value={selectedValue} onChange={this.setValue} style={{textAlign:'center', fontSize:17}}/>
        <div style={{ display: error && 'block' || 'none' }} className={getErrorClasses(error)}>
          <span>Value must be an integer</span>
        </div>
      </div>
    );
  }
}
