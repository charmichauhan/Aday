import React, { PropTypes } from 'react';
import classNames from 'classnames';

import './DayCellButton.css';

function DayCellButton({
  daySubString,
  cellId,
  displayMonth,
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
      <button type="button" className={buttonClasses} onClick={onClick} data-cellId={cellId}>
        {daySubString}
        <p style={{  marginTop: '-13%',fontWeight: '500'}}>{displayMonth} {displayDate}</p>
        <div className="display-date"></div>
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
