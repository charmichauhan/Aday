import React, { Component } from 'react';
import { renderRoutes } from 'react-router-config';
import {Grid, Container } from 'semantic-ui-react'
import Nav from './Nav'
import { gql, graphql } from 'react-apollo';

class AppComponent extends Component {
  constructor(props){
    super(props);
    this.state=({
      workplaceId:"",
      isEmployeeview:false
    });
  }
  handleChange = (workplaceId) => {
    this.setState({workplaceId:workplaceId});
  };
  setEmployeeview = (e) => {
    this.setState({isEmployeeview:true})
  };
  componentWillReceiveProps = () => {
    if(this.state.isEmployeeview) {
      this.setState({isEmployeeview: !this.state.isEmployeeview})
    }
  };
  render(){

    if (this.props.data.loading) {
      return (<div>Loading</div>)
    }

    if (this.props.data.error) {
      console.log(this.props.data.error)
      window.location.href = '/login';
      return (<div>You must login first</div>)
    }
    this.props.data.allUsers
    let route = this.props.route.routes;
    let routes = [];
    route.map((value,index)=>{
      value.isEmployeeview = this.setEmployeeview;
      value.workplaceId=this.state.workplaceId;
      routes.push(value);
    });


    localStorage.setItem("userId", this.props.data.allUsers.edges[0].node.id)
    
    const employee = this.props.data.allUsers.edges[0].node.employeesByUserId.edges[0]
    if(employee){

    }else{
      localStorage.setItem("brandId", "5a14782b-c220-4927-b059-f4f22d01c230");
      localStorage.setItem("corporationId", "3b14782b-c220-4927-b059-f4f22d01c230");
    }
    return(
      	<Container fluid>
          <Grid>
            <Grid.Row>
              <Grid.Column width={3} className="left-content"><Nav handleChange={this.handleChange} isemployeeview={this.state.isEmployeeview}/></Grid.Column>
              <Grid.Column width={12} className="main-content">
                {renderRoutes(routes)}
              </Grid.Column>
            </Grid.Row>
          </Grid>
	      </Container>
    )
  }
}


const userInfo = gql
  `query userInfo($email: String!){ 
        allUsers(condition: { userEmail: $email }){
             edges{
                node{
                  id
                  employeesByUserId(condition: {isManager:true}){
                    edges{
                      node{
                        id
                        corporationId
                        accessesByEmployeeId{
                          nodes{
                            workplaceId
                          }
                        }
                      }
                    }
                  }
                }
            }
    }
}`

const App = graphql(userInfo, {
  options: (ownProps) => ({
    variables: {
      email: localStorage.getItem('email'),
    }
  }),
})(AppComponent);

export default App