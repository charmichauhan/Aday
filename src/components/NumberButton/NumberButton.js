import React, { PropTypes } from 'react';
import classNames from 'classnames';

import './NumberButton.css';

function NumberButton(props) {
  
  const {
    display,
    dataValue,
    currentValue,
    onClick,
    ...otherProps
  } = props;

  const classes = classNames({
    'time-selector-number-button': true,
    selected: currentValue === dataValue,
  });

  return (
    <button
      type="button"
      className={classes}
      data-time-value={dataValue}
      onClick={onClick}
      {...otherProps}
    >
      {display}
    </button>
  );
}

NumberButton.propTypes = {
  display: React.PropTypes.oneOfType([
    React.PropTypes.string,
    React.PropTypes.number,
  ]),
  dataValue: React.PropTypes.oneOfType([
    React.PropTypes.string,
    React.PropTypes.number,
  ]),
  currentValue: React.PropTypes.oneOfType([
    React.PropTypes.string,
    React.PropTypes.number,
  ]),
};

export default NumberButton;
