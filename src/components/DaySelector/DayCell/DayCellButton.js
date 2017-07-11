import React, { PropTypes } from 'react';
import classNames from 'classnames';

import './DayCellButton.css';

function DayCellButton({
  daySubString,
  cellId,
  displayDate,
  selected,
  onClick,
}) {
  const buttonClasses = classNames({
    'shift-modal-day-cell-button': true,
    selected,
  });

  return (
    <div className="shift-modal-day-cell">
      <button className={buttonClasses} onClick={onClick} data-cellId={cellId}>
        {daySubString}
        <div className="display-date">{displayDate}</div>
      </button>
    </div>
  );
}

DayCellButton.propTypes = {
  daySubString: PropTypes.string.isRequired,
  displayDate: PropTypes.string.isRequired,
  cellId: PropTypes.string.isRequired,
  selected: PropTypes.bool,
  onClick: PropTypes.func,
};

export default DayCellButton;
