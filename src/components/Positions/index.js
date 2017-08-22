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
import './positions.css';

const styles = {
  tabDesign
};

export class PositionsSection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 'positions',
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
      "exchangeLevel": "CORPORATION_BRAND_WIDE",
      "trainingUrl": null,
      "brandId": localStorage.getItem('brandId'),
      "workplaceId": null,
      "corporationId": localStorage.getItem('corporationId')
    };

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
            "id": opportunity.id,
            "opportunityPatch": {
              "opportunityWage": position.opportunitiesByPositionId.nodes[0].opportunityWage,
              "isPublic": position.opportunitiesByPositionId.nodes[0].isPublic,
            }
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
    if (!this.props.data.fetchRelevantPositions) {
      return  (
      <div style={{marginTop:"30%",marginLeft:"0"}}>
        <Loader active inline='centered' />
      </div> )
    }
    const positions = this.props.data.fetchRelevantPositions.nodes;
    console.log(positions);

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
              positions={positions} />
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


const all_positions= gql`
  query fetchRelevantPositions($corporationId: Uuid!, $brandId: Uuid!, $workplaceId: Uuid){
    fetchRelevantPositions(corporationid: $corporationId, brandid: $brandId, workplaceid: $workplaceId){
      nodes{
        id
        positionName
        positionDescription
        positionIconUrl
        minimumAge
        minimumLiftWeight
        traineeHours
        trainingUrl
        exchangeLevel
        jobsByPositionId(condition:{isPositionActive: true}) {
          nodes{
            userId
            workplaceId
          }
        }
        opportunitiesByPositionId {
          nodes{
            id
            isPublic
            workplaceId
            opportunityWage
          }
        }
      }
    }
  }`;
const add_position=gql`
  mutation createPosition($input:CreatePositionInput!,$data: CreateCorporationBrandWideOpportunitiesInput!){
    createPosition(input:$input){
      position{
        id
      }
    }
    createCorporationBrandWideOpportunities(input: $data) {
      string
    }
  }
`
/*
const add_job=gql`
mutation createJob($input:CreateJobInput!){
  createJob(input:$input){
    job{
      id
    }
  }
}`
*/
const update_position=gql`
mutation updatePosition($input:UpdateOpportunityByIdInput!,$data:UpdatePositionByIdInput!){
  updateOpportunityById(input:$input){
    opportunity{
      id
    }
  }
  updatePositionById(input:$data){
    position{
      id
    }
  }
}`

const delete_position=gql`
mutation deletePosition($input: DeletePositionByIdInput!) {
  deletePositionById(input: $input) {
    position {
      id
    }
  }
}
`
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
