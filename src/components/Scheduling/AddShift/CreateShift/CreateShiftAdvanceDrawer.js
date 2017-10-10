import React, { Component } from 'react'
import Drawer from 'material-ui/Drawer';
import { find, pick } from 'lodash';
import { Header, Icon, Table, Image, List, Rating, Input, Label } from 'semantic-ui-react';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
import FlatButton from 'material-ui/FlatButton';
import { Switch } from 'antd';
import CircleButton from '../../../helpers/CircleButton';
import Loading from '../../../helpers/Loading';
import StartToEndTimePicker from './StartToEndTimePicker';

const styles = {
  block: {
    maxWidth: 250,
  },
  radioButton: {
    marginBottom: 16,
  },
  label: {
    fontFamily: 'Lato-Regular',
    fontSize: 14
  },
};

class ShiftHistoryDrawerComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      shift: { ...props.shift, advance: { allowShadowing: true } }
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.open !== this.props.open) {
      this.setState((state) => ({
        shift: {
          ...state.shift,
          advance: state.shift.advance
        }
      }));
    }
  }

  handleBack = () => {
    this.props.handleBack(this.state.shift);
  };

  showDetails = (historyDetails, i) => {
    historyDetails[i].showDetails = !historyDetails[i].showDetails;
    this.setState({ historyDetails });
  };

  onAllowShadowingChange = (allowShadowing) => {
    this.setState((state) => ({
      shift: {
        ...state.shift,
        advance: state.shift.advance && { ...state.shift.advance, allowShadowing }
      }
    }));
  };

  /*the below is a stub for hours to specify break*/
  updateFormState = (dataValue) => {
    const shift = Object.assign(this.state.shift, dataValue);
    this.setState({ shift });
  };


  render() {
    const {
      width = 600,
      open,
      openSecondary = true,
      docked = false
    } = this.props;

    const { shift: { advance } } = this.state;
    return (
      <Drawer docked={docked} width={width} openSecondary={openSecondary} onRequestChange={this.handleCloseDrawer}
              open={open}>
        <div className="drawer-section brand-drawer-section">
          <div className="drawer-heading drawer-head col-md-12" style={{display:'flex'}}>

            <div style={{flex:3, alignSelf:'center', marginLeft:5}}>
              <FlatButton label="Back" onClick={this.handleBack}
                          icon={<Icon name="chevron left" className="floatLeft" /> } />
            </div>

            <div style={{flex:10, alignSelf:'center'}}>
              <span className="drawer-title" style={{color:'#0021A1'}}>Advanced Options</span>
            </div>

            <div style={{flex:3, alignSelf:'center'}}>
            </div>

          </div>
          <div className="drawer-content advance-shift-drawer-content">

            {/* Allow job shadowing */}
            <div className="col-md-12">
              <p className="text-uppercase blue-heading" style={{marginTop:10}}>
                <strong> Allow Job Shadowers </strong> for increased sales and reduced costs
              </p>
              <div className="wrapper-element">
                <Switch checked={advance.allowShadowing}
                        name="allowJobShadowing" onChange={this.onAllowShadowingChange}
                        className="switchStyle"
                        circleStyles={{border: '1px solid #000', background: '#f00'}}
                        checkedChildren="YES" unCheckedChildren="NO" />
              </div>
              <div className="performance-tagline" style={{marginTop:10}}>
                <p>After team members book all hours for the week, team members can complete trainee hours
                   with approved job trainers. By default, Aday enables this option because cross-training
                    is proven to improve sales, make customers happier and reduce costs in the long-run.
                </p>
              </div>

              {/* Prevent Low Rated Persons */}
              <p className="text-uppercase blue-heading" style={{marginTop:20}}>
                <strong>Position Rating Minimum</strong>
              </p>
              <div className="wrapper-element">
                {/*See https://react.semantic-ui.com/modules/rating for proper implementation*/}
                 <div style={{height:6}} />
                <input type='range' min={0} max={5} value={0} style={{width:90}}/>
                 <div style={{height:6}} />
                <Rating rating={0} maxRating={5} />
              </div>
              <div className="performance-tagline" style={{marginTop:10}}>
                <p>We'll prevent anyone that you've rated less than indicated star-rating from picking up this shift
                </p>
              </div>

              {/* Break Reminders */}
              <p className="text-uppercase blue-heading" style={{marginTop:20}}>
                <strong>Specify Break Period</strong>
              </p>
              <StartToEndTimePicker formCallBack={this.updateFormState} />
              <div className="performance-tagline" style={{marginTop:10}}>
                <p style={{marginTop:5}}>When enabled, Aday will send team members and working
                  managers a push notification to their mobile phones 10 minutes before break begins and 10 minutes before break ends
                </p>
              </div>

              {/* Prevent Genders from Shifts */}
              <p className="text-uppercase blue-heading" style={{marginTop:20}}>
                <strong>Restrict Gender</strong>
              </p>
              <RadioButtonGroup name="shipSpeed" defaultSelected="not_light" style={{display:'flex', flexDirection:'row', width:160}}>
                <RadioButton
                  value="na"
                  label="Not Applicable"
                  style={styles.radioButton}
                  labelStyle={styles.label}
                  defaultSelected='true'
                />
                <RadioButton
                  value="female"
                  label="Female"
                  style={styles.radioButton}
                  labelStyle={styles.label}
                />
                <RadioButton
                  value="male"
                  label="Male"
                  style={styles.radioButton}
                  labelStyle={styles.label}
                />
              </RadioButtonGroup>
              <div className="performance-tagline" style={{marginTop:0}}>
                <p style={{marginTop:5}}> Shifts may need to be restricted by gender, such as locker-room attendants. Be sure to send out EEO survey before using this option!
                </p>
              </div>

              {/* Restrict Maximum Wage */}
              <p className="text-uppercase blue-heading" style={{marginTop:20}}>
                <strong>Maximum Wage Offered</strong>
              </p>
              <Input labelPosition='right' type='text' placeholder='Maximum Wage' style={{width:650}}>
                <Label basic>$</Label>
                <input />
                <Label>per hour</Label>
              </Input>
              <div className="performance-tagline" style={{marginTop:10}}>
                <p style={{marginTop:5}}>Please use this option with caution, Aday may not be able to book the shift. Our dynamic wage algorithm already keeps additional wages to a miniumum.
                </p>
              </div>


            </div>

          </div>
        </div>
        <div className="drawer-footer">
          <div className="buttons text-center">
            <CircleButton type="white" title="GO BACK" handleClick={this.handleBack} />
          </div>
        </div>
      </Drawer>
    );
  };
}

export default ShiftHistoryDrawerComponent
