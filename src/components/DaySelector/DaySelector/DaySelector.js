import _ from 'lodash';
import $ from 'webpack-zepto';
import moment from 'moment';
import React, { PropTypes } from 'react';
import DayCellButton from '../DayCell/DayCellButton';
import './DaySelector.css';

const DAY_NAME_LETTER_MAP = {
  monday: 'MON',
  tuesday: 'TUE',
  wednesday: 'WED',
  thursday: 'THU',
  friday: 'FRI',
  saturday: 'SAT',
  sunday: 'SUN',
};

function getLetterFromDayName(dayName) {
  return _.get(DAY_NAME_LETTER_MAP, dayName.toLowerCase(), '');
}
  export default class DaySelector extends React.Component {

  constructor(props) {
    super(props);

    const { tableSize, startDate } = this.props;
    const startMoment = moment(startDate);
    const cells = _.map(_.range(tableSize), (i) => {
      const calDate = startMoment.clone().add(i, 'days');
      return {
        daySubString: getLetterFromDayName(calDate.format('dddd')),
        displayDate: calDate.format('M/D'),
        cellId: calDate.format('YYYY-MM-DD'),
      };
    });

    this.selectedDay = this.selectedDay.bind(this);
    this.state = {
      selected: {},
    };
    this.cells = cells;
  }

  componentWillMount() {
    const selectedState = {};
    const { selectedDate} = this.props;
    _.forEach(this.cells, (cell) => {
      selectedState[cell.cellId] = false;
    });

    if (_.has(selectedState, selectedDate)) {
      selectedState[selectedDate] = true;
    }

    this.setState({ selected: selectedState });
  //  formCallback({ selectedDays: selectedState });
  }

  selectedDay(event) {
    const cellId = $(event.target).data('cellid');
    const { selected } = this.state;
    //const { formCallback } = this.props;
    const currentValue = selected[cellId];
    const selectedDays = _.extend({}, selected, { [cellId]: !currentValue });

    this.setState({ selected: selectedDays });
    //formCallback({ selectedDays });
  }

  render() {
    const { selected } = this.state;

    return (
      <div className="shift-modal-day-selector">
        {
          _.map(this.cells, (cell) => {
            const cellKey = `${cell.cellId}-modal-day-cell`;
            return (
              <DayCellButton
                {...cell}
                selected={selected[cell.cellId]}
                onClick={this.selectedDay}
                key={cellKey}
              />
            );
          })
        }
      </div>
    );
  }
}

DaySelector.propTypes = {
  tableSize: PropTypes.number.isRequired,
  startDate: PropTypes.string.isRequired,
  selectedDate: PropTypes.string,
  //formCallback: PropTypes.func.isRequired,
};
