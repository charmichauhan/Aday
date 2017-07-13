import { reduxForm, formValueSelector } from 'redux-form'
import { connect } from 'react-redux'
import NewShiftForm from './NewShiftForm'

const validate = values => {
	const errors = {}
	if(!values.workplace) {
		errors.workplace = "Required"
	}
	if(!values.position) {
		errors.position = "Required"
	}
	return errors
}

const selector = formValueSelector('NewShiftForm')

const mapStateToProps = state => ({
	numMembers: selector(state, 'member')
})

const mapDispatchToProps = dispatch =>({
	actions: {}
})

const NewShiftFormContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(NewShiftForm)

export default reduxForm({
	form: 'NewShiftForm',
	validate,
	initialValues:{}
})(NewShiftFormContainer)