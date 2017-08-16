import React,{Component} from 'react';
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import '../styles.css';

import {Dropdown,Loader} from 'semantic-ui-react';

export class WorkplaceSelector extends Component{
   static propTypes = {
    data: React.PropTypes.shape({
      loading: React.PropTypes.bool,
      error: React.PropTypes.object,
    }).isRequired,
  }

  constructor(props){
    super(props);
    this.state={
      workplaces:[],
      workplace:""
    }
    this.onWorkplaceChange=this.onWorkplaceChange.bind(this);
  }

  onWorkplaceChange(event, data){
    this.setState({workplace:data.value});
    this.props.formCallBack({workplace: data.value});
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


      if(!this.state.workplaces.length){
        /// add positions into state parameter
      
      let workplacesArray=this.props.data.allWorkplaces.nodes;
      workplacesArray.forEach(function(workplace,index) {
        this.state.workplaces.push({
          text:workplace.workplaceName,
          value:workplace.id,
          key:workplace.id
        })
      }, this);
    }
    }

    return(

    <div>
    { !this.props.workplace && <Dropdown placeholder="Select Workplace" fluid selection
      options={this.state.workplaces} style={{ marginTop:'-2%', fontColor: "#838890"}} onChange={this.onWorkplaceChange}  /> }

    { this.props.workplace && <Dropdown defaultValue={this.props.workplace} fluid selection
      options={this.state.workplaces} style={{ marginTop:'-2%', fontColor: "#838890"}} onChange={this.onWorkplaceChange}  /> }

    </div>

    );
  }
}

const getAllWorkplaces = gql`
  query getAllWorkplacesQuery($brandId: Uuid!, $corporationId: Uuid!) {
    allWorkplaces (condition: {brandId: $brandId, corporationId: $corporationId}) {
      nodes{
        workplaceName,
        id
      }
    }
}`

const GetWorkplaces = graphql(getAllWorkplaces , {
  options: (ownProps) => ({
    variables: {
      brandId: localStorage.getItem('brandId'),
      corporationId: localStorage.getItem('corporationId')
    }
  })})(WorkplaceSelector)
export default GetWorkplaces
