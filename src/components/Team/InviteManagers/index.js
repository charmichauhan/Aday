import React, { Component } from 'react'
import { Segment, Input, Form, Message, Header, Button, Dropdown } from 'semantic-ui-react'
import RaisedButton from 'material-ui/RaisedButton';

export default class InviteManagers extends Component {

  state = { 
  	first_name: '', 
  	last_name: '', 
  	email: '', 
  	submittedFirstName: '', 
  	submittedLastName: '', 
  	submittedEmail: '',
  }

  handleChange = (e, { name, value }) => this.setState({ [name]: value })

  handleSubmit = e => {
    const { first_name, last_name, email } = this.state

    this.setState({ submittedFirstName: first_name, submittedLastName: last_name, submittedEmail: email})
  }

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
			    <Form onSubmit={this.handleSubmit} widths='equal'>
			      <Form.Group>
			        <Form.Input  size='big' placeholder='First Name' name='first_name' value={first_name} onChange={this.handleChange} />
			        <Form.Input  size='big' placeholder='Last Name' name='last_name' value={last_name} onChange={this.handleChange} />
			        <Form.Input  size='big' placeholder='Email' name='email' value={email} onChange={this.handleChange} />
			      </Form.Group>
			    {/*<Form.Field id='invite_team_member' control={Button} content='Invite'/>*/}
			    <RaisedButton label="Invite Manager" backgroundColor="#0022A1" labelColor="#FFFFFF"/>
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