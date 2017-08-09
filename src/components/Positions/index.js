import React, { Component } from 'react';
import { range, random } from 'lodash';
import { Tabs, Tab } from 'material-ui/Tabs';
import { gql, graphql ,compose } from 'react-apollo';
import {Loader} from 'semantic-ui-react';
import { remove, maxBy, findIndex } from 'lodash';
import uuidv1 from 'uuid/v1';
import moment from 'moment';
import Positions from './Positions';
import { tabDesign } from '../styles';
import './positions.css';

const styles = {
  tabDesign
};

const brand_id="5a14782b-c220-4927-b059-f4f22d01c230";
const workplace_id="5a01782c-c220-4927-b059-f4f22d01c230";
const corporation_id="3b14782b-c220-4927-b059-f4f22d01c230";


const initState = {
  value: 'positions',
}
export class PositionsSection extends Component {
  
  constructor(props) {
    super(props);
    this.state = initState;
    this.getPositionsFromServer();  
  }

  getPositionsFromServer=()=>{
    this.props.fetchRelevantPositions({
      variables: {
        "input": {
          "brandid":brand_id,
          "workplaceid":workplace_id,
          "corporationid":corporation_id,
          "clientMutationId":"2513056"
        }
      }
    })
    .then(({ data }) => {
      console.log(data);
      data.fetchRelevantPositions.positions.map((position)=>{
        position.trainingTracks=0;//add a trainingtrack property to position and set it to zero
      });
      this.setState({positions:data.fetchRelevantPositions.positions}) ;
      console.log(this.state.positions);
    })
    .catch((error) => {
      console.error('There was an error sending the query', error);
    });
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
    const { positions } = this.state;
     const positionIndex = findIndex(positions, { id:id });
     const opportunityId=positions[positionIndex].opportunitiesByPositionId.nodes[0].id;
      this.props.deletePosition({
      variables:{
        "input": {
          "clientMutationId": "fdsgdhfj",
          "id":id 
        },
        "data":{
          "clientMutationId": "fdsgdhfjs",
          "id":opportunityId
        }
      }
    })
    .then(({ data }) => {
      console.log(data);
      remove(positions, {'id': id });
      this.setState({ positions });
    })
    .catch((error) => {
      console.error('There was an error sending the query', error);
    });
   
  };

  addOrUpdatePosition = (position) => {
    const { positions } = this.state;
    const positionId=uuidv1();
    const opportunityId=uuidv1();
    const opportunity=position.opportunitiesByPositionId.nodes[0];
    const newData={
      "id": positionId,
      "positionName": position.positionName,
      "positionDescription": position.positionDescription,
      "minimumLiftWeight": position.minimumLiftWeight,
      "traineeHours": position.traineeHours,
      "positionIconUrl": null,
      "minimumAge": position.minimumAge,
      "exchangeLevel": "BRAND_WIDE",
      "trainingUrl": null,
      "brandId":brand_id,
      "workplaceId":workplace_id,
      "corporationId":corporation_id
    };

    if (!position.id) {
      // create a new position & opportunity
        const variables={
        "input": {
          "clientMutationId": "123456786",
          "position": newData
        },
        "data": {
          "clientMutationId": "GHJKwegrt",
            "opportunity": {
              "workplaceId": workplace_id,
              "positionId": positionId,
              "opportunityWage": opportunity.opportunityWage,
              "isPublic":opportunity.isPublic,
              "id": opportunityId,
            }
        }
      };
      this.props.createPosition({
      variables: variables
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
        this.state.positions.push(newData);
        this.setState({ positions});

      // add team members
      position.teamMembers.forEach(function(userId) {
        this.createJob(userId,positionId);
      }, this); 
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
            "positionPatch":newData
          },
          "input": {
            "id": opportunity.id,
            "opportunityPatch": {
              "opportunityWage": opportunity.opportunityWage,
              "isPublic": opportunity.isPublic
            }
          }
        }
      })
      .then(({ data }) => {
        console.log(data);
        const positionIndex = findIndex(positions, { id: position.id });
        positions[positionIndex] = position;
        this.setState({ positions });
      })
      .catch((error) => {
        console.error('There was an error sending the query', error);
      });  
    }
  };
  createJob=(userId,positionId)=>{
       this.props.createJob({
          variables: {
            "input": {
              "clientMutationId": "dd",
              "job": {
                "userId": userId,
                "workplaceId": workplace_id,
                "positionId": positionId,
                "isPositionActive": true,
                "activatedDate":moment().format(),
                "deactivatedDate": moment().add(10, 'day').format(),
                "isVerified": false,
                "isPreTrainingComplete": false,
                "isTrainable": true,
                "id": uuidv1(),
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
  render() {
    if (!this.state.positions) {
      return  ( 
      <div style={{marginTop:"30%",marginLeft:"0"}}>
        <Loader active inline='centered' />
      </div> )
    }
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
  mutation fetchRelevantPositions($input:FetchRelevantPositionsInput!){
    fetchRelevantPositions(input:$input){
      positions{
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
  mutation createPosition($input:CreatePositionInput!,$data: CreateOpportunityInput!){
    createPosition(input:$input){
      position{
        id		
      }
    }
    createOpportunity(input: $data) {
      opportunity {
        id
      }
    }
  }
`
const add_job=gql`
mutation createJob($input:CreateJobInput!){
  createJob(input:$input){
    job{
      id
    }
  } 
}`

const update_position=gql`
mutation updatePosition($input:UpdateOpportunityInput!,$data:UpdatePositionByIdInput!){
    updateOpportunity(input:$input){
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
mutation deletePosition($input: DeletePositionByIdInput!,$data: DeleteOpportunityByIdInput!) {
  deleteOpportunityById(input:$data){
    opportunity{
      id
    }
  } 
  deletePositionById(input: $input) {
    position {
      id
    }
  }
}
`

const AddPosition = compose(
  graphql(all_positions,{
   name:"fetchRelevantPositions"
  }),
  graphql(add_position,{
   name:"createPosition"
  }),
  graphql(update_position,{
   name:"updatePosition"
  }),
  graphql(delete_position,{
   name:"deletePosition"
  }),
  graphql(add_job,{
   name:"createJob"
  })
)(PositionsSection);

export default AddPosition
