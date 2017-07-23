import React,{Component} from 'react';
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

import {Dropdown,Loader} from 'semantic-ui-react';

export class PositionSelector extends Component{
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
      positions:[]
    }
    this.onPositionChange=this.onPositionChange.bind(this);
  }

   onPositionChange(event, data){
    const {formCallBack}=this.props
    console.log(event,data);
    this.setState({position:data.value});
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
      if(!this.state.positions.length){
        // add positions into state parameter
      let positionsArray=this.props.data.allPositions.nodes;
      console.log(positionsArray,positionsArray.length);
      positionsArray.forEach(function(position,index) {
        this.state.positions.push({
          text:position.positionName,
          value:position.id,
          key:position.id
        })
      }, this);
    }
    }
  

    return(
 
    <div>
      <p style={{ fontSize:'18px',letterSpacing:'-1px',color:'#666666',lineHeight:'28px' }}>POSITION</p>
      <Dropdown  placeholder='Select Postion' fluid selection options={this.state.positions} style={{ marginTop:'-2%' }} onChange={this.onPositionChange}  />
  
    </div>
           
    );
  }
}

const getAllPositions = gql`
  query getAllPositionsQuery {
  allPositions {
    nodes{
      positionName,
      id
    }
  }
}
`


const GetPositions = graphql(getAllPositions)(PositionSelector)
export default GetPositions
