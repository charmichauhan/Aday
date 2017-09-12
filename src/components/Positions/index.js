import React, { Component } from 'react';
import { range, random } from 'lodash';
import { Tabs, Tab } from 'material-ui/Tabs';
import { gql, graphql ,compose } from 'react-apollo';
import {Loader} from 'semantic-ui-react';
import { remove, maxBy, findIndex } from 'lodash';
import uuidv4 from 'uuid/v4';
import moment from 'moment';
import Positions from './Positions';
import { tabDesign } from '../styles';
import { all_positions, add_position, update_position, delete_position } from './positionQueries'
import './positions.css';

const styles = {
  tabDesign
};

export class PositionsSection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 'positions',
      refetching: false
    };
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

  deletePosition = (id) => {
    const positions = this.props.data.fetchRelevantPositions.nodes;
    const positionIndex = findIndex(positions, { id:id });
    const position=positions[positionIndex];
    if(position.jobsByPositionId.nodes.length==0){
        this.props.deletePosition({
        variables:{
          "input": {
            "id":id
          },
        },
        updateQueries: {
          fetchRelevantPositions: (previousQueryResult, { mutationResult }) => {
            let newPositions = [];
            console.log(mutationResult);
            previousQueryResult.fetchRelevantPositions.nodes.map((value) => {
              if (value.id != mutationResult.data.deletePositionById.position.id) {
                newPositions.push(value);
              }
            })
            previousQueryResult.fetchRelevantPositions.nodes = newPositions;
            return {
              fetchRelevantPositions: previousQueryResult.fetchRelevantPositions
            };
          },
        },
      })
      .then(({ data }) => {
        console.log(data);
      })
      .catch((error) => {
        console.error('There was an error sending the query', error);
      });
    }else{
      alert(`${position.jobsByPositionId.nodes.length} jobs are connected to this position. Please remove these jobs from Roster Page.`)
    }
  };

  addOrUpdatePosition = (position) => {
    const positions = this.props.data.fetchRelevantPositions.nodes;
    const positionId=uuidv4();
    const opportunityId=uuidv4();
    const opportunity=position.opportunitiesByPositionId.nodes[0];
    const newData={
      "id": positionId,
      "positionName": position.positionName,
      "positionDescription": position.positionDescription,
      "minimumLiftWeight": position.minimumLiftWeight,
      "traineeHours": position.traineeHours,
      "positionIconUrl": null,
      "minimumAge": position.minimumAge,
      "partTimeWage": position.partTimeWage,
      "exchangeLevel": "CORPORATION_BRAND_WIDE",
      "trainingUrl": null,
      "brandId": localStorage.getItem('brandId'),
      "workplaceId": null,
      "corporationId": localStorage.getItem('corporationId')
    };
    function workplaceMatch(opportunity){
      const workplaceId = localStorage.getItem('workplaceId');
      if (workplaceId == ""){
        return true
      }
      return opportunity.workplaceId == workplaceId;
    }
    if (!position.id) {
      // create a new position & opportunity
        const variables={
        "input": {
          "position": newData
        },
        "data": {
          "corporationid": localStorage.getItem('corporationId'),
          "positionid": positionId,
          "brandid": localStorage.getItem('brandId'),
          "opportunitywage": position.opportunitiesByPositionId.nodes[0].opportunityWage,
        }
      };
      this.props.createPosition({
        variables: variables,
        updateQueries: {
          fetchRelevantPositions: (previousQueryResult, { mutationResult }) => {
            console.log(mutationResult);
            let new_position = mutationResult.data.createPosition.position;
            new_position.positionDescription = "placeholder";
            new_position.opportunitiesByPositionId.nodes.push({
              workplaceId: localStorage.getItem("workplaceId"),
              id: null,
              isPublic: null,
              __typename: 'Opportunity'
            });

            previousQueryResult.fetchRelevantPositions.nodes.push(new_position);
            return {
              fetchRelevantPositions: previousQueryResult.fetchRelevantPositions
            };
          }
        },
        refetchQueries: [{query: all_positions,
                          variables: {
                            workplaceId: localStorage.getItem('workplaceId') == "" ?
                                         null : localStorage.getItem('workplaceId'),
                            brandId: localStorage.getItem('brandId'),
                            corporationId: localStorage.getItem('corporationId'),
                          }}]
      })
      .then(({ data }) => {
        console.log(data);
        const newPosition=newData;
        newPosition.opportunitiesByPositionId=position.opportunitiesByPositionId;
        newPosition.opportunitiesByPositionId.nodes[0].id=opportunityId;
        // set temp data
        newData.trainingTracks=0;
        newData.jobsByPositionId={
          nodes:[]
        };
        /*
        // add team members - this feature is on hold
        position.teamMembers.forEach(function(userId) {
          this.createJob(userId,positionId);
        }, this);
        */
      })
      .catch((error) => {
        console.error('There was an error sending the query', error);
      });
    }
    else {
    // update a current position and opportunity
      delete newData.id;

      this.props.updatePosition({
        variables: {
          "data": {
            "id": position.id,
            "positionPatch": newData
          },
          "input": {
            "id": position.opportunitiesByPositionId.nodes.find(workplaceMatch).id,
            "opportunityPatch": {
              "isPublic": position.opportunitiesByPositionId.nodes[0].isPublic,
            }
          }
        }
      })
      .then(({ data }) => {
        console.log(data);
        const positionIndex = findIndex(positions, { id: position.id });
      })
      .catch((error) => {
        console.error('There was an error sending the query', error);
      });
    }
  };
  /*
  createJob=(userId,positionId)=>{
    this.props.createJob({
      variables: {
        "input": {
          "clientMutationId": "dd",
          "job": {
            "userId": userId,
            "workplaceId": localStorage.getItem('workplaceId'),
            "positionId": positionId,
            "isPositionActive": true,
            "activatedDate":moment().format(),
            "deactivatedDate": moment().add(10, 'day').format(),
            "isVerified": false,
            "isPreTrainingComplete": false,
            "isTrainable": true,
            "id": uuidv4(),
            "primaryJob": false
          }
        }
      }
    })
    .then(({ data }) => {
      console.log(data);
    })
    .catch((error) => {
      console.error('There was an error sending the query', error);
    });
  }
  */
  render() {
    console.log(this.props.data.networkStatus);
    if (!this.props.data.fetchRelevantPositions) {
      return  (
      <div style={{marginTop:"30%",marginLeft:"0"}}>
        <Loader active inline='centered' />
      </div> )
    }
    const positions = this.props.data.fetchRelevantPositions.nodes;
    console.log(positions);
    console.log(this.props);
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
            <Positions
              addOrUpdatePosition={this.addOrUpdatePosition}
              onDeletePosition={this.deletePosition}
              positions={positions}/>
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

const AddPosition = compose(
  graphql(all_positions, {
    options: (ownProps) => ({
      variables: {
        workplaceId: localStorage.getItem('workplaceId') == "" ? null : localStorage.getItem('workplaceId'),
        brandId: localStorage.getItem('brandId'),
        corporationId: localStorage.getItem('corporationId'),
      }
    })
  }),
  graphql(add_position,{
   name:"createPosition"
  }),
  graphql(update_position,{
   name:"updatePosition"
  }),
  graphql(delete_position,{
   name:"deletePosition"
  })
)(PositionsSection);

export default AddPosition
