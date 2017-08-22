import React, { Component } from 'react';
import {Dialog,Paper,IconButton} from 'material-ui';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
import Switch from 'react-flexible-switch';
import CircleButton from '../CircleButton';
import {Image,Button} from 'semantic-ui-react';
import './add-holiday-modal.css';
const style = {
  titleStyle:{
    paddingLeft: '0',
    paddingRight: '0',
    borderBottom:'1px solid #F5F5F5'
  },
  actionsContainerStyle:{
    textAlign:'center',
    padding:'0',
  },
  contentStyle:{
    width:600,
    borderRadius:6
  },
  paperStyleChecked:{
    backgroundColor:'#0022A1',
    height: 65,
    width: 65,
    margin: 10,
    textAlign: 'center',
    display: 'inline-block',
    color:'#ffffff'
  },
  paperStyleUnChecked:{
    height: 65,
    width: 65,
    margin: 10,
    textAlign: 'center',
    display: 'inline-block'
  },
  paperStyle:{
    height: 65,
    width: 65,
    margin: 10,
    textAlign: 'center',
    display: 'inline-block'
  }

};
export default class AddHolidayModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen:props.isOpen,
      holidayName: props.holidayData && props.holidayData.holidayName || "",
      holidayPayPremium:props.holidayData && props.holidayData.holidayPayPremium || "one",
      pyramidPayPremium:props.holidayData && props.holidayData.pyramidPayPremium || false,
      holidayId:props.holidayData && props.holidayData.id || ""
    }
  }
  handleChange = (e) => {
    this.setState({holidayName:e.target.value});
  };
  onChangeHolidayPayPremium = (value) => {
    this.setState({holidayPayPremium:value})
  };
  onChange = (value) => {
    this.setState({pyramidPayPremium:value})
  };
  handleClose = () => {
    let that = this;
    that.setState({
      holidayName:"",
      holidayPayPremium:"one",
      pyramidPayPremium:false
    });
    that.props.handleClose();
  };
  handleSubmit = () => {
    let holidayDetails = {
      holidayName:this.state.holidayName,
      holidayPayPremium:this.state.holidayPayPremium,
      pyramidPayPremium:this.state.pyramidPayPremium,
      holidayId:this.state.holidayId
    };
    this.setState({
      holidayName:"",
      holidayPayPremium:"one",
      pyramidPayPremium:false
    });
    this.props.addHoliday(holidayDetails);
  };
  // componentDidReceiveProps(nextProps) {
  //   if (this.state.isOpen !== nextProps.isOpen) this.setState({ isOpen: nextProps.isOpen });
  // };
  render() {
    const actions = [
      <CircleButton titleStyle={{fontSize:22,fontWeight:500}} type="white" wrapperClassName="popup-btn-mrb" title="Cancel" handleClick={this.handleClose} image={false}/>,
      <CircleButton titleStyle={{fontSize:22,fontWeight:500}} type="blue" wrapperClassName="popup-btn-mrb" title="Add Holiday" handleClick={this.handleSubmit} image={false}/>
    ];
    const titleMessage=(<div>
      <div className="confirm-popup-copy">
        <IconButton onClick={this.props.handleClose} style={{padding:0}}>
          <Image src="/images/Assets/Icons/Icons/copying.png" size="small"/>
        </IconButton>
      </div>
      <h5 className="confirm-popup">ADD HOLIDAY</h5>
      <div className="confirm-popup-close">
        <IconButton style={{borderRadius:'50%',boxShadow:'0px 2px 9px -2px #000'}} onClick={this.handleClose}>
          <Image src="/images/Icons_Red_Cross.png" size="mini"/>
        </IconButton>
      </div>
    </div>);
    return (
      <div>
        <Dialog
          titleStyle={style.titleStyle}
          contentStyle={style.contentStyle}
          actionsContainerStyle={style.actionsContainerStyle}
          title={titleMessage}
          actions={actions}
          modal={false}
          open={this.state.isOpen}>
          <div className="confirm-popup-body">
            <div className="add-template-popup">
              <label>HOLIDAY NAME</label>
              <input type="text" onChange={(e)=>this.handleChange(e)} name="templateName" value={this.state.holidayName}/>
            </div>
            <div>
              <label>INDICATE HOLIDAY PAY PREMIUM</label>
              <div className="holiday-pay-premium">
                <Button.Group toggle={true} secondary={true}>
                  <Paper style={style.paperStyle} zDepth={3} circle={true}><Button className="btn-holiday" onClick={() => this.onChangeHolidayPayPremium("one")} active={this.state.holidayPayPremium=="one"}><p><span> 1X </span><small> NONE </small> </p></Button></Paper>
                  <Paper style={style.paperStyle} zDepth={3} circle={true}><Button className="btn-holiday" onClick={() => this.onChangeHolidayPayPremium("oneHalf")} active={this.state.holidayPayPremium=="oneHalf"}><p><span> 1.5X </span></p></Button></Paper>
                  <Paper style={style.paperStyle} zDepth={3} circle={true}><Button className="btn-holiday" onClick={() => this.onChangeHolidayPayPremium("two")} active={this.state.holidayPayPremium=="two"}><p><span> 2.0X </span></p></Button></Paper>
                </Button.Group>
              </div>
            </div>
            <div>
              <label>PYRAMID PAY PREMIUMS?</label>
              <Switch value={this.state.pyramidPayPremium} labels={{on: 'YES', off: 'NO'}}
                      circleStyles={{onColor: 'green', offColor: 'red', diameter: 25 }} switchStyles={{ width: 60}} onChange={this.onChange}/>
            </div>
          </div>
        </Dialog>
      </div>
    );
  }
}

