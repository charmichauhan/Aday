import React,{Component} from 'react';
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

import {Dropdown,Loader} from 'semantic-ui-react';

class ManagerSelectComponent extends Component{
   static propTypes = {
    data: React.PropTypes.shape({
      loading: React.PropTypes.bool,
      error: React.PropTypes.object,
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
    this.props.formCallBack({managerValue: data.value});
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
      let usersArray=this.props.data.allEmployees.edges;
      usersArray.forEach(function(user,index) {
        const usr = user.node.userByUserId
        this.state.users.push({
          text: usr.firstName + " " + usr.lastName,
          value: usr.id,
          key: usr.id
        })
      }, this);
    }
    }
    
    return( 
      <div>
        { !this.props.manager && <Dropdown  placeholder='Select Manager' fluid selection 
            options={this.state.users} style={{ marginTop:'-2%' }} onChange={this.onManagerChange} /> }

       { this.props.manager && <Dropdown defaultValue={ this.props.manager } fluid selection 
            options={this.state.users} style={{ marginTop:'-2%' }} onChange={this.onManagerChange} /> }
      </div>     
    );
  }
}

const getAllUsers = gql`
  query getAllUsersQuery{
    allEmployees(condition:{isManager:true}){
        edges{
          node{
            userByUserId{
              id
              firstName
              lastName
            }
          }
        }
    }
}
`


const ManagerSelectOption= graphql(getAllUsers)(ManagerSelectComponent)
export default ManagerSelectOption
