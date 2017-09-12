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
    /*
    data: React.PropTypes.shape({
      loading: React.PropTypes.bool,
      error: React.PropTypes.object,
      allEmployees: React.PropTypes.object,
    }).isRequired,
    */
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
    // console.log(this.state.ageOptions,this.state.weightOptions);
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
    // console.log(nextProps.data.allEmployees.nodes);
    /*
    const options=[];
    nextProps.data.allEmployees.nodes.map((employee)=>{
      console.log(employee);
      var option={
        value:employee.userByUserId.id,
        key:employee.id,
        text:`${employee.userByUserId.firstName} ${employee.userByUserId.lastName}`
      }
      options.push(option);
    })
    console.log(options);
    this.setState({teamMembers:options});
    */
  }

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
  /*
  handleTeamMembers=(e, { value })=>{
    const position = Object.assign(this.state.position, { teamMembers: value });
    this.setState({ position });
    //console.log(position.teamMembers);
  }
  */

  /* - phasing out opportunity wage
  handleWageChange=(event)=>{
    const { name, value } = event.target;
    //console.log(name,value);
    this.state.position.opportunitiesByPositionId.nodes[0][name]= parseFloat(value);
    const position=this.state.position;
    this.setState({ position });
  }
  */

  togglePublic=(dataValue)=>{
    this.state.position.opportunitiesByPositionId.nodes[0].isPublic= dataValue.value;
    const position=this.state.position;
    this.setState({ position });
    //console.log(dataValue,position);
  }

  /* - Plan to use left dropdown to determine exchange level instead so this will be deleted
  toggleExchangeLevel=(dataValue)=>{
    const cur = this.state.position.exchangeLevel;
    const position = Object.assign(this.state.position, { exchangeLevel: cur == "CORPORATION_BRAND_WIDE" ?
                                                          "WORKPLACE_SPECIFIC": "CORPORATION_BRAND_WIDE"});
    this.setState({ position });
  }
  */
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
    /*
    if(this.props.data.loading){
      return (
        <div>Loading..</div>
      )
    }
    if (this.props.data.error) {
      console.log(this.props.data.error)
      return (<div>An unexpected error occurred</div>)
    }
    */
    // console.log(this.state.teamMembers);
    console.log(DrawerPosition);
    const formValid=DrawerPosition.positionName != "" &&
                    DrawerPosition.positionDescription != "" &&
                    DrawerPosition.minimiumAge != "" &&
                    DrawerPosition.partTimeWage !== "" && DrawerPosition.partTimeWage >= 0 &&
                    DrawerPosition.traineeHours !== "" && DrawerPosition.traineeHours >= 0 &&
                    !(this.props.mode == "create" && localStorage.getItem("workplaceId") != "");
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
          {localStorage.getItem("workplaceId") != "" &&
             <div  className="position-row">
               <div className="position-label"> ACCEPT APPLICATIONS? </div>
               <ToggleButton formCallBack={ this.togglePublic } initial={true}/>
             </div>
             /*
             <div  className="position-row" style={{marginTop: 75}}>
               <p className="position-label">NEW APPLICANT WAGE</p>
               <Input
                type="number"
                fluid style={style.input}
                value={DrawerPosition.opportunitiesByPositionId.nodes.length && DrawerPosition.opportunitiesByPositionId.nodes[0].opportunityWage}
                name="opportunityWage"
                onChange={this.handleWageChange}
                label={{ basic: true, content: '$ PER HOUR' }}
                labelPosition='right' />
             </div>
             */
          }
          {/*
          <div>
          <p className="position-label">TEAM MEMBERS</p>
          <Dropdown
            placeholder='SELECT MEMBER'
            fluid style={style.input}
            multiple selection search
            name="teamMembers"
            options={this.state.teamMembers}
            onChange={this.handleTeamMembers}/>
          </div>
          */}
          {/*
          <div className="position-row">
            <div className="position-label" style={{float: 'left', width: 200}}>ACCEPT APPLICATIONS?
              <ToggleButton formCallBack={ this.togglePublic } initial={true}/>
            </div>
            <div className="position-label" style={{marginLeft: 300}}>CORPORATION/BRAND WIDE?
              <ToggleButton formCallBack={ this.toggleExchangeLevel } initial={true}/>
            </div>
          </div>
          */}
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
              Cannot Edit Corporation-Brand Wide Position Details Under Specific Workplace,
              (to edit, deselect workplace on sidebar)
            </div>
          }
          <div  className="position-row" style={{textAlign:"center",marginTop:"20px"}} >
              <CircleButton
              disabled={!formValid}
              type="blue"
              handleClick={this.handleSubmitEvent}
              title={messages.buttonText} />
          </div>
        </div>
      </Drawer>
    );
  };
}
/*
  const all_team_members=gql`
    query fetchTeamMembers($corporationId: Uuid!) {
      allEmployees(condition:{corporationId: $corporationId}){
        nodes{
          id
          userByUserId{
            id
            firstName
            lastName
          }
        }
      }
    }`

const Position_Drawer = compose(
  graphql(all_team_members,{
    options:(ownProps)=>({
      variables:{
       corporationId:"3b14782b-c220-4927-b059-f4f22d01c230"
      }
    })
  })
)(DrawerHelper);
*/
export default DrawerHelper;
