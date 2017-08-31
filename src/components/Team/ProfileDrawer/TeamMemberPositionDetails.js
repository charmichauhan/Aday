import React, {Component} from "react";
import muiThemeable from 'material-ui/styles/muiThemeable';
import {Image, Rating, Grid} from "semantic-ui-react";
import 'antd/dist/antd.css';
import { Radio, Progress, Switch, Icon } from 'antd';
import Delete from 'material-ui/svg-icons/action/delete';
import {leftCloseButton} from "../../styles";
import Checkbox from 'material-ui/Checkbox';

const RadioGroup = Radio.Group;

export default class TeamMemberPositionDetails extends Component {

  state = {
    value: 1,
    value1: 1,
    crossValue: 1,
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
          <Image src="/images/Sidebar/badge.png" size="mini"/>
          {/*<i className="">*/}
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

            {positionDetails.map((v, index) => (

              <Grid.Row>
                <Grid.Column width={2}>
                  <i className="icon-circle-td"><Image src="/images/Sidebar/positions.png" size="mini"/></i>
                </Grid.Column>
                <Grid.Column width={8}>
                  <div className="wrapper-element">
                    <p className="cook-name">{v.node.positionByPositionId.positionName}</p>
                    <Rating icon='star' defaultRating={v.node.rating} maxRating={5}/>
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
                      <Radio value={v.node.primaryJob == true ? 1 : 0}></Radio>
                    </RadioGroup>
                  </div>
                </Grid.Column>
                <Grid.Column width={2}>
                  <div className="text-center wrapper-element">
                  <Icon type="down-circle" style={{fontSize: '20px'}} />
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

            {trainingPositions.map((v, index) => (
                <Grid.Row>
                  <Grid.Column width={2}>
                    <Progress type="circle" percent={25} width={40}/>
                  </Grid.Column>
                  <Grid.Column width={10}>
                    <div>
                      <p className="cook-name">{v.node.positionByPositionId.positionName}</p>
                      <span className="text-uppercase red">4 of 20 hours completed</span>
                      <span className="text-uppercase green"> Approved For Job Shadowing</span>
                    </div>
                  </Grid.Column>
                  <Grid.Column width={2}>
                    <RadioGroup onChange={this.onCrossRadioChange} value={this.state.crossValue}>
                      <Radio value={2}></Radio>
                    </RadioGroup>
                  </Grid.Column>
                  <Grid.Column width={2}>
                    <i className="fa fa-check fa-3x" style={{color: 'gray'}}/>
                  </Grid.Column>
                </Grid.Row>
            ))}


          </Grid>
        </div>
      </div>

    )
  }
}

