import React,{Component} from 'react';
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

import {Dropdown,Loader} from 'semantic-ui-react';

export class PositionSelector extends Component{
  static propTypes = {
    workplaceId: React.PropTypes.string,
    data: React.PropTypes.shape({
      loading: React.PropTypes.bool,
      error: React.PropTypes.object,
    }).isRequired,
  }

  constructor(props){
    super(props);
    const {formCallBack}=this.props;
    this.onPositionChange=this.onPositionChange.bind(this);
  }

  onPositionChange(event, data){
    this.setState({position:data.value});
    this.props.formCallBack({position:data.value});
  }
  render(){
    if (this.props.data.loading) {
      return (
      <Loader active inline='centered' />
      )
    }
    let positionsArray = [];
    if (this.props.data.error) {
      console.log(this.props.data.error)
      return (<div>An unexpected error occurred</div>)
    }else{
      // construct array of positions for dropdown
      positionsArray=this.props.data.fetchRelevantPositions.nodes;
      positionsArray = positionsArray.filter((p) => p.exchangeLevel != "WORKPLACE_SPECIFIC" ||
                                                    p.workplaceId == this.props.workplaceId ||
                                                    this.props.workplaceId == "");
      positionsArray = positionsArray.map((position,index) => ({
          text:position.positionName,
          value:position.id,
          key:position.id
      }));
    }
    return(

    <div>
      <p style={{ fontSize:'18px',letterSpacing:'-1px',color:'#666666',lineHeight:'28px' }}>POSITION</p>
      { !this.props.position && <Dropdown placeholder="Select Position" fluid selection
            options={positionsArray} style={{ marginTop:'-2%' }} onChange={this.onPositionChange}  /> }

      { this.props.position && <Dropdown defaultValue={ this.props.position } fluid selection
            options={positionsArray} style={{ marginTop:'-2%' }} onChange={this.onPositionChange}  /> }

    </div>

    );
  }
}

const getAllPositions = gql`
  query fetchRelevantPositions ($workplaceId: Uuid, $brandId: Uuid!, $corporationId: Uuid!) {
    fetchRelevantPositions (workplaceid: $workplaceId, brandid: $brandId, corporationid: $corporationId) {
      nodes{
        positionName,
        id,
        exchangeLevel,
        workplaceId
      }
    }
  }
`

const workplaceId = localStorage.getItem(workplaceId)
const GetPositions = graphql(getAllPositions, {
  options: (ownProps) => ({
    variables: {
      workplaceId: workplaceId == "" ? null : workplaceId,
      brandId:localStorage.getItem('brandId'),
      corporationId:localStorage.getItem('corporationId'),
    }
  }),
})(PositionSelector)
export default GetPositions
