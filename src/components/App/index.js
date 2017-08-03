import React, { Component } from 'react';
import { renderRoutes } from 'react-router-config';
import {Grid, Container } from 'semantic-ui-react'

import Nav from './Nav'
class App extends Component {
  constructor(props){
    super(props);
    this.state=({
      workplaceId:""
    });
  }
  handleChange = (workplaceId) => {
    this.setState({workplaceId:workplaceId});
  };

  render(){
    let route = this.props.route.routes;
    let routes = [];
    route.map((value,index)=>{
      value.workplaceId=this.state.workplaceId;
      routes.push(value);
    });
    return(
      	<Container fluid>
          <Grid>
            <Grid.Row>
              <Grid.Column width={3} className="left-content"><Nav handleChange={this.handleChange}/></Grid.Column>
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
