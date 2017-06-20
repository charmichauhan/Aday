import moment from 'moment';
import { reduxForm, formValueSelector } from 'redux-form';
import {connect} from 'react-redux';
import EmergencyShiftForm from './EmergencyShiftForm';

const validate = values => {
  const errors = {}
  if (!values.workplace) {
    errors.workplace = 'Required'
  }
  if (!values.certification) {
    errors.certification = 'Required'
  }
  if (!values.date) {
    errors.date = 'Required'
  } else if (moment(values.date, 'MM-DD-YYYY').diff(moment(), 'days')<0) {
    errors.date = 'Invalid'
  }
  if (!values.start) {
    errors.start = 'Required'
  }
  if (!values.end) {
    errors.end = 'Required'
  } else if (moment(values.end, "hh:mm a").diff(moment(values.start, "hh:mm a")) < 0) {
    errors.end = 'Invalid'
  }
  return errors
}

const selector = formValueSelector('EmergencyShiftForm');

const mapStateToProps = (state) => ({
  numMembers: selector(state, 'members')
});

const mapDispatchToProps = (dispatch) => ({
  actions: {}
});

const EmergencyShiftFormContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(EmergencyShiftForm);

// Decorate the form component
export default reduxForm({
  form: 'EmergencyShiftForm', // a unique name for this form
  validate,
  initialValues: {'date': moment().format("MM-DD-YYYY"), 'members': 1}
})(EmergencyShiftFormContainer);
