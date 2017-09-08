import React, { Component } from 'react';
import $ from 'webpack-zepto';
import { List } from 'semantic-ui-react';
import _ from 'lodash';

import NumberButton from '../../../NumberButton/NumberButton';

const mins = [0, 15, 30, 45, 60, 90, 120, 150];

export default class UnpaidBreakInMinutes extends Component {
  constructor(props) {
    super(props);
    this.selectValue = this.selectValue.bind(this);
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

  selectValue(event) {
    const { formCallBack } = this.props;
    const $target = $(event.target);
    const numberValue = $target.data('time-value');
    this.setState({ selectedValue: numberValue });
    const value = {
      unpaidBreakInMinutes: numberValue
    };
    formCallBack(value);
  }

  render() {
    const { selectedValue } = this.state;
    return (
      <div style={{ marginTop: '40px' }}>
        <p style={{ fontSize: '18px', fontStyle: 'normal', color: '#666666' }}>UNPAID BREAK IN MINUTES</p>
        <List horizontal style={{ marginTop: '-10px' }}>
          {
            _.map(mins, (value) => {
              const displayValue = value > 120 ? '+' : value;
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
      </div>
    );
  }
}
