import React from 'react';
import moment from 'moment';
import TimePicker from 'rc-time-picker';
import 'rc-time-picker/assets/index.css';
import { DateField } from 'react-date-picker';
import 'react-date-picker/index.css'

const DatePickerForm = ({input, placeholder, defaultValue, meta: {touched, error} }) => (
  <div>
        <DateField {...input} updateOnDateClick={true} footer={false}
         collapseOnDateClick={true} dateFormat="MM-DD-YYYY"
         selected={input.value ? moment("06-16-2017", "MM-DD-YYYY") : null} />
         <br></br>
        {touched && error && <span style={{color: "red", marginTop: 5}}>{error}</span>}
  </div>
);

function disabledMinutes(h) {
  var ret = [];
  for(let value = 0; value < 60; value++) {
    if(value%5 !== 0) {
      ret.push(value);
    }
  }
  return ret;
}

const TimePickerForm = ({input, placeholder, defaultValue, meta: {touched, error} }) => (
  <div>
        <TimePicker {...input}
                     showSecond={false}
                     use12Hours={true}
                     disabledMinutes={disabledMinutes}
                     hideDisabledOptions={true}
                     value={input.value ? input.value : null}/>
        {touched && error && <span style={{color: "red", marginLeft: 20}}>{error}</span>}
  </div>
);

export { DatePickerForm, TimePickerForm };
