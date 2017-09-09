import React, {Component} from "react";
import muiThemeable from 'material-ui/styles/muiThemeable';
import {Image, Rating, Grid} from "semantic-ui-react";
import 'antd/dist/antd.css';
import { Radio, Progress, Switch, Icon } from 'antd';
import Delete from 'material-ui/svg-icons/action/delete';
import {leftCloseButton} from "../../styles";
import Checkbox from 'material-ui/Checkbox';
import { gql, graphql, compose } from 'react-apollo';
const uuidv1 = require('uuid/v1');

const RadioGroup = Radio.Group;

class TeamMemberPositionDetailsComponent extends Component {
  
  state = {
    value: 1,
    value1: 1,
    crossValue: 1,
    primaryWorkplaceWarning: false
  }
  onRadioChange = (e) => {
    console.log('radio checked', e.target.value);
    this.setState({
      value: e.target.value,
    });
  }
  onRadioChange1 = (e) => {
    console.log('radio checked', e.target.value);
    this.setState({
      value1: e.target.value,
    });
  }
  onCrossRadioChange = (e) => {
    console.log('radio checked', e.target.value);
    this.setState({
      crossValue: e.target.value,
    });
  }

  removePosition = (p, v) =>{
    this.props.update({
      variables: {
        id: v, 
        jobInfo: { primaryJob: false, isPositionActive: false  }
      },
      updateQueries: {
          releventPositionsQuery: (previousQueryResult, { mutationResult }) => { 
                      previousQueryResult.allPositions.nodes.map((value,i) =>{
                          if (value.id == p.id) {      
                              value.jobsByPositionId.nodes = [] 
                              return value.jobsByPositionId.nodes
                          } else{
                              return value
                          }
                       })
                      return {
                        allPositions: previousQueryResult.allPositions
                      };
                    },
         },
    }).then(({ data }) => {
          console.log(data)
    })
    
  }

  addPosition  = (v) =>{
    if (!this.props.userDetails.employeesByUserId.edges[0].node.primaryWorkplace){
      this.setState({ primaryWorkplaceWarning: true })
    } else { 
      this.setState({ primaryWorkplaceWarning: false })
      console.log(this)

    this.props.create({
        variables: { data:
            { job:
              { id: uuidv1(), 
                positionId: v,
                userId: this.props.userDetails.id,
                workplaceId: this.props.userDetails.employeesByUserId.edges[0].node.primaryWorkplace,
                primaryJob: false,
                isPositionActive: true, 
                numTraineeHoursCompleted: 0
              }
            } 
          },
          updateQueries: {
            releventPositionsQuery: (previousQueryResult, { mutationResult }) => {
                      const newPrevious = previousQueryResult.allPositions
                      previousQueryResult.allPositions.nodes.map((value,i) =>{
                          if (value.id == v) {
                              return value.jobsByPositionId.nodes.push(mutationResult.data.createJob.job)
                          } else{
                              return value
                          }
                       })
                      return {
                        allPositions: previousQueryResult.allPositions
                      };
                    },
                },
        })
        .then(({ data }) => {
          console.log(data)
        })
    
      }
  }


  getTrainingPositions = (nodes) => nodes.filter((node) => node.isTrainable);


  onChange(checked) {
    console.log(`switch to ${checked}`);
  }


  render() {
    const styles = {
      positionCheckbox: {
        textTransform: 'uppercase',
        color: '#4a4a4a',
        display: 'inline-block',
        width: '70%',
        verticalAlign: 'middle'
      }

    };

    if (this.props.releventPositionsQuery.loading) {
      return (<div>Loading</div>)
    }

    let releventPositionsQuery = [];
    let releventfilteredPositions= [];
    let releventPositionsQueryResults = [...this.props.releventPositionsQuery.allPositions.nodes];
    releventPositionsQueryResults.filter((w) => {
        if (w.jobsByPositionId.nodes.length > 0) {
             releventPositionsQuery.push(w)
          } else {
            releventfilteredPositions.push(w)
          }
      }
    );

    const userDetails = this.props.userDetails;
    const positionDetails = this.props.userDetails.jobsByUserId.edges;
    const trainingPositions = this.getTrainingPositions(positionDetails);
    console.log(this)
    return (

      <div>
        <div className="text-center profile-drawer-tab">
          <Image src="/images/Sidebar/badge.png" size="mini" />
          <h2 className="text-uppercase">{userDetails.firstName}'s Positions</h2>
        </div>
        <div className="grid-positions">
          <Grid columns={3}>
            <Grid.Row>
              <Grid.Column width={2}>
              </Grid.Column>
              <Grid.Column width={8}>
                <div>
                </div>
              </Grid.Column>
              <Grid.Column width={2} style={{textTransform: 'uppercase'}}>
                Team Trainer
              </Grid.Column>
              <Grid.Column width={2}>
                Primary Position
              </Grid.Column>
              <Grid.Column width={2}>
                Revoke Position
              </Grid.Column>
            </Grid.Row>
            {releventPositionsQuery.map((v, index) => (
              <Grid.Row>
                <Grid.Column width={2}>
                  <i className="icon-circle-td"><Image src="/images/Sidebar/positions.png" size="mini"/></i>
                </Grid.Column>
                <Grid.Column width={8}>
                  <div className="wrapper-element">
                    <p className="cook-name">{v.positionName}</p>
                    {/*<Rating icon='star' defaultRating={v.node.rating} maxRating={5}/>*/}
                    <span className="text-uppercase green">Primary Position</span>
                  </div>
                </Grid.Column>
                <Grid.Column width={2}>
                  <div className="wrapper-element">
                  <Switch defaultChecked={false} onChange={this.onChange}
                          className="switchStyle" circleStyles={{border: '1px solid #000', background: '#f00'}}
                          checkedChildren="YES" unCheckedChildren="NO"/>
                  </div>
                </Grid.Column>
                <Grid.Column width={2}>
                  <div className="text-center wrapper-element">
                    <RadioGroup onChange={this.onRadioChange1} value={this.state.value1} className="radioStyle">
                      <Radio value={1}></Radio>
                    </RadioGroup>
                  </div>
                </Grid.Column>
                <Grid.Column width={2}>
                  <div className="text-center wrapper-element">
                  <Icon type="down-circle" onClick={() => this.removePosition(v, v.jobsByPositionId.nodes[0].id)} style={{fontSize: '20px'}} />
                  </div>
                </Grid.Column>
              </Grid.Row>
            ))
            }
          </Grid>
        </div>
        <div className="text-center profile-drawer-tab">
          <Image src="/images/Sidebar/cross.png" size="mini"/>
          <h2 className="text-uppercase">Cross-Training Progress</h2>
        </div>
        <div className="grid-positions">
         {this.state.primaryWorkplaceWarning? <p style={{ fontSize: "18px", color: "red" }}> BEFORE YOU CAN GRANT A POSITION, MUST FIRST SET TEAM MEMBER'S PRIMARY LOCATION </p> : ""}
          <Grid columns={3}>

            <Grid.Row>
              <Grid.Column width={2}>
                
              </Grid.Column>
              <Grid.Column width={10}>

              </Grid.Column>
              <Grid.Column width={2}>
                Training Approve
              </Grid.Column>
              <Grid.Column width={2}>
                Grant Position
              </Grid.Column>
            </Grid.Row>

            {releventfilteredPositions.map((v, index) => (
                <Grid.Row>
                  <Grid.Column width={2}>
                  </Grid.Column>
                  <Grid.Column width={10}>
                    <div>
                      <p className="cook-name">{v.positionName}</p>

                      <span className="text-uppercase green"> Approved For Job Shadowing</span>
                    </div>
                  </Grid.Column>
                  <Grid.Column width={2}>

                  </Grid.Column>
                  <Grid.Column width={2}>
                    <i onClick={() => this.addPosition(v.id)} 
                    className="fa fa-check fa-3x" style={{color: 'gray'}}/>
                  </Grid.Column>
                </Grid.Row>
            ))}
          </Grid>
        </div>
      </div>

    )
  }
}

const releventPositionsQuery = gql`
  query releventPositionsQuery($corporationId: Uuid, $brandId: Uuid, $userId: Uuid) {
    allPositions(condition: { corporationId: $corporationId, brandId: $brandId} ){
      nodes {
        id
        positionName
        traineeHours
        jobsByPositionId (condition: { userId: $userId, isPositionActive: true }) {
          nodes {
            id
            isPositionActive
            primaryJob
            rating
            numTraineeHoursCompleted
          }
        }
      }
    }
  }`;

const updateJobActive = gql
    `mutation updatejob($id: Uuid!, $jobInfo: JobPatch!){
        updateJobById(input: { id: $id, jobPatch: $jobInfo }) {
          job{
            id
          }
        }
  }`

const createJob = gql
    `mutation createjob($data: CreateJobInput!){
        createJob(input:$data) {
          job {
            id
            isPositionActive
            primaryJob
            rating
            numTraineeHoursCompleted
          }
        }
  }`


const TeamMemberPositionDetails= compose( graphql(updateJobActive, {name: "update"}),
   graphql(createJob, {name: "create"}),
     graphql(releventPositionsQuery, {
    name: "releventPositionsQuery",
    options: (ownProps) => ({
      variables: {
        corporationId: localStorage.getItem("corporationId"),
        brandId: localStorage.getItem("brandId"),
        userId:  ownProps.userDetails.id
      }
    })
  }))(TeamMemberPositionDetailsComponent)
export default TeamMemberPositionDetails


/* <Progress type="circle" percent={25} width={40}/> */
/* <Progress type="circle" percent={25} width={40}/> */

/*                     <RadioGroup onChange={this.onCrossRadioChange} value={this.state.crossValue}>
                      <Radio value={2}></Radio>
                    </RadioGroup> */
/*                      <span className="text-uppercase red">4 of 20 hours completed</span> */

