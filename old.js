import React,{Component} from 'react';
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import {Header,Image,Button,Divider,Segment,Label,Input,Icon,Form,TextArea} from 'semantic-ui-react';
import {Scrollbars} from 'react-custom-scrollbars';

import momment from 'moment';
import ShiftDaySelector from '../../../DaySelector/ShiftDaySelector.js';
import TimePicker from '../../../TimePicker/TimePicker.js';
import NumberOfEmployeeSelector from './NumberOfTeamMembers';
import ToggleButton from './ToggleButton';


export class AddShiftForm extends Component{
   static propTypes = {
    data: React.PropTypes.shape({
      loading: React.PropTypes.bool,
      error: React.PropTypes.object,
      Trainer: React.PropTypes.object,
    }).isRequired,
  }

  
 /* static propTypes = {
    router: React.PropTypes.object.isRequired,
    mutate: React.PropTypes.func.isRequired,
    params: React.PropTypes.object.isRequired,
  }
 */
  render(){
    if (this.props.data.loading) {
      return (<div>Loading</div>)
    }

    if (this.props.data.error) {
      console.log(this.props.data.error)
      return (<div>An unexpected error occurred</div>)
    }
//- {this.props.data.allShifts.nodes.length}
    return(
      <div>
      <Header as = 'h1' style={{textAlign: 'center' , color: '#0022A1'}} >
        ADD SHIFT - {this.props.data.allShifts.nodes.length}
        <Image
          floated="left"
          src="/images/Assets/Icons/Icons/job-deck.png"
          style= {{marginTop:'0px',width:'35px'}}
        />
        <Image
          floated="right"
          src="/images/Assets/Icons/Buttons/delete-round-small.png"
          shape="circular"
          style={{marginTop:'0px',right:'-11%',width:'50px'}}
          onClick={this.props.closeFunc}
        />
      </Header>
      <Segment raised style ={{marginTop:'2%'}}>
       <Scrollbars
          style = {{height:'72.4vh',marginBottom:'20px',paddingBottom:'20px'}} >
           <Form>
            <div>
              <p style = {{fontSize:'20px',fontStyle:'normal',color:'rgba(0, 0, 0, 0.87)'}}>WORKPLACE</p>
              <Input placeholder="CHAO CENTER" icon = {<Icon name = "sort" />} style={{marginTop:'-2%',width:'95%',backgroundColor:'lightgrey'}} />
            </div>
            <div>
              <p style = {{fontSize:'20px',fontStyle:'normal',color:'rgba(0, 0, 0, 0.87)'}}>POSITION</p>
              <Input placeholder="SELECT POSITION" icon = {<Icon name = "sort" />} style={{marginTop:'-2%',width:'95%',backgroundColor:'lightgrey'}} />
            </div>
            <div>
             <p style = {{fontSize:'20px',fontStyle:'normal',color:'rgba(0, 0, 0, 0.87)'}}>SHIFT DAY(S) OF THE WEEK</p>
               <ShiftDaySelector />
            </div>
            <div>
               <TimePicker />
            </div>
            <div style={{marginTop:'32%'}}>
               <NumberOfEmployeeSelector />
            </div>
            <div>
               <p style = {{fontSize:'20px',fontStyle:'normal',color:'rgba(0, 0, 0, 0.87)'}}>JOB SHADOWING OPPORTUNITY</p>
               <ToggleButton />
            </div>
            <div style={{marginTop:'7%'}}>
              <p style = {{fontSize:'20px',fontStyle:'normal',color:'rgba(0, 0, 0, 0.87)'}}>UNPAID-BREAK</p>
              <Input placeholder="30 MINUTES" icon = {<Icon name = "sort" />} style={{marginTop:'-2%',width:'95%',backgroundColor:'lightgrey'}}  />
            </div>
            <div style={{marginTop:'2%'}}>
              <p style = {{fontSize:'20px',fontStyle:'normal',color:'rgba(0, 0, 0, 0.87)'}}>MANAGER-OPTIONAL</p>
              <Input placeholder="$0.00" icon = {<Icon name = "sort" />} style={{marginTop:'-2%',width:'95%',backgroundColor:'lightgrey'}} />
            </div>
            <div>
              <p style = {{fontSize:'20px',fontStyle:'normal',color:'rgba(0, 0, 0, 0.87)'}}><span style={{color:'#0022A1'}}>Maximum</span> INCENTIVE BONUS PER HOUR</p>
              <Input placeholder="$0.00" icon = {<Icon name = "sort" />} style={{marginTop:'-2%',width:'95%',backgroundColor:'lightgrey'}} />

            </div>
            <div>
              <p style = {{fontSize:'20px',fontStyle:'normal',color:'rgba(0, 0, 0, 0.87)'}}>INSTRUCTIONS - <span style={{color:'RED'}}>OPTIONAL</span></p>
              <TextArea rows={3} style={{width:'95%'}} placeholder='ENTER ADDITIONAL INFORMATION ABOUT THE SHIFT' />
            </div>
            <div>
              <Image.Group style={{marginLeft:'33%',float:'left'}}>
               <Image
                 src="/images/Assets/Icons/Buttons/cancel-shift.png"
                 shape="circular"
               />
               <Image
                 src="/images/Assets/Icons/Buttons/add-shift.png"
                 shape="circular"
                 onClick={this.handleSave}
               />
              </Image.Group>
            </div>
          </Form>
        </Scrollbars>
       </Segment>
      </div>
    );
  }

  handleSave = () => {
  
  /*  
    this.props.mutate({
      variables: {
       /* "id":"123e4567-e89b-12d3-a456-426655440001"

        /* "data":{
       "clientMutationId": "123456786",
        "shift": {
            "id": "5a01782c-c220-4927-b059-f4f22d01c232",
            "creatorId": "5a01782c-c220-4927-b059-f4f22d01c230",
            "managersOnShift": [],
            "workplaceId": "5a01782c-c220-4927-b059-f4f22d01c230",
            "positionId": "6a01782c-c220-4927-b059-f4f22d01c230",
            "startTime": "2017-07-21T16:30:00+05:30",
            "endTime": "2017-07-21T23:30:00+05:30",
            "workersRequestedNum": 1,
            "traineesRequestedNum": 0,
            "workersInvited": [],
            "workersAssigned": [],
            "shiftDateCreated": "2017-06-07T09:30:00+05:30",
            "isInterview": false,
            "unpaidBreakTime": "01:00:00",
            "instructions": "This is add by abhishek",
            "requestExpirationDate": "2017-07-20T09:30:00+05:30",
            "isPublished": true,
            "hourlyBonusPay": null          
        }
      }
  }
})
  .then(({ data }) => {
        console.log('got data', data);
      }).catch((error) => {
        console.log('there was an error sending the query', error);
      });
  }
  */
}


const CreateShiftQuery = gql`
  query CreateShiftQuery     {
    allShifts{
      nodes{
        creatorId
        managersOnShift
        workplaceId
        positionId
        startTime
        endTime
        workersRequestedNum
        traineesRequestedNum
        workersInvited
        workersAssigned
        shiftDateCreated
        isInterview
        unpaidBreakTime
        instructions
        requestExpirationDate
        isPublished
        hourlyBonusPay
        userByCreatorId {
          id
        }
        positionByPositionId {
          id
        }
  
            }
    }
}

`

/* mutation createShift($data:CreateShiftInput!){
  createShift(input:$data)
  {
    shift{
      id
    }
  }
}*/
/*
const createPokemonMutation = gql`
mutation deleteShift($id:Uuid!)
{
  deleteShiftById(input:{id:$id}){
  deletedShiftId
   
  }
}
`
*/

//const AddPokemonCardWithMutation = graphql(createPokemonMutation)(AddShiftForm)

//export default AddPokemonCardWithMutation
// this is query which i used in my server
const AddShiftFormWithData = graphql(CreateShiftQuery)(AddShiftForm)
export default  AddShiftFormWithData;