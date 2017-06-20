import { DatePickerForm, TimePickerForm } from './datePickerForm';
import React, { Component } from 'react';
import { Field } from 'redux-form';
import { Slider, SelectField } from 'redux-form-material-ui';
import { Icon, Button } from 'semantic-ui-react'
import MenuItem from 'material-ui/MenuItem';

class EmergencyShiftForm extends Component {
  render() {
    const { handleSubmit, numMembers, pristine, reset, submitting } = this.props;
    return (
      <form onSubmit={handleSubmit}>
        <h3>Emergency Shift &nbsp;<Icon name="warning sign"/></h3>
        <div style={{marginTop: -25}}>
          <Field name="workplace" component={SelectField} hintText="Workplace"
           floatingLabelText="Workplace">
            <MenuItem value={'Chao Center'} primaryText="Chao Center"/>
          </Field>
        </div>
        <div>
          <label>Date</label>
          <Field name="date" component={DatePickerForm}/>
        </div>
        <div style={{marginTop: -5}}>
          <Field name="template" component={SelectField} label="Template (Optional)"
           floatingLabelText="Template (Optional)">
            <MenuItem value={'A'} primaryText="Template A"/>
            <MenuItem value={'B'} primaryText="Template B"/>
          </Field>
        </div>
        <div style={{marginTop: -15}}>
          <Field name="certification" component={SelectField} hintText="Certification"
            floatingLabelText="Certification">
          <MenuItem value={'Line Cook'} primaryText="Line Cook"/>
          <MenuItem value={'Sushi Chef'} primaryText="Sushi Chef"/>
          </Field>
        </div>
        <div>Number of Team Members: {numMembers}</div>
        <div>
          <Field
            name="members"
            component={Slider}
            defaultValue={1}
            format={null}
            min={1}
            max={10}
            step={1}
          />
        </div>
        <div style={{marginTop: -30}}>
          <label>Start Time</label>
          <Field name="start" component={TimePickerForm}/>
        </div>
        <div>
          <label>End Time</label>
          <Field name="end" component={TimePickerForm}/>
        </div>
        <div style={{padding: 15, textAlign: 'center'}}>
        <Button type="submit" disabled={pristine || submitting}>Create Shift</Button>
        <Button type="button" disabled={pristine || submitting} onClick={reset}>Clear</Button>
        </div>
      </form>
    );
  }
}

export default EmergencyShiftForm;
