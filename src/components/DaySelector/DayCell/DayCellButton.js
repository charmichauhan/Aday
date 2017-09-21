import React, { PropTypes } from 'react';
import classNames from 'classnames';
import moment from 'moment';

import './DayCellButton.css';

function DayCellButton(props) {
  const {
    daySubString,
    cellId,
    displayMonth,
    displayDate,
    fullDate,
    selected,
    onClick,
    isRecurring
  } = props;

  const buttonClasses = classNames({
    'shift-modal-day-cell-button': true,
    selected,
  });

  const filteredOnClick = (e) => {
    console.log(fullDate.format());
    console.log(moment().format());
    console.log(moment().diff(fullDate, 'days'));
    onClick(e);
    // if (moment().diff(fullDate, 'days') <= 0) {
    //
    // }
  };

  return (
    <div className="shift-modal-day-cell" onClick={filteredOnClick}>
      <button type="button" className={buttonClasses} data-cellId={cellId} disabled={true}>
        <p data-cellId={cellId} className={isRecurring && 'shift-day-red'} style={{ width: '100%', height: '100%' }}>
          <p data-cellId={cellId} className={daySubString === 'Today' && 'day-label-red text-uppercase' || 'day-label'}>{daySubString}</p>
          <p data-cellId={cellId} className="month-date-label">{displayMonth} {displayDate}</p>
        </p>
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
  isRecurring: PropTypes.bool
};

export default DayCellButton;
