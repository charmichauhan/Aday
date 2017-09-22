import _ from 'lodash';
import $ from 'webpack-zepto';
import moment from 'moment';
import React, { PropTypes } from 'react';
import DayCellButton from '../DayCell/DayCellButton';
import SquareButton from '../SquareButton/SquareButton';
import{ getSubStringFromDayName, getCapitalMonthName } from './utility';

export default class DaySelector extends React.Component {

  constructor(props) {
    super(props);

    const date = moment(this.props.startDate).format('MM-DD-YYYY');
    this.selectedDay = this.selectedDay.bind(this);
    this.stepDateRange = this.stepDateRange.bind(this);
    this.state = {
      selected: {},
      startdate: this.props.startDate
    };
  }

  componentWillMount() {
    const selectedState = {};
    const { selectedDate } = this.props;
    _.forEach(this.cells, (cell) => {
      selectedState[cell.cellId] = false;
    });

    if (_.has(selectedState, selectedDate)) {
      selectedState[selectedDate] = true;
    }

    this.setState({ selected: selectedState });
    //  formCallback({ selectedDays: selectedState });
  }

  componentWillReceiveProps(nextProps) {
    const props = this.props;
    let { selected } = this.state;
    if (nextProps.startDate.valueOf() !== props.startDate.valueOf()) {
      this.setState({ startdate: nextProps.startDate });
    }
    if (nextProps.isRecurring !== props.isRecurring) {
      this.setState({ selected: {} });
    }
    if (selected && !selected[nextProps.selectedDate]) {
      this.setState(() => {
        selected[nextProps.selectedDate] = true;
        this.setState({ selected });
        if (props.callBack) {
          props.callBack({ shiftDaysSelected: selected });
        }
      });
    }
  }

  selectedDay(event) {
    const { callBack } = this.props;
    const cellId = $(event.target).data('cellid');
    const { selected } = this.state;
    const currentValue = selected[cellId];
    const selectedDays = _.extend({}, selected, { [cellId]: !currentValue });
    this.setState({ selected: selectedDays });
    const shiftDaysSelected = {
      shiftDaysSelected: selectedDays
    };
    callBack(shiftDaysSelected);
  }

  stepDateRange(event) {
    const { startdate } = this.state;
    const $target = $(event.target);
    const { tableSize } = this.props;
    const dataDirection = $target[0]['id'];
    if (dataDirection === 'left') {
      const newStartDate = moment(startdate).subtract(7, 'days').format('MM-DD-YYYY');
      this.setState({ startdate: newStartDate });
    } else {
      const newStartDate = moment(startdate).add(7, 'days').format('MM-DD-YYYY');
      this.setState({ startdate: newStartDate });
    }
  }

  render() {
    const { selected, startdate } = this.state;
    const { tableSize, isRecurring } = this.props;

    const startMoment = moment(startdate);
    const cells = _.map(_.range(tableSize), (i) => {
      const calDate = startMoment.clone().add(i, 'days');
      let daySubString = getSubStringFromDayName(calDate.format('dddd'));
      if (!isRecurring && moment().format('MM-DD-YYYY') === calDate.format('MM-DD-YYYY')) {
        daySubString = 'Today';
      }
      return {
        isRecurring,
        daySubString,
        displayMonth: getCapitalMonthName(calDate.format('MMM')),
        displayDate: calDate.format('D'),
        fullDate: calDate,
        cellId: calDate.format('MM-DD-YYYY'),
      };
    });
    return (
      <div style={{ height: 80 }}>
        <div style={{ float: 'left', paddingTop: 3 }}>
          {
            _.map(cells, (cell) => {
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
      </div>
    );
  }
}

DaySelector.propTypes = {
  tableSize: PropTypes.number.isRequired,
  startDate: PropTypes.object.isRequired,
  selectedDate: PropTypes.string,
  //formCallback: PropTypes.func.isRequired,
};

/* Not using this right now, too many use case s

 <div style={{float:'left'}}>
 <SquareButton
 name="angle left"
 onClick={this.stepDateRange}
 dataDirection="left"
 />
 </div>

 <div style={{float:'left'}}>
 <SquareButton
 name="angle right"
 onClick={this.stepDateRange}
 dataDirection="right"
 />
 </div>
 */
