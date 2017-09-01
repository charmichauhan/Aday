import React, { Component } from 'react'
import { Segment, Input, Form, Message, Header, Button, Dropdown } from 'semantic-ui-react'
import RaisedButton from 'material-ui/RaisedButton';
import { gql,graphql,compose } from 'react-apollo';
import uuidv4 from 'uuid/v4';
import 'react-date-picker/index.css'
import { DateField, Calendar } from 'react-date-picker'
import moment from 'moment';
var rp = require('request-promise');

const initialState={
  first_name: '',
  last_name: '',
  email: '',
  daily_max: '',
  weekly_max: '',
  monthly_max: '',
  positions: [],
  submittedFirstName: '',
  submittedLastName: '',
  submittedEmail: '',
  submittedPositions: '',
  hireDate: moment().format('YYYY-DD-MM')
}

class InviteTeamMembersComponent extends Component {
 
  state = initialState

  handleChange = (e, { name, value }) => {
    this.setState({[name]: value})
  };
  handlePositionsChange = (e,{ value }) =>{
    this.setState({positions:value})
  };

  handleDateChange = (dateString, { dateMoment, timestamp }) => {
    this.setState({hireDate: dateString})
  };

  createUser = () => {
    const { first_name, last_name, email, positions, daily_max, weekly_max, monthly_max, hireDate } = this.state;
    let that = this;
    let workplaceId=localStorage.getItem("workplaceId");
    let password = uuidv4().substring(0,8)

    this.props.createUser({
      variables:{
        data:{
            fname: first_name,
            password: password,
            lname: last_name,
            email: email
          }
      }
    }).then(({data})=>{

      // call express server emailInviteUser( email , password )

      let userId = data.registerTeamMember.user.id;

      positions.map((value,index)=>{
        let positionId = uuidv4();
        that.props.createJob({
          variables:{
            data:{
              job:{
                id: positionId,
                userId:userId,
                workplaceId:workplaceId,
                positionId:value,
                isPositionActive: false
              }
            }
          }
        }).then(({data})=>{
          console.log("POSITION CREATED")
        });
      })

      let eid = uuidv4();
      let corporationId=localStorage.getItem("corporationId");

      that.props.createEmployee({
        variables:{
          data:{
            employee:{
              id:eid,
              userId: userId,
              corporationId: corporationId,
              primaryWorkplace: workplaceId,
              dayHourLimit: daily_max,
              weekHourLimit: weekly_max, 
              monthHourLimit: monthly_max,
              hireDate: moment(hireDate).format(),
              isManager: false
            }
          }
        }
      }).then(({data}) => {
        console.log('createdEmployee');
        //window.location.reload();
        var uri = 'http://8c793d9d.ngrok.io/invitation'

             var options = {
                uri: uri,
                method: 'POST',
                json: {
                      "data": {
                              "userName": first_name + " " + last_name,
                              "emailId": email,
                              "brandName": "Compass",
                              "workplaceName": "Chao",
                              "managerName": "Todd"
                            }
                    }
            };

              rp(options)
                .then(function(response) {
                       that.setState({redirect:true})
                  }).catch((error) => {
                      console.log('there was an error sending the query', error);
                  });
      }); 

    }).catch((error) => {
        console.log('there was an error sending the query', error);
      });

    this.setState({ submittedFirstName: first_name, submittedLastName: last_name, submittedEmail: email, submittedPositions: positions})
  };

  render() {    

    if (this.props.allPositions.loading) {
      return (<div>Loading</div>)
    }

    // this.props.deleteUserById({variables:{data:{id:"5de243f6-a284-4dff-b9cb-d7ae1d8fc1fe"}}})
    //   .then(({ data }) => {
    //     console.log('Delete Data', data);
    //   }).catch((error) => {
    //   console.log('there was an error sending the query', error);
    // });
    ///
    let allPositions = this.props.allPositions && this.props.allPositions.allPositions.edges;
    let options = [];
    allPositions.map((value,index)=>{
      let option = {};
      option.key = value.node.id;
      option.value = value.node.id;
      option.text = value.node.positionName;
      options.push(option);
    });

	const renderLabel = (label, index, props) => ({
	  color: 'red',
	  content: `${label.text}`,
	})

    const {
      first_name,
      last_name,
      email,
      positions,
      submittedFirstName,
      submittedLastName,
      submittedEmail,
      submittedPositions,
      daily_max,
      weekly_max,
      monthly_max
  	} = this.state

    let isUnion = ""
    if (localStorage.getItem("isUnion") == "true") {
     isUnion = (
       <div className="field"> 
        <div className="ui form field">
          <label> Select Hire Date </label>
          <DateField
            dateFormat="YYYY-MM-DD"
            date={this.hireDate}
            onChange={this.handleDateChange}
          />
        </div>
      </div>
      );
    }
    if (!localStorage.getItem("workplaceId")){
      return ( <div> <p/> <div> Must Select A Workplace From The Sidebar Dropdown To Add A Team Member </div> </div> )
    } else {
        return (
    		  <div>
    			<br/>
    			<Segment>
    			    <Form widths='equal'>
    			      <Form.Group>
    			        <Form.Input  label="First Name" size='medium' placeholder='First Name' name='first_name' value={first_name} onChange={this.handleChange} />
                  <Form.Input  label="Last Name" size='medium' placeholder='Last Name' name='last_name' value={last_name} onChange={this.handleChange} />
                  <Form.Input  label="Email" size='medium' placeholder='Email' name='email' value={email} onChange={this.handleChange} />
    			      </Form.Group>
                <Form.Group>
                  <Form.Input  size='medium' label="Max Daily Hours" placeholder='Max Daily Hours' name='daily_max' value={daily_max} onChange={this.handleChange} />
                  <Form.Input  size='medium' label="Max Weekly Hours" placeholder='Max Weekly Hours' name='weekly_max' value={weekly_max} onChange={this.handleChange} />
                  <Form.Input  size='medium' label="Max Monthly Hours" placeholder='Max Monthly Hours' name='monthly_max' value={monthly_max} onChange={this.handleChange} />
                </Form.Group>
                { isUnion }
    			      <Form.Dropdown
                label="Add Positions For This Team Member. If None, Leave Blank."
    				    multiple
    				    selection
    				    fluid
                options={options}
    				    placeholder='Select Positions'
    				    renderLabel={renderLabel}
    				    onChange={this.handlePositionsChange}
    				  />
    			    {/*<Form.Field id='invite_team_member' control={Button} content='Invite'/>*/}
    			    <RaisedButton label="Invite Team Member" backgroundColor="#0022A1" labelColor="#FFFFFF" onClick={this.createUser}/>
    			    </Form>
    			</Segment>
    		  </div>
        )
    }
  }
}

const allPositions = gql`
  query allPositions{
  allPositions {
    edges {
      node {
        id
        positionName
      }
    }
  }
}
`

const createJob = gql `
   mutation createJob($data: CreateJobInput!){
    createJob(input:$data)
    {
      job{
        id
      }
    }
  }
`

const createEmployee = gql `
   mutation createEmployee($data: CreateEmployeeInput!){
    createEmployee(input:$data)
    {
      employee{
        id
      }
    }
  }
`

const createUser = gql`
  mutation createUser($data: RegisterTeamMemberInput!){
  registerTeamMember (input: $data )
  {
    user {
      id
    }
  }
}`

const deleteUserId = gql`
  mutation deleteUserById($data:DeleteUserByIdInput!){
    deleteUserById(input:$data){
        user{
          id
        }
    }
  }
`

const InviteTeamMembers = compose(
  graphql(createUser,{name:"createUser"}),
  graphql(allPositions ,{name:"allPositions"}),
  graphql(createEmployee,{name:"createEmployee"}),
  graphql(createJob,{name:"createJob"}),
  graphql(deleteUserId,{name:"deleteUserById"}))(InviteTeamMembersComponent);

export default InviteTeamMembers
