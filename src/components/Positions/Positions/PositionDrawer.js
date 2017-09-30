import React, { Component } from 'react'
import Drawer from 'material-ui/Drawer';
import IconButton from 'material-ui/IconButton';
import { gql, graphql ,compose } from 'react-apollo';
import { Image ,Grid, Input, Segment,Form,Icon,TextArea,Dropdown} from 'semantic-ui-react';
import uuidv1 from 'uuid/v1';
import RaisedButton from 'material-ui/RaisedButton';
import cloneDeep from 'lodash/cloneDeep';
import Dropzone from 'react-dropzone';
import ToggleButton from './ToggleButton';
import SuperAgent from 'superagent';
import "./drawer.css"

import { closeButton, colors } from '../../styles';
import CircleButton from '../../helpers/CircleButton/index';

const initialState = {
  position: {
      id:"",
      positionName:"",
      positionDescription:"",
      positionIconUrl:"",
      minimumAge:0,
      minimumLiftWeight:"",
      traineeHours: 0,
      partTimeWage: 0,
      trainingUrl:"",
      workplaces:"",
      teamMembers:[],
      exchangeLevel:"CORPORATION_BRAND_WIDE",
      jobsByPositionId:{
        nodes:[]
      },
        opportunitiesByPositionId: {
        nodes:[
          {
            id:"",
            opportunityWage:0.0,
            isPublic: true
          }
        ]
        }
    },
  blob:"",
  weightOptions: [],
  ageOptions :[]
};

const style={
  input:{
    border:"solid 2px gray",width:"100%",	fontSize: '18px',	borderRadius:"6px", marginBottom:"20px"
  }
}

const options = [];

for(const i=1;i<=10;i++){
 const option={
   key: i*5 + " Kg",
   text: i*5 + " Kg",
   value: i*5 + " Kg"
 };
 initialState.weightOptions.push(option);
}


for(const i=14;i<=21;i++){
 const option={
   key: i ,
   text: i ,
   value:  i
 };
 initialState.ageOptions.push(option);
}

class DrawerHelper extends Component {
  static propTypes = {
  }
  constructor(props) {
    super(props);
    var position = cloneDeep(props.position || initialState.position);
    this.state = {
      position: position,
      ageOptions : cloneDeep(initialState.ageOptions),
      weightOptions : cloneDeep(initialState.weightOptions),
      teamMembers:[],
      permission: !(localStorage.getItem("workplaceId") != "" &&
                    props.mode == "edit" &&
                    props.position.exchangeLevel != "WORKPLACE_SPECIFIC")
    };
  }

  componentWillReceiveProps(nextProps) {
    var position = cloneDeep(nextProps.position || initialState.position);
    let permission = !(localStorage.getItem("workplaceId") != "" &&
                     nextProps.mode == "edit" &&
                     nextProps.position.exchangeLevel != "WORKPLACE_SPECIFIC");
    for (var key in position) {
      if (position[key] == null){
        position[key] = initialState.position[key];
      }
    }
    this.setState({ position, permission });
  }

  handleImageUpload = (files) => {
    console.log(files);
    // prod endpoint: https://20170808t142850-dot-forward-chess-157313.appspot.com/api/uploadImg/
    // dev/test endpoint: http://localhost:8080/api/uploadImage
    SuperAgent.post('http://localhost:8080/api/uploadImage')
    .field('keyword', 'position')
    .field('id', this.state.position.id)
    .attach("theseNamesMustMatch", files[0])
    .end((err, res) => {
      if (err) console.log(err);
      else {
        const position = Object.assign(this.state.position, { positionIconUrl : res.text });
        this.setState({position: position});
        alert('File uploaded!');
        this.setState({ blob: files[0] });
      }
    })
  };

  handleNewImageUpload = (files) => {
    files[0].preview = window.URL.createObjectURL(files[0]);
    this.setState({ blob: files[0] });
    this.handleImageUpload(files);
  };

  handleSubmitEvent = (event) => {
    // Resetting the field values.
    //console.log(this.state.position);
    this.props.handleSubmit(this.state.position);
    this.setState({ ...initialState });
  };

  handleCloseDrawer = () => {
    this.setState({ blob: undefined });
    this.props.closeDrawer();
  };

  handleChange = (event) => {
    const { name, value } = event.target;
    if (this.state.permission) {
      const position = Object.assign(this.state.position, { [name]: value });
      this.setState({ position });
    }
  };
  handleDropdownChange = (event,data) => {
    const { name, value } = data;
    if (this.state.permission) {
      const position = Object.assign(this.state.position, { [name]: value });
      this.setState({ position });
    }
  };
  // function to help identify which opportunity to edit
  workplaceMatch =(opportunity)=> {
    const workplaceId = localStorage.getItem('workplaceId');
    return opportunity.workplaceId == workplaceId;
  }
  togglePublic=(dataValue)=>{
    const position = this.state.position;
    var relevant_index = position.opportunitiesByPositionId.nodes.findIndex(this.workplaceMatch);
    if (relevant_index >= 0) {
      position.opportunitiesByPositionId.nodes[relevant_index].isPublic = dataValue.value;
    }
    this.setState({ position });
    //console.log(dataValue,position);
  }
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
    //console.log(position);
    const DrawerPosition = this.state.position;
    // console.log(this.state.teamMembers);
    // console.log(DrawerPosition);
    const formValid=DrawerPosition.positionName != "" &&
                    DrawerPosition.positionDescription != "" &&
                    DrawerPosition.minimiumAge != "" &&
                    DrawerPosition.partTimeWage !== "" && DrawerPosition.partTimeWage >= 0 &&
                    DrawerPosition.traineeHours !== "" && DrawerPosition.traineeHours >= 0 &&
                    !(this.props.mode == "create" && localStorage.getItem("workplaceId") != "");
    var relevant_opportunity = DrawerPosition.opportunitiesByPositionId.nodes.find(this.workplaceMatch);
    //console.log(relevant_opportunity);
    return (
      <Drawer
        docked={docked}
        width={width}
        open={open}
        openSecondary={openSecondary}
        onRequestChange={this.handleCloseDrawer}
        containerStyle={{overflowX:"hidden"}}>

        <div className="drawer-section" >
          <div className="drawer-heading">
            <IconButton
              style={closeButton}
              onClick={this.handleCloseDrawer}>
              <Image
                src='/images/Icons_Red_Cross.png' size="mini" />
            </IconButton>
            <h2 className="text-center text-uppercase">{messages.title}</h2>
          </div>
        </div>
        {/* image uploading - copied code from settings, investigate styling (in development)
        {!DrawerPosition.positionIconUrl && !this.state.blob && this.state.position.id &&
        <div className="upload-wrapper col-sm-8 col-sm-offset-2 col-md-8 col-md-offset-2 text-center">
          <Dropzone
            multiple={false}
            accept="image/*"
            onDrop={this.handleImageUpload}
            style={{}}>
            <Image src='/images/cloudshare.png' size="small" className="upload-img" />
            <RaisedButton
              containerElement='label'
              className="upload-btn"
              label="Upload Position Icon"
              backgroundColor="#0022A1"
              labelColor="#fff"
            />
            <p className="text-uppercase upload-desc">
              Or Drag and Drop File
            </p>
          </Dropzone>
        </div>}
        {DrawerPosition.positionIconUrl && !this.state.blob &&
        <Image className="uploaded-image" src={DrawerPosition.positionIconUrl + "?" + new Date().getTime()}
         alt={position.positionName} size="large" />
        }
        {this.state.blob &&
        <Image className="uploaded-image" src={this.state.blob.preview} size="large" />
        }
        {(DrawerPosition.positionIconUrl || this.state.blob) && <RaisedButton
          backgroundColor={colors.primaryBlue}
          labelColor="#fafafa"
          className='upload-btn'
          containerElement='label'
          label='Change image'>
          <input type='file' onChange={(e) => this.handleNewImageUpload(e.target.files)} />
        </RaisedButton>}
        */}
        {/* detail fields*/}
        <div className="position-form">
          <div>
            <p className="position-label">POSITION NAME</p>
            <Input type="text"
              name="positionName"
              onChange={this.handleChange}
              value={DrawerPosition.positionName}
              fluid style={style.input}   />
          </div>
          <div>
            <p className="position-label">DESCRIPTION</p>
            <TextArea
              rows="3"
              name="positionDescription"
              value={DrawerPosition.positionDescription}
              onChange={this.handleChange}
              style={style.input} />
          </div>
          <div className="position-row">
            <p className="position-label">MINIMUM REQUIRED HOURS OF JOB SHADOWING TRAINING</p>
            <Input
              type="number"
              name="traineeHours"
              value={DrawerPosition.traineeHours}
              onChange={this.handleChange}
              label={{ basic: true, content: 'HOURS' }}
              labelPosition='right'
              fluid style={style.input}  />
          </div>
          <div>
            <Grid columns={2}>
              <Grid.Column>
                <div>
                  <p className="position-label">MINIMUM WEIGHT ABILITY</p>
                  <Dropdown
                  placeholder='SELECT WEIGHT'
                  name="minimumLiftWeight"
                  value={DrawerPosition.minimumLiftWeight}
                  onChange={this.handleDropdownChange}
                  fluid style={style.input} selection
                  options={this.state.weightOptions} />
                </div>
              </Grid.Column>
              <Grid.Column>
                <div>
                  <p className="position-label">MINIMUM AGE</p>
                  <Dropdown
                    placeholder='SELECT MINIMUM AGE'
                    name="minimumAge"
                    value={DrawerPosition.minimumAge}
                    onChange={this.handleDropdownChange}
                    fluid style={style.input} selection
                    options={this.state.ageOptions} />
                </div>
              </Grid.Column>
            </Grid>
          </div>
          <div className="position-row">
            <p className="position-label">PART-TIME WAGE</p>
            <Input
              type="number"
              fluid style={style.input}
              value={DrawerPosition.partTimeWage}
              name="partTimeWage"
              onChange={this.handleChange}
              label={{ basic: true, content: '$ PER HOUR' }}
              labelPosition='right'/>
          </div>
          {(this.props.mode == "create" && localStorage.getItem("workplaceId") != "") &&
            <div className="position-row" style = {{color:'red', fontWeight:'bold', fontSize: 18}}>
              Workplace-Specific Positions Coming Soon,
              (currently can only create corporation-brand wide positions
              by deselecting workplace on sidebar)
            </div>
          }
          {(this.props.mode == "create" && localStorage.getItem("workplaceId") == "") &&
            <div className="position-row"> *Creating Corporation-Brand Wide Position* </div>
          }
          {(this.props.mode == "edit" && localStorage.getItem("workplaceId") == "") &&
            <div className="position-row"> To Edit Opportunity Settings, Select Workplace on Sidebar </div>
          }
          {!this.state.permission &&
            <div className="position-row" style = {{color:'red', fontWeight:'bold', fontSize: 18}}>
              Cannot Edit Corporation-Brand Wide Position Details (above) Under Specific Workplace,
              (to edit, deselect workplace on sidebar) <br/> <br/>
            </div>
          }
          {(localStorage.getItem("workplaceId") != "" && relevant_opportunity) &&
             <div  className="position-row">
               <div className="position-label"> ACCEPT APPLICATIONS? </div>
               <ToggleButton formCallBack={ this.togglePublic }
                opportunityId={relevant_opportunity.id}
                initial={relevant_opportunity.isPublic}/>
             </div>
          }
          <div className="position-row" style={{textAlign:"center",marginTop:"20px"}} >
              <CircleButton
              disabled={!formValid}
              type="blue"
              handleClick={this.handleSubmitEvent}
              title={messages.buttonText}/>
          </div>
        </div>
      </Drawer>
    );
  };
}
export default DrawerHelper;
