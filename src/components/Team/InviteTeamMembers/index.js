import React, { Component } from 'react'
import { Segment, Input, Form, Message, Header, Button, Dropdown } from 'semantic-ui-react'
import RaisedButton from 'material-ui/RaisedButton';
import { gql,graphql,compose } from 'react-apollo';
import uuidv4 from 'uuid/v4';

const initialState={
  first_name: '',
  last_name: '',
  email: '',
  positions: '',
  submittedFirstName: '',
  submittedLastName: '',
  submittedEmail: '',
  submittedPositions: '',
}
class InviteTeamMembersComponent extends Component {

  state = initialState

  handleChange = (e, { name, value }) => {
    this.setState({[name]: value})
  };
  handlePositionsChange = (e,{ value }) =>{
    this.setState({positions:value[0]})
  };
  createUser = () => {
    const { first_name, last_name, email, positions } = this.state;
    let that = this;
    this.props.createUser({
      variables:{
        data:{
          user:{
            id:uuidv4(),
            firstName:first_name,
            userCreatedDate:new Date().toUTCString(),
            lastName: last_name,
            userEmail: email,
          }
        }
      }
    }).then(({data})=>{
      console.log(positions);
      let userId = data.createUser.user.id;
      let workplaceId=localStorage.getItem("workplaceId");
      let id = uuidv4();
      that.props.createJob({
        variables:{
          data:{
            job:{
              id:id,
              userId:userId,
              workplaceId:workplaceId,
              positionId:positions
            }
          }
        }
      }).then(({data})=>{
        console.log(data);
      });

      let eid = uuidv4();
      let corporationId=localStorage.getItem("corporationId");

      that.props.createEmployee({
        variables:{
          data:{
            employee:{
              id:eid,
              userId:userId,
              corporationId
            }
          }
        }
      }).then(({data}) => {
        console.log('createEmployee',data);
      });
      that.setState({initialState})
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
    //
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
  	} = this.state

    return (
		<div>
			<br/>
			<Segment>
			    <Form widths='equal'>
			      <Form.Group>
			        <Form.Input  size='medium' placeholder='First Name' name='first_name' value={first_name} onChange={this.handleChange} />
			        <Form.Input  size='medium' placeholder='Last Name' name='last_name' value={last_name} onChange={this.handleChange} />
			        <Form.Input  size='medium' placeholder='Email' name='email' value={email} onChange={this.handleChange} />
			      </Form.Group>
			      <Form.Dropdown
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
	        <strong>onChange:</strong>
	        <pre>{JSON.stringify({ first_name, last_name, email, positions }, null, 2)}</pre>
	        <strong>onSubmit:</strong>
	        <pre>{JSON.stringify({ submittedFirstName, submittedLastName, submittedEmail, submittedPositions }, null, 2)}</pre>
		</div>
    )
  }
}

const createUser = gql`
  mutation createUser($data: CreateUserInput!){
    createUser(input:$data)
    {
      user{
        id
      }
    }
  }
`
const allPositions = gql`
  query allPositions{
  allPositions {
    edges{
      node{
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
