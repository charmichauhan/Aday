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
var Halogen = require('halogen');

const RadioGroup = Radio.Group;

/**
 * @todo placeholder for when there are no approved positions for the employee
 * @todo include fourth tab as completed by Riya
 */
class TeamMemberPositionDetailsComponent extends Component {

  constructor(props){
    super(props);

    let releventPositionsQuery = [];
    let releventfilteredPositions= [];
    let primaryJob = ""
    let releventPositionsQueryResults = this.props.releventPositionsQuery.allPositions.nodes;
    releventPositionsQueryResults.filter((w) => {
        if (w.jobsByPositionId.nodes.length > 0) {
             releventPositionsQuery.push(w)
             if (w.jobsByPositionId.nodes[0].primaryJob == true){
                 primaryJob = w.jobsByPositionId.nodes[0].id
             }
          } else {
            releventfilteredPositions.push(w)
          }
      }
    );

    this.state = {
      releventPositionsQuery: releventPositionsQuery,
      releventfilteredPositions: releventfilteredPositions,
      primaryJob: primaryJob,
      crossValue: 1,
      primaryWorkplaceWarning: false
    }
  }

  onRadioChange = (e) => {
      const oldPrimary = this.state.primaryJob

      this.setState({
          primaryJob: e.target.value,
      });

      if (oldPrimary){
          this.props.update({
          variables: {
            id: oldPrimary,
            jobInfo: { primaryJob: false }
          },
          updateQueries: {
              releventPositionsQuery: (previousQueryResult, { mutationResult }) => {
                          previousQueryResult.allPositions.nodes.map((value,i) =>{
                              if (value.jobsByPositionId.nodes[0]){
                                if (value.jobsByPositionId.nodes[0].id == oldPrimary) {
                                    value.jobsByPositionId.nodes[0].primaryJob = false
                                    return value
                                } else{
                                    return value
                                }
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

      this.props.update({
          variables: {
            id: e.target.value,
            jobInfo: { primaryJob: true }
          },
          updateQueries: {
              releventPositionsQuery: (previousQueryResult, { mutationResult }) => {
                          previousQueryResult.allPositions.nodes.map((value,i) =>{
                            if (value.jobsByPositionId.nodes[0]){
                              if (value.jobsByPositionId.nodes[0].id == e.target.value) {
                                  value.jobsByPositionId.nodes[0].primaryJob = true
                                  return value
                              } else{
                                  return value
                              }
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

  onCrossRadioChange = (e) => {
    console.log('radio checked', e.target.value);
    this.setState({
      crossValue: e.target.value,
    });
  }

  removePosition = (position, jobID) =>{
      // REMOVING IT FROM THE STATE
      let releventPositionsQuery = [];
      let releventfilteredPositions= [];
      let positions = this.state.releventPositionsQuery.concat(this.state.releventfilteredPositions)
      positions.filter((w) => {
              if (w.jobsByPositionId.nodes.length > 0 && w.jobsByPositionId.nodes[0].id != jobID) {
                   releventPositionsQuery.push(w)
                } else {
                  if (w.jobsByPositionId.nodes[0] && w.jobsByPositionId.nodes[0].id == jobID){
                      let newPosition = {
                        id: w.id,
                        positionName: w.positionName,
                        traineeHours: w.traineeHours,
                        jobsByPositionId: { nodes: [] }
                      }
                     releventfilteredPositions.push(newPosition)
                  } else {
                    releventfilteredPositions.push(w)
                  }
                }
          })
      this.setState({ releventPositionsQuery: releventPositionsQuery })
      this.setState({ releventfilteredPositions: releventfilteredPositions })
    // REMOVING IT FROM DB AND PROPS
    this.props.update({
      variables: {
        id: jobID,
        jobInfo: { primaryJob: false, isPositionActive: false  }
      },
      updateQueries: {
          releventPositionsQuery: (previousQueryResult, { mutationResult }) => {
                      previousQueryResult.allPositions.nodes.map((value,i) =>{
                          if (value.id == position.id) {
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
    })

  }

  addPosition  = (v) =>{
    if (!this.props.userDetails.employeesByUserId.edges[0].node.primaryWorkplace){
      this.setState({ primaryWorkplaceWarning: true })
    } else {
       this.setState({ primaryWorkplaceWarning: false })
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
                let releventPositionsQuery = [];
                let releventfilteredPositions= [];
                let positions = this.state.releventPositionsQuery.concat(this.state.releventfilteredPositions)
                positions.filter((w) => {
                  if (w.jobsByPositionId.nodes.length > 0 || w.id == v) {
                       if(w.id == v){
                         let newPosition = {
                            id: w.id,
                            positionName: w.positionName,
                            traineeHours: w.traineeHours,
                            jobsByPositionId: { nodes: [data.createJob.job] }
                          }
                         releventPositionsQuery.push(newPosition)
                       } else {
                          releventPositionsQuery.push(w)
                        }
                    } else {
                      releventfilteredPositions.push(w)
                    }
              })
              this.setState({ releventPositionsQuery: releventPositionsQuery })
              this.setState({ releventfilteredPositions: releventfilteredPositions })
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


    const userDetails = this.props.userDetails;
    const positionDetails = this.props.userDetails.jobsByUserId.edges;
    const trainingPositions = this.getTrainingPositions(positionDetails);

    return (

      <div>
        <div className="text-center profile-drawer-tab">
          <Image className="section-icon" src="/images/Sidebar/badge.png"/>
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
              <Grid.Column width={2} className="tiny-header">
                <span>TEAM</span><span>TRAINER</span>
              </Grid.Column>
              <Grid.Column width={2} className="tiny-header">
                <span>PRIMARY</span><span>POSITION</span>
              </Grid.Column>
              <Grid.Column width={2} className="tiny-header">
                <span>REVOKE</span><span>POSITION</span>
              </Grid.Column>
            </Grid.Row>
            {this.state.releventPositionsQuery.map((v, index) => (
              <Grid.Row>
                <Grid.Column width={2} style={{display:'flex', flexDirection:'row'}}>
                  <div className="circle"><img src="/images/Sidebar/positions.png" style={{width:22, height:30}}/></div>
                </Grid.Column>
                <Grid.Column width={8}>
                  <div className="wrapper-element">
                    <p className="cook-name">{v.positionName}</p>
                    <div className="tinier-header"><span>YOUR RATING: <Rating icon='star' defaultRating={5} maxRating={5}/></span></div>
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
                    <RadioGroup onChange={this.onRadioChange} value={ this.state.primaryJob} className="radioStyle">
                      <Radio value={v.jobsByPositionId.nodes[0].id}></Radio>
                    </RadioGroup>
                  </div>
                </Grid.Column>
                <Grid.Column width={2}>
                  <div className="text-center wrapper-element">
                  <Icon type="down-circle" onClick={() => this.removePosition(v, v.jobsByPositionId.nodes[0].id)} style={{fontSize: '20px', cursor: "pointer"}} />
                  </div>
                </Grid.Column>
              </Grid.Row>
            ))
            }
          </Grid>
        </div>
        <div className="text-center profile-drawer-tab">
          <Image src="/images/Sidebar/cross.png" style={{width:30, height:30, padding:3}}/>
          <h2 className="text-uppercase">Cross-Training Progress</h2>
        </div>
        <div className="grid-positions">
         {this.state.primaryWorkplaceWarning? <p style={{ fontSize: "18px", color: "red" }}> BEFORE YOU CAN GRANT A POSITION, MUST FIRST SET PRIMARY LOCATION FOR THIS TEAM MEMBER</p> : ""}
          <Grid columns={3}>

            <Grid.Row>
              <Grid.Column width={2}>

              </Grid.Column>
              <Grid.Column width={8}>

              </Grid.Column>
              <Grid.Column width={2}>

              </Grid.Column>
              <Grid.Column width={2} className="tiny-header">
                <span>TRAINING</span><span>APPROVED</span>
              </Grid.Column>
              <Grid.Column width={2} className="tiny-header">
                <span>GRANT</span><span>POSITION</span>
              </Grid.Column>
              </Grid.Row>

            {this.state.releventfilteredPositions.map((v, index) => (
                <Grid.Row>
                  <Grid.Column width={2}>
                    <Progress type="circle" percent={0} /*status="exception" */  width={45}/>
                  </Grid.Column>
                  <Grid.Column width={8}>
                    <div>
                      <p className="cook-name">{v.positionName}</p>
                      <div className="tinier-header"><span>0 OF 50 HOURS COMPLETED</span></div>
                    </div>
                  </Grid.Column>
                  <Grid.Column width={2}>
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
                      <Icon type="up-circle" onClick={() => this.addPosition(v.id)} style={{fontSize: '20px', cursor: "pointer"}} />
                      </div>
                  </Grid.Column>
                </Grid.Row>
            ))}
          </Grid>
        </div>
      </div>

    )
  }
}

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

const TeamMemberPositionDetails= compose(
   graphql(updateJobActive, {name: "update"}),
   graphql(createJob, {name: "create"})
   )(TeamMemberPositionDetailsComponent)
export default TeamMemberPositionDetails


/* <Progress type="circle" percent={25} width={40}/> */
/* <Progress type="circle" percent={25} width={40}/> */

/*                     <RadioGroup onChange={this.onCrossRadioChange} value={this.state.crossValue}>
                      <Radio value={2}></Radio>
                    </RadioGroup> */
/*                      <span className="text-uppercase red">4 of 20 hours completed</span> */
