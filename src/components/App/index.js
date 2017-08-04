import React, { Component } from 'react';
import { renderRoutes } from 'react-router-config';
import {Grid, Container } from 'semantic-ui-react'

import Nav from './Nav'
class App extends Component {
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
    let route = this.props.route.routes;
    let routes = [];
    route.map((value,index)=>{
      value.isEmployeeview = this.setEmployeeview;
      value.workplaceId=this.state.workplaceId;
      routes.push(value);
    });
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
export default App
