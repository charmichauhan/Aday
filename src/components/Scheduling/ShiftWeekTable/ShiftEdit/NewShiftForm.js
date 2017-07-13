import React, { Component } from 'react'
import { TimePickerForm } from '../../../App/KendallLearning/datePickerForm'
import { Field } from 'redux-form'
import { 
	SelectField,
	TextField,
	Toggle
 } from 'redux-form-material-ui'
import MenuItem from 'material-ui/MenuItem'

export default class NewShiftForm extends Component {
	render() {
		return (
			<form>
				<div>
					<Field
						name="workplace"
						component={SelectField}
						hintText="Workplace"
						floatingLabelText="Workplace">
						<MenuItem value={'Chao Center'} primaryText="Chao Center"/>
					</Field>
				</div>
				<div>
					<Field
						name="position"
						component={SelectField}
						hintText="Position"
						floatingLabelText="Position">
						<MenuItem value={'Supervisor'} primaryText="Supervisor"/>
					</Field>
				</div>

				<div>
					<label>Start Time</label>
					<Field name="start" component={TimePickerForm}/>
				</div>
				<div>
					<label>End Time</label>
					<Field name="end" component={TimePickerForm}/>
				</div>
				<div>
					<Field
						name="thinCrust"
						component={Toggle}
						label="Job Shadowing Opportunity"
						labelPosition="right"
					/>
				</div>
				<div>
					<Field
						name="unpaidBreak"
						component={SelectField}
						hintText="Unpaid Break"
						floatingLabelText="Unpaid Break">
						<MenuItem value={'30 Minutes'} primaryText="30 Minutes"/>
					</Field>
				</div>
				<div>
					<Field
						name="manager"
						component={SelectField}
						hintText="Manager"
						floatingLabelText="Manager">
						<MenuItem value={'Rahkeem Moris'} primaryText="Rahkeem Moris"/>
					</Field>
				</div>
				<div>
					<Field
						name="maximumIncentiveBonusPerHour"
						component={SelectField}
						hintText="$0.00"
						floatingLabelText="Maximum incentive bonus per hour">
						<MenuItem value={'$0.00'} primaryText="$0.00"/>
					</Field>
				</div>
				<div>
					<Field
						name="instructions"
						component={TextField}
						hintText="Enter additional information about this shift"
						floatingLabelText="Instructions"/>
				</div>
				
			</form>
		);
	}
}
