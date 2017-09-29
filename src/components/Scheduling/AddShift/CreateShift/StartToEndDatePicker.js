import React, { Component } from 'react';
import { Calendar } from 'react-date-range';
import { Icon } from 'semantic-ui-react';
import RaisedButton from 'material-ui/RaisedButton';
import moment from 'moment';

export default class StartToEndTimePicker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      startDate: moment(props.startDate),
      endDate: moment(props.endDate),
      startDateSelector: false,
      endDateSelector: false
    };
  }

  componentWillMount() {
    const { formCallBack } = this.props;
    const { startDate, endDate } = this.state;
    formCallBack({ startDate, endDate });
  }

  toggleStartSelector = () => {
    this.setState((state) => ({ startDateSelector: !state.startDateSelector }));
  };

  toggleEndSelector = () => {
    this.setState((state) => ({ endDateSelector: !state.endDateSelector }));
  };

  handleShiftDatesChange = (name, value) => {
    if (name === 'never') {
      this.setState((state) => ({ [name]: value, endDateValue: '' }));
    } else {
      this.setState((state) => ({
        [name]: value,
        [name + 'Selector']: !state[name + 'Selector'],
        [name + 'Value']: value.format('MMM DD, YYYY')
      }));
    }
    this.props.formCallBack({ [name]: value });
  };

  render() {
    const { startDateSelector, startDate, startDateValue, endDateSelector, endDate, endDateValue } = this.state;
    return (
      <div className="time-selector-wrapper">
        <div className="date-wrapper border-wrapper" onClick={this.toggleStartSelector}>
          <label className="text-uppercase blue-heading">Starts On</label>
          <p className="start-date">{startDateValue || 'When does this shift start?'}
            <span><i className="fa fa-clock-o clock-font" /></span>
          </p>
        </div>
        <div className="date-wrapper border-wrapper" onClick={this.toggleEndSelector}>
          <label className="text-uppercase blue-heading">Ends On</label>
          <p className="start-date">{endDateValue || 'When does this shift end?'}
            <span><i className="fa fa-clock-o clock-font" /></span>
          </p>
        </div>
        <div className="date-selector-display" style={{ display: startDateSelector ? 'block' : 'none' }}>
          <Calendar date={startDate} onChange={(date) => this.handleShiftDatesChange('startDate', date)} />
        </div>
        <div className="date-selector-display end-date-selector" style={{ display: endDateSelector ? 'block' : 'none', right: 0 }}>
          <RaisedButton label="Never"
                        style={{ boxShadow: 'none' }}
                        icon={<Icon name="genderless" className="floatLeft never-icon" /> }
          />
          <p className="text-center or-btn">OR</p>
          <Calendar date={endDate} onChange={(date) => this.handleShiftDatesChange('endDate', date)} />
        </div>
      </div>
    );
  }
}
