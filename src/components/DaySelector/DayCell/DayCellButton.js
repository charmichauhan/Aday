import React, { PropTypes } from 'react';
import classNames from 'classnames';
import moment from 'moment';

import './DayCellButton.css';

function DayCellButton({
  daySubString,
  cellId,
  displayMonth,
  displayDate,
  fullDate,
  selected,
  onClick,
}) {
  const buttonClasses = classNames({
    'shift-modal-day-cell-button': true,
    selected,
  });

  const filteredOnClick = (e) => {
    console.log(fullDate.format());
    console.log(moment().format());
    console.log(moment().diff(fullDate, 'days'));
    if (moment().diff(fullDate, 'days') <= 0){
      onClick(e)
    }
  };

  return (
    <div className="shift-modal-day-cell">
      <button type="button" className={buttonClasses} data-cellId={cellId} disabled={true}
              onClick={filteredOnClick}>
        {daySubString}
        <p style={{  marginTop: '-13%',fontWeight: '500'}} data-cellId={cellId} onClick={filteredOnClick}>
          {displayMonth} {displayDate}
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
};

export default DayCellButton;
