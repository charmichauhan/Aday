import React, { Component } from 'react'
import { Segment, Input, Form, Message, Header, Button, Dropdown } from 'semantic-ui-react'
import RaisedButton from 'material-ui/RaisedButton';
import { gql,graphql,compose } from 'react-apollo';
import uuidv4 from 'uuid/v4';

const initialState = {
  first_name: '',
  last_name: '',
  email: '',
  submittedFirstName: '',
  submittedLastName: '',
  submittedEmail: '',
};
class InviteManagersComponent extends Component {

  state = initialState;

  handleChange = (e, { name, value }) => this.setState({ [name]: value })

  handleSubmit = e => {
    const { first_name, last_name, email } = this.state

    this.setState({ submittedFirstName: first_name, submittedLastName: last_name, submittedEmail: email})
  }
  createUser = () => {
    const { first_name, last_name, email } = this.state;
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
      let userId = data.createUser.user.id;
      let workplaceId=localStorage.getItem("workplaceId");
      let id = uuidv4();
      that.props.createJob({
        variables:{
          data:{
            job:{
              id:id,
              userId:userId,
              workplaceId:workplaceId
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
              corporationId,
              isManager:true
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
    this.setState({ submittedFirstName: first_name, submittedLastName: last_name, submittedEmail: email})
  };

  render() {

	const options = [
	  { key: 1, text: 'Cashier', value: 1 },
	  { key: 2, text: 'Second Cook', value: 2 },
	  { key: 3, text: 'First Cook', value: 3 },
	  { key: 4, text: 'Short Order Cook', value: 4 },
	  { key: 5, text: 'Catering', value: 5 },
	  { key: 6, text: 'Sushi', value: 6 },
	]

	const renderLabel = (label, index, props) => ({
	  color: 'red',
	  content: `${label.text}`,
	})

    const {
      first_name,
      last_name,
      email,
      submittedFirstName,
      submittedLastName,
      submittedEmail,
  	} = this.state

    return (
		<div>
			<br/>
			<Segment>
			    <Form widths='equal'>
			      <Form.Group>
			        <Form.Input  size='big' placeholder='First Name' name='first_name' value={first_name} onChange={this.handleChange} />
			        <Form.Input  size='big' placeholder='Last Name' name='last_name' value={last_name} onChange={this.handleChange} />
			        <Form.Input  size='big' placeholder='Email' name='email' value={email} onChange={this.handleChange} />
			      </Form.Group>
			    {/*<Form.Field id='invite_team_member' control={Button} content='Invite'/>*/}
			    <RaisedButton label="Invite Manager" backgroundColor="#0022A1" labelColor="#FFFFFF" onClick={this.createUser}/>
			    </Form>
			</Segment>
	        <strong>onChange:</strong>
	        <pre>{JSON.stringify({ first_name, last_name, email }, null, 2)}</pre>
	        <strong>onSubmit:</strong>
	        <pre>{JSON.stringify({ submittedFirstName, submittedLastName, submittedEmail }, null, 2)}</pre>
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

const InviteManagers = compose(
  graphql(createUser,{name:"createUser"}),
  graphql(createEmployee,{name:"createEmployee"}),
  graphql(createJob,{name:"createJob"}))(InviteManagersComponent);

export default InviteManagers
