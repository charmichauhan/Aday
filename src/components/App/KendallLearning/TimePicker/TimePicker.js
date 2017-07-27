import React , {Component,PropTypes} from 'react';
import moment from 'moment';
import $ from 'webpack-zepto';
import {Image,Input,List} from 'semantic-ui-react';
import TimeSelectorNumberButton from './NumberButton/TimeSelectorButton';
import _ from 'lodash';


export default class TimePicker extends Component {
  constructor(props){

    const startMoment = moment.utc(props.start,'YYYY-MM-DDTHH:mm:ss');

    const start = (startMoment.isValid()) ?
      startMoment.format('h:mm a') : '';

    const stopMoment = moment.utc(props.stop,'YYYY-MM-DDTHH:mm:ss');

    const stop = (stopMoment.isValid()) ?
      stopMoment.format('h:mm a') : '';

    super(props);

    this.state = {
      activeField: 'start',
      startFieldText: '00:00 am',
      stopFieldText: '00:00 pm',
      startHour: '',
      startMinute: '',
      startMeridiem: '',
      stopHour: '',
      stopMinute: '',
      stopMeridiem: '',
     };
     this.textFieldOnFocus = this.textFieldOnFocus.bind(this);
     this.textFieldOnChange = this.textFieldOnChange.bind(this);
     this.textFieldOnBlur = this.textFieldOnBlur.bind(this);
     this.timeButtonOnClick = this.timeButtonOnClick.bind(this);
     this.attemptToUpdateTime = this.attemptToUpdateTime.bind(this);
     this.getMomentState = this.getMomentState.bind(this);
     this.getHoursFromMeridiem = this.getHoursFromMeridiem.bind(this);
   }

   componentDidMount() {
     const { startFieldText, stopFieldText } = this.state;
     this.attemptToUpdateTime('start', startFieldText);
     this.attemptToUpdateTime('stop', stopFieldText);
   }
   getHoursFromMeridiem(meridiem) {
     return (meridiem.toLowerCase() === 'pm') ? 12 : 0;
   }
   getMomentState(field) {
     const stateHour = this.state[`${field}Hour`];
     const stateMinute = this.state[`${field}Minute`];
     const stateMeridiem = this.state[`${field}Meridiem`] || 'am';
     const momentState = moment(this.props.date || '2017-07-06');

     if (stateHour !== '') {
       momentState.hour(
         parseInt(stateHour, 10) +
         this.getHoursFromMeridiem(stateMeridiem)
       );
     }

     if (stateMinute !== '') {
       momentState.minute(parseInt(stateMinute, 10));
     }

     return momentState;
   }



   timeButtonOnClick(event) {
     const { activeField } = this.state;
     const $target = $(event.target);
     const timeSpec = $target.data('time-spec');
     const value = $target.data('time-value');
     const momentState = this.getMomentState(activeField);
     const stateMeridiem = this.state[`${activeField}Meridiem`];

     if (timeSpec === 'Meridiem') {
       let adjustment = 0;
       if (stateMeridiem === 'am' && value === 'pm') {
         adjustment = 12;
       } else if (stateMeridiem === 'pm' && value === 'am') {
         adjustment = -12;
       }
       momentState.add(adjustment, 'hours');
     } else if (timeSpec === 'Hour') {
       momentState.hour(
         parseInt(value, 10) + this.getHoursFromMeridiem(stateMeridiem)
       );
     } else if (timeSpec === 'Minute') {
       momentState.minute(value);
     }

     const hourValue = (momentState.format('h') === '12') ?
       '0' : momentState.format('h');

     const updatedState = {
       [`${activeField}Hour`]: hourValue,
       [`${activeField}Minute`]: momentState.format('mm'),
       [`${activeField}Meridiem`]: momentState.format('a'),
       [`${activeField}FieldText`]: momentState.format('h:mm a'),
     };

     this.setState(updatedState);

   }

   textFieldOnFocus(event) {
     console.log("xzczxc");
     const field = $(event.target).data('field-name');
     const { activeField } = this.state;

     if (field !== activeField) {
       this.setState({ activeField: field });
     }
   }

   textFieldOnChange(event) {
     const field = $(event.target).data('field-name');
     const value = event.target.value;
     this.setState({ [`${field}FieldText`]: value });
   }

   textFieldOnBlur(event) {
     const $target = $(event.target);
     const field = $target.data('field-name');
     const text = $target.val();
     this.attemptToUpdateTime(field, text);
   }

   attemptToUpdateTime(field, text) {
     const newState = {};
     const textMoment = moment(text, 'h:mm a');
     const momentState = this.getMomentState(field);
     const stateHour = this.state[`${field}Hour`];
     const stateMinute = this.state[`${field}Minute`];
     let fieldText = '';

     // update state if valid
     if (textMoment.isValid()) {
       const hourValue = (textMoment.format('h') === '12') ?
         '0' : textMoment.format('h');

       newState[`${field}Hour`] = hourValue;
       newState[`${field}Minute`] = textMoment.format('mm');
       newState[`${field}Meridiem`] = textMoment.format('a');
       fieldText = textMoment.format('h:mm a');

     // attempt to display existing state
     } else if (stateHour !== '' && stateMinute !== '') {
       fieldText = momentState.format('h:mm a');
     }

     newState[`${field}FieldText`] = fieldText;

     this.setState(newState);
   }
  render(){
    const { activeField, startFieldText, stopFieldText, startMeridiem,
            stopMeridiem, startHour, stopHour, startMinute,
            stopMinute } = this.state;
    const startFocused = activeField === 'start';
    const stopFocused = !startFocused;
    const meridiem = (startFocused) ? startMeridiem : stopMeridiem;
    const hour = (startFocused) ? startHour : stopHour;
    const minute = (startFocused) ? startMinute : stopMinute;

    return(
    <div>
    <div>
       <div style ={{float:'left',width:'30%'}}>
           <p style={{fontSize:'20px',fontStyle:'normal',color:'rgba(0, 0, 0, 0.87)'}}>START TIME</p>
           <Input
             label={<Image
                       size="tiny"
                       src="/images/Assets/Icons/Icons/start-time.png"
                       floated="left"
                       style = {{padding:'0px',height:"38px"}}
               />}
               labelPosition="left"
               placeholder="00:00 AM"
               style={{marginTop:'-3%',width:'100%',backgroundColor:'lightgrey'}}
           />
       </div>
       <div style ={{float:'right',width:'30%',marginRight:"20%"}}>
       <p style={{fontSize:'20px',fontStyle:'normal',color:'rgba(0, 0, 0, 0.87)'}}>END TIME</p>
           <Input
             label={<Image
                       size="tiny"
                       src="/images/Assets/Icons/Icons/end-time.png"
                       floated="left"
                       style = {{padding:'0px',height:"38px"}}
               />}
               labelPosition="left"
               placeholder="00:00 AM"
               style={{marginTop:'-3%',width:'100%',backgroundColor:'lightgrey'}}
           />
       </div>
    </div>
      <div style={{float:'left',marginTop:'3%',marginLeft:'0.7%'}} >
       <div>
         <List horizontal>
          {
            _.map(_.range(1, 7), (value) => {
            const inputValue =  String(value);
            const liKey = `time-button-li-${inputValue}`;
            const buttonKey = `time-button-${inputValue}`;
            return (
              <List.Item key={liKey}>
                <TimeSelectorNumberButton
                  key={buttonKey}
                  display={value}
                  dataValue={inputValue}
                  currentValue={hour}
                   onClick={this.timeButtonOnClick}
                  data-time-spec="Hour"
                 />
               </List.Item>
              );
             })
            }
          </List>
         </div>
         <div>
         <List horizontal>
         {
            _.map(_.range(7, 13), (value) => {
            const inputValue = (value === 12) ? '0' : String(value);
            const liKey = `time-button-li-${inputValue}`;
            const buttonKey = `time-button-${inputValue}`;
            return (
              <List.Item key={liKey}>
                <TimeSelectorNumberButton
                  key={buttonKey}
                  display={value}
                  dataValue={inputValue}
                  currentValue={hour}
                   onClick={this.timeButtonOnClick}
                  data-time-spec="Hour"
                 />
               </List.Item>
              );
             })
         }
       </List>
       </div>
      </div>
       <div style={{float:'left',marginTop:'3%',marginLeft:'6%'}}>
       <List horizontal>
         <List.Item>
           <TimeSelectorNumberButton
             display=":00"
             dataValue="00"
             currentValue={minute}
             onClick={this.timeButtonOnClick}
             data-time-spec="Minute"
           />
         </List.Item>
         <List.Item>
           <TimeSelectorNumberButton
             display=":15"
             dataValue="15"
             currentValue={minute}
             onClick={this.timeButtonOnClick}
             data-time-spec="Minute"
           />
         </List.Item>
        </List>
       <div>
        <List horizontal>
         <List.Item>
           <TimeSelectorNumberButton
             display=":30"
             dataValue="30"
             currentValue={minute}
             onClick={this.timeButtonOnClick}
             data-time-spec="Minute"
           />
         </List.Item>
         <List.Item>
           <TimeSelectorNumberButton
             display=":45"
             dataValue="45"
             currentValue={minute}
             onClick={this.timeButtonOnClick}
             data-time-spec="Minute"
           />
         </List.Item>
       </List>
      </div>
     </div>
     <div style ={{float:'left',marginLeft:'4%',marginTop:'4%'}}>
        <List horizontal>
            <List.Item>
               <Image
                  src="/images/Assets/Icons/Buttons/am-button.png"
                  size="tiny"
                  onClick={this.timeButtonOnClick}
                  data-time-spec="Meridiem"
                  data-time-value="am"
                />
            </List.Item>
            <List.Item>
               <Image
                  src="/images/Assets/Icons/Buttons/pm-button.png"
                  size="tiny"
                  onClick={this.timeButtonOnClick}
                  data-time-spec="Meridiem"
                  data-time-value="pm"
                />
            </List.Item>
        </List>
     </div>
    </div>
    );
  }
}
