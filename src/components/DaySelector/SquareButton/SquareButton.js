import React, { PropTypes } from 'react';
import {Icon} from 'semantic-ui-react';
import './SquareButton.css';

function SquareButton({ name, onClick,dataDirection,...otherProps }) {
  return (
    <div className="shift-modal-day-cell-direction">
      <button
           type="button"
           className="shift-modal-day-cell-direction-button"
           onClick={onClick}
           id={dataDirection}
       >
         <Icon name={name} size="huge" onClick={onClick} id={dataDirection} fitted/>
      </button>
    </div>
  );
}

SquareButton.propTypes = {
  name: PropTypes.string.isRequired,
  onClick: PropTypes.func,
};

export default SquareButton;
