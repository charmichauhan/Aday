import React, { Component } from 'react';
import { renderRoutes } from 'react-router-config';
import {Grid, Container } from 'semantic-ui-react'
import Nav from './Nav'
import { gql, graphql } from 'react-apollo';
const uuidv4 = require('uuid/v4');
var Halogen = require('halogen');


class AppComponent extends Component {
  constructor(props){
    super(props);
    this.state=({
      isEmployeeview:false
    });
    this.handleChange = this.handleChange.bind(this);
  }
  setEmployeeview = (e) => {
    this.setState({isEmployeeview:true})
  };
  componentWillReceiveProps = () => {
    if(this.state.isEmployeeview) {
      this.setState({isEmployeeview: !this.state.isEmployeeview})
    }
  };
  handleChange = (data) => {
    this.forceUpdate();
    if (data) this.setState({ ...data });
  };
  render(){
    if (this.props.data.loading) {
      return (<div><Halogen.SyncLoader color='#00A863'/></div>)
    }

    if (this.props.data.error) {
      console.log(this.props.data.error)
      this.props.history.push('/login')
      return (<div>You must login first</div>)
    }
    let route = this.props.route.routes;
    let routes = [];
    route.map((value,index)=>{
      value.isEmployeeview = this.setEmployeeview;
      routes.push(value);
    });
    if (localStorage.getItem("userId") != this.props.data.allUsers.edges[0].node.id){
      localStorage.setItem("userId", this.props.data.allUsers.edges[0].node.id)
      localStorage.setItem("workplaceId", "");
      const employee = this.props.data.allUsers.edges[0].node.employeesByUserId.edges[0]
      if(employee){
        localStorage.setItem("corporationId", employee.node.corporationId);
        localStorage.setItem("brandId", employee.node.accessesByEmployeeId.nodes[0].brandId);
      } else {
        throw "Kendall thinks every user who logs in must be an employee";
      }
    }
    return(
      	<Container fluid>
          <Grid>
            <Grid.Row>
              <Grid.Column width={3} className="left-content">
                <Nav history={ this.props.history } isemployeeview={this.state.isEmployeeview} handleChange = {this.handleChange}/>
              </Grid.Column>
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
