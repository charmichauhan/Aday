import React, { PropTypes } from 'react';
import classNames from 'classnames';

import './TimeNumberButton.css';

function TimeSelectorNumberButton({
  display,
  dataValue,
  currentValue,
  onClick,
  ...otherProps
}) {
  const classes = classNames({
    'time-selector-number-button': true,
    selected: currentValue === dataValue,
  });

  return (
    <button
      className={classes}
      data-time-value={dataValue}
      onClick={onClick}
      {...otherProps}
    >
      {display}
    </button>
  );
}

TimeSelectorNumberButton.propTypes = {
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

export default TimeSelectorNumberButton;
