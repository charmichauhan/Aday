import React, { Component } from 'react';
import { range, random } from 'lodash';
import { Tabs, Tab } from 'material-ui/Tabs';
import { gql, graphql ,compose } from 'react-apollo';
import {Loader} from 'semantic-ui-react';
import { remove, maxBy, findIndex } from 'lodash';
import uuidv1 from 'uuid/v1';
import Positions from './Positions';
import { tabDesign } from '../styles';
import './positions.css';

const styles = {
  tabDesign
};

//const brandid="5a14782b-c220-4927-b059-f4f22d01c230";
//const workplaceid="5a01782c-c220-4927-b059-f4f22d01c230";
//const corporationId="3b14782b-c220-4927-b059-f4f22d01c230";
//const clientMutationId="qwertyuiop";




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
          "brandid":"5a14782b-c220-4927-b059-f4f22d01c230",
          "workplaceid":"5a01782c-c220-4927-b059-f4f22d01c230",
          "corporationid":"3b14782b-c220-4927-b059-f4f22d01c230",
          "clientMutationId":"2513056"
        }
      }
    })
    .then(({ data }) => {
      console.log(data);
      data.fetchRelevantPositions.positions.map((position)=>{
        position.trainingTracks=0;//add a trainingtrack property to positiona and set it to zero
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
       this.props.deletePosition({
        variables:{
          "input": {
            "clientMutationId": "fdsgdhfj",
            "id":id 
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
    const id=uuidv1();
    const newData={
      "id": id,
      "positionName": position.positionName,
      "positionDescription": position.positionDescription,
      "minimumLiftWeight": position.minimumLiftWeight,
      "traineeHours": position.traineeHours,
      "positionIconUrl": "",
      "minimumAge": position.minimumAge,
      "exchangeLevel": null,
      "trainingUrl": "",
      "brandId":"5a14782b-c220-4927-b059-f4f22d01c230",
      "workplaceId":"5a01782c-c220-4927-b059-f4f22d01c230",
      "corporationId":null
    };
  
    if (!position.id) {
        const variables={
        "input": {
          "clientMutationId": "123456786",
          "position": newData
        }
      };
      this.props.createPosition({
      variables: variables
      })
      .then(({ data }) => {
        console.log(data);
          this.state.positions.push(data.createPosition.position);
          this.setState({ positions});
      })
      .catch((error) => {
        console.error('There was an error sending the query', error);
      });
      } else {
        const variables={
        "input": {
          "id": position.id,
          "positionPatch":newData
        }
      };
        this.props.updatePosition({
        variables: variables
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
            workplaceId
            id
            isPublic
          }
        }
      }
    }
  }`;
const add_position=gql`
  mutation createPosition($input:CreatePositionInput!){
    createPosition(input:$input){
      position{
        id		
      }
    }
  }
`

const update_position=gql`
mutation updatePosition($input:UpdatePositionByIdInput!){
    updatePositionById(input:$input){
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
)(PositionsSection);

export default AddPosition
