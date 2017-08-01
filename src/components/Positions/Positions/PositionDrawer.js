import React, { Component } from 'react'
import Drawer from 'material-ui/Drawer';
import IconButton from 'material-ui/IconButton';
import { Image ,Grid, Input, Segment,Form,Icon,TextArea,Dropdown} from 'semantic-ui-react';
import RaisedButton from 'material-ui/RaisedButton';
import cloneDeep from 'lodash/cloneDeep';
import Dropzone from 'react-dropzone';
import ToggleButton from './ToggleButton';
import "./drawer.css"



import { closeButton, colors } from '../../styles';
import CircleButton from '../../helpers/CircleButton/index';

const initialState = {
  position: {
      id:"",
      positionName:"",
      positionDescription:"",
      positionIconUrl:"",
      minimumAge:null,
      minimumLiftWeight:"",
      traineeHours:null,
      trainingUrl:"",
      trainingTracks:null,
      worlplaces:null,
      teamMembers:null,
      isAcceptApplicationForPosition: null,
    },
  blob: null
};

const style={
  input:{
    border:"solid 2px gray",width:"100%",	fontSize: '18px',	borderRadius:"6px", marginBottom:"20px"
  }
}

const options = [
  { key: 'a', text: 'Member A', value: 'Member A' },
  { key: 'b', text: 'Member B', value: 'Member B' },
  { key: 'c',text: 'Member C', value: 'Member C' },
  { key: 'd',text: 'Member D', value: 'Member D' },

];
const weightOptions = [];
for(let i=1;i<=10;i++){
 const option={
   key: i*5 + " Kg",
   text: i*5 + " Kg",
   value: i*5 + " Kg"
 };
 weightOptions.push(option);
}

const ageOptions=[];
for(let i=14;i<=21;i++){
 const option={
   key: i ,
   text: i ,
   value:  i 
 };
 ageOptions.push(option);
}

class DrawerHelper extends Component {
  constructor(props) {
    super(props);
    this.state = {
      position: cloneDeep(props.position || initialState.position),
    };
  }

  componentWillReceiveProps(nextProps) {
    const position = cloneDeep(nextProps.position || initialState.position);
    this.setState({ position });
  }

  handleSubmitEvent = () => {
    // Resetting the field values.
    this.props.handleSubmit(this.state.position);
    this.setState({ ...initialState });
  };



  handleCloseDrawer = () => {
    this.setState({ blob: undefined });
    this.props.closeDrawer();
  };

  handleChange = (event) => {
    const { name, value } = event.target;
    const position = Object.assign(this.state.position, { [name]: value });
    this.setState({ position });
  };
  updateFormState=()=>{}

  render() {
    const {
      position = {},
      width = 600,
      open = true,
      openSecondary = true,
      docked = false
    } = this.props;
    const positionId = position && position.id;
    const messages = {
      title: (positionId && 'Update Position') || 'Add Position',
      buttonText: (positionId && 'Update Position') || 'Add Position'
    }; 
    
    const DrawerPosition = this.state.position;
    console.log(DrawerPosition);
    return (
      <Drawer docked={docked} width={width} openSecondary={openSecondary} onRequestChange={this.handleCloseDrawer}
              open={open} containerStyle={{overflowX:"hidden"}}>
        <div className="drawer-section" >
          <div className="drawer-heading">
            <IconButton style={closeButton} onClick={this.handleCloseDrawer}>
              <Image src='/images/Icons_Red_Cross.png' size="mini" />
            </IconButton>
            <h2 className="text-center text-uppercase">{messages.title}</h2>
          </div>
        </div>
      
        <div className="position-form">
        <div>
          <p className="position-label">POSITION NAME</p>
          <Input type="text"  name="positionName" value={position.positionName}  onChange={this.handleChange} fluid style={style.input}   />
        </div>
        <div>
          <p className="position-label">DESCRIPTION</p>
          <TextArea rows="3" name="positionDescription"  value={position.positionDescription}  onChange={this.handleChange} fluid style={style.input} />
        </div>
        <div className="position-row">
          <p className="position-label">MINIMUM REQUIRED HOURS OF JOB SHADOWING TRAINING</p>
          <Input type="number" name="traineeHours" value={position.traineeHours} onChange={this.handleChange} label={{ basic: true, content: 'HOURS' }}  labelPosition='right' fluid style={style.input}  />
        </div>
        <div>
        <Grid columns={2}>
            <Grid.Column>
              <div>
                <p className="position-label">MINIMUM WEIGHT ABILITY</p>
                <Dropdown placeholder='SELECT WEIGHT' name="minimumLiftWeight" value={position.minimumLiftWeight} onChange={this.handleChange} fluid style={style.input} selection options={weightOptions} />
              </div>
            </Grid.Column>
            <Grid.Column>
              <div>
                <p className="position-label">MINIMUM AGE</p>
                <Dropdown placeholder='SELECT MINIMUM AGE' name="minimumAge" value={position.minimumAge} onChange={this.handleChange} fluid style={style.input} selection  options={ageOptions} />
              </div>
            </Grid.Column>  
        </Grid>
        </div >
        <div>
        <p className="position-label">TEAM MEMBERS</p>
        <Dropdown placeholder='SELECT MEMBER' fluid multiple style={style.input} selection options={options} />
        </div>
        <div  className="position-row">
          <p className="position-label">ACCEPT APPLICATIONS FOR THE POSITION?</p>
         <ToggleButton  formCallBack={ this.updateFormState } />
        </div>
         <div  className="position-row" style={{}}>
          <p className="position-label">NEW APPLICANT WAGE</p>
          <Input type="number"  fluid style={style.input}  label={{ basic: true, content: '$ PER HOUR' }}  labelPosition='right' />
        </div>
        <div  className="position-row" style={{textAlign:"center",marginTop:"20px"}} >
            <CircleButton handleClick={this.handleSubmitEvent} type="blue"
            title={messages.buttonText} />
        </div>
        
        </div>
      </Drawer>
    );
  };    
}

export default DrawerHelper;
