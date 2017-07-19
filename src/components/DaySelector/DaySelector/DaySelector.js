import _ from 'lodash';
import $ from 'webpack-zepto';
import moment from 'moment';
import React, { PropTypes } from 'react';
import DayCellButton from '../DayCell/DayCellButton';
import SquareButton from '../SquareButton/SquareButton';
import{getSubStringFromDayName,getCapitalMonthName} from './utility';

export default class DaySelector extends React.Component {

  constructor(props) {
    super(props);



    this.selectedDay = this.selectedDay.bind(this);
    this.stepDateRange=this.stepDateRange.bind(this);
    this.state = {
      selected: {},
      startdate:moment().format('MM-DD-YYYY'),
      tableSize:'7'
    };

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
  stepDateRange(event){
    const {startdate} = this.state;
    console.log(startdate);
    const $target = $(event.target)
    console.log($target);
    const dataDirection = $target[0]['id'];
    console.log(dataDirection);
    if(dataDirection === 'left'){
        const newStartDate = moment(startdate).subtract(1,'days').format('MM-DD-YYYY');
        this.setState({startdate: newStartDate});
    }else {
        const newStartDate=moment(startdate).add(1,'days').format('MM-DD-YYYY');
        this.setState({startdate:newStartDate});
    }
  }

  render() {
    const { selected } = this.state;
    const { tableSize, startdate }=this.state;
    const startMoment = moment(startdate);
    const cells = _.map(_.range(tableSize), (i) => {
      const calDate = startMoment.clone().add(i, 'days');
      return {
        daySubString: getSubStringFromDayName(calDate.format('dddd')),
        displayMonth: getCapitalMonthName(calDate.format('MMM')),
        displayDate: calDate.format('D'),
        cellId: calDate.format('YYYY-MM-DD'),
      };
    });
    return (
      <div>
        <div style={{float:'left'}}>
          <SquareButton
            name="angle left"
            onClick={this.stepDateRange}
            dataDirection="left"
          />
        </div>
        <div style={{float:'left'}}>
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
        <div style={{float:'left'}}>
        <SquareButton
          name="angle right"
          onClick={this.stepDateRange}
          dataDirection="right"
        />
     </div>
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
