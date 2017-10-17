import React, { Component } from 'react';
import { gql, graphql, withApollo } from 'react-apollo';
import ShiftHistoryDrawer from './ShiftHistoryDrawer';
import ShiftHistoryNonSortDrawer from './ShiftHistoryNonSortDrawer';

const allMarkets = gql`
  query allMarkets($shiftId: Uuid!) {
    allMarkets (condition: { shiftId: $shiftId }) {
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

class ShiftHistoryDrawerContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    if (!this.props.isSorted) this.getMarkets();
  }

  getMarkets = () => {
    this.props.client.query({
      query: allMarkets,
      variables: { shiftId: this.props.shift && this.props.shift.id }
    }).then((res) => {
      if (res.data) {
        this.setState({ MarketsData: res.data });
      }
    }).catch(err => console.log('An error occurred, err: ', err));
  };

  render() {
    if (!this.state.MarketsData && !this.props.isSorted) {
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

export default withApollo(ShiftHistoryDrawerContainer);
