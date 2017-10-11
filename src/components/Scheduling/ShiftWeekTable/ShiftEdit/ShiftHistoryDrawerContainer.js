import React, { Component } from 'react';
import { gql, graphql, compose } from 'react-apollo';
import ShiftHistoryDrawer from './ShiftHistoryDrawer';
import ShiftHistoryNonSortDrawer from './ShiftHistoryNonSortDrawer';
var Halogen = require('halogen');

class ShiftHistoryDrawerContainerComponent extends Component {
  constructor(props) {
    super(props);
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.data.loading && nextProps.data.allMarkets) {
      const MarketsData = nextProps.data;
      this.setState({MarketsData});
    }
  }

  render() {
    if (this.props.data.loading) {
      return (<div></div>);
    }
    if (this.props.open) {
      const { isSorted } = this.props;

      return (
        isSorted ?
          <ShiftHistoryDrawer
            shift={this.props.shift}
            users={this.props.users}
            open={this.props.open}
            handleBack={this.props.handleBack}
            handlerClose={this.props.handlerClose}
            handleHistory={this.props.handleHistory}
            phoneTree={this.props.phoneTree} />
           :
          <ShiftHistoryNonSortDrawer
            open={this.props.open}
            shift={this.props.shift}
            users={this.props.users}
            handleBack={this.props.handleBack}
            handlerClose={this.props.handlerClose}
            handleHistory={this.props.handleHistory}
            MarketsData={this.state.MarketsData}/>
      )
    } else {
      return (
        <div></div>
      )
    }
  }
}

const allMarkets = gql`
query allMarkets($shiftId: Uuid!) {
    allMarkets(condition: {shiftId: $shiftId }) {
            nodes {
              id
              workerId
              shiftId
              shiftExpirationDate
              isTexted
              isCalled
              isBooked
              isEmailed
              isPhoneAnswered
              workerResponse
              marketRulesByMarketId {
                nodes {
                  ruleByRuleId {
                    ruleName
                  }
                }
              }
            }
          }
  }`;

const ShiftHistoryDrawerContainer = graphql(allMarkets, {
  options: (ownProps) => ({
    variables: {
      shiftId: ownProps.shift && ownProps.shift.id
    }
  }),
})(ShiftHistoryDrawerContainerComponent);

export default ShiftHistoryDrawerContainer;
