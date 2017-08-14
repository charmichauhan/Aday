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
      brandId:"",
      isEmployeeview:false
    });
  }
  handleChange = (workplaceId) => {
    this.setState({workplaceId:workplaceId});
  };
  handleChangeBrand = (brandId) => {
    this.setState({brandId:brandId});
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
      this.props.history.push('/login')
      return (<div>You must login first</div>)
    }
    this.props.data.allUsers
    let route = this.props.route.routes;
    let routes = [];
    route.map((value,index)=>{
      value.isEmployeeview = this.setEmployeeview;
      value.workplaceId=this.state.workplaceId;
      value.brandId = this.state.brandId;
      routes.push(value);
    });


    localStorage.setItem("userId", this.props.data.allUsers.edges[0].node.id)
    const employee = this.props.data.allUsers.edges[0].node.employeesByUserId.edges[0]
    if(employee){
      localStorage.setItem("corporationId", employee.node.corporationId);
      localStorage.setItem("brandId", employee.node.accessesByEmployeeId.nodes[0].brandId);
   }
    return(
      	<Container fluid>
          <Grid>
            <Grid.Row>
              <Grid.Column width={3} className="left-content"><Nav history={ this.props.history } handleChange={this.handleChange} isemployeeview={this.state.isEmployeeview} handleChangeBrand={this.handleChangeBrand} brandId={this.state.brandId}/></Grid.Column>
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
                            brandId
                          }
                        }
                      }
                    }
                  }
                }
            }
    }
}`

// will be localStorage.getItem('email') with authentication
const App = graphql(userInfo, {
  options: (ownProps) => ({
    variables: {
      email: "test@example.com"
    }
  }),
})(AppComponent);

export default App