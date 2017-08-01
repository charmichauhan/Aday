import React, { Component } from 'react';
import { range, random } from 'lodash';
import { Tabs, Tab } from 'material-ui/Tabs';
import { gql, graphql } from 'react-apollo';
import Positions from './Positions';
import { tabDesign } from '../styles';
import './positions.css';

const styles = {
  tabDesign
};
const allPositions={
  nodes:[{
    positionByPositionId :{
      id:"0529b63a-bff1-4ee6-b2c4-be26760140b2",
      positionName:"Cashier",
      positionDescription:"job",
      positionIconUrl:"/images/Sidebar/positions.png",
      minimumAge:18,
      minimumLiftWeight:"20 Kg",
      traineeHours:6,
      trainingUrl:"",
      trainingTracks:2,
      worlplaces:4,
      teamMembers:6,
      isAcceptApplicationForPosition: true,
    }
  },
  {
    positionByPositionId :{
      id:"0229b63a-bff1-4ee6-b2c4-be26760140b2",
      positionName:"Bakery",
      positionDescription:"good job",
      positionIconUrl:"/images/Sidebar/positions.png",
      minimumAge:20,
      minimumLiftWeight:"20 Kg",
      traineeHours:7,
      trainingUrl:"",
      trainingTracks:2,
      worlplaces:1,
      teamMembers:2,
      isAcceptApplicationForPosition: false,
    }
  },
  {
    positionByPositionId :{
      id:"1129b63a-bff1-4ee6-b2c4-be26760140b2",
      positionName:"Sushi Chef",
      positionDescription:"good job",
      positionIconUrl:"/images/Sidebar/positions.png",
      minimumAge:19,
      minimumLiftWeight:"20 Kg",
      traineeHours:4,
      trainingUrl:"",
      trainingTracks:7,
      worlplaces:1,
      teamMembers:7,
      isAcceptApplicationForPosition: true,
    }
  },
]};

const teamMembers={
  nodes:[{
    id:"1129b63a-bff1-4ee6-b2c4-be26760140b2",
    name:"Member 2"
  },
  {
    id:"1129b63a-bff1-4ee6-b2c4-be26760140b2",
    name:"Member 2"
  },
  {
    id:"1129b63a-bff1-4ee6-b2c4-be26760140b2",
    name:"Member 2"
  },
  {
    id:"1129b63a-bff1-4ee6-b2c4-be26760140b2",
    name:"Member 2"
  }
]};
/*let positionsType = ['Cashier', 'Bakery', 'Sushi Chef', 'Pizza Chef', 'Deep Clean'];
const initState = {
  value: 'positions',
  positions: positionsType.map((position, index) => ({
    id: index + 1, // To make positive id
    type: position,
    teamMembers: range(random(0, 25)),
    workplaces: range(random(0, 5)),
    trainingHours: random(0, 40),
    trainingTracks: random(0, 10)
  }))
};*/
const initState = {
  value: 'positions',
  positions: allPositions.nodes
};
export default class PositionsSection extends Component {
  constructor(props) {
    super(props);
    this.state = initState;
  } 

  componentWillMount() {
    const { props: { match } } = this;
    const tab = match && match.params && match.params.tab;
    this.setState({ value: tab });
  } 

  handleChange = (value) => {
    this.setState({ value: value });
  };

  getButtonStyle = (value) => ({
    ...styles.tabDesign.buttonStyle,
    fontWeight: (this.state.value === value && 600) || 500
  });

  render() {
    const { positions } = this.state;
    return (
      <section className="positions">
        <Tabs
          value={this.state.value}
          onChange={this.handleChange}
          inkBarStyle={styles.tabDesign.inkBarStyle}
          tabItemContainerStyle={styles.tabDesign.tabItemContainerStyle}>
          <Tab
            buttonStyle={this.getButtonStyle('positions')}
            label="Positions"
            value="positions">
            <Positions positions={positions} />
          </Tab>
          <Tab
            buttonStyle={this.getButtonStyle('training')}
            label="Training"
            value="training">
            <h2>Training</h2>
          </Tab>
        </Tabs>
      </section>
    );
  }
}
