import React,{Component} from 'react';
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

import {Dropdown,Loader} from 'semantic-ui-react';

class ManagerSelectComponent extends Component{
   static propTypes = {
    data: React.PropTypes.shape({
      loading: React.PropTypes.bool,
      error: React.PropTypes.object,
      Trainer: React.PropTypes.object,
    }).isRequired,
  }


  constructor(props){
    super(props);
    this.state={
      users:[]
    }
    this.onManagerChange=this.onManagerChange.bind(this);
  }

   onManagerChange(event, data){
    const {formCallBack}=this.props
    console.log(event,data);
    this.setState({users:data.value});
    formCallBack(data.value);

  }
  render(){
  
    if (this.props.data.loading) {
      return (
      <Loader active inline='centered' />
      )
    }

    if (this.props.data.error) {
      console.log(this.props.data.error)
      return (<div>An unexpected error occurred</div>)
    }else{
      if(!this.state.users.length){
        // add positions into state parameter
      let usersArray=this.props.data.allUsers.nodes;
      usersArray.forEach(function(user,index) {
        this.state.users.push({
          text:user.firstName,
          value:user.id,
          key:user.id
        })
      }, this);
    }
    }
  

    return(
 
    <div>
      <Dropdown  placeholder='Select Manager' fluid selection options={this.state.users} style={{ marginTop:'-2%' }} onChange={this.onManagerChange}  />
    </div>
           
    );
  }
}

const getAllUsers = gql`
  query getAllUsersQuery {
  allUsers{
    nodes{
      firstName,
      lastName,
      id
    }
  }
}
`


const ManagerSelectOption= graphql(getAllUsers)(ManagerSelectComponent)
export default ManagerSelectOption
