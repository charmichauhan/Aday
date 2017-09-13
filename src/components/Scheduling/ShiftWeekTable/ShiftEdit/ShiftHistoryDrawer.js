import React, { Component } from 'react'
import Drawer from 'material-ui/Drawer';
import Paper from 'material-ui/Paper';
import { find, pick } from 'lodash';
import { Header, Grid, GridColumn, Icon, Dropdown, Image } from 'semantic-ui-react';
import FlatButton from 'material-ui/FlatButton';
import { gql, graphql } from 'react-apollo';
import { Icon as Icon2 } from 'antd';
import { SortableContainer, SortableElement, arrayMove } from 'react-sortable-hoc';

import CircleButton from '../../../helpers/CircleButton';
import Loading from '../../../helpers/Loading';

const styles = {
  paperStyle: {
    borderRadius: 6
  }
};

const unassignedTeamMember = {
  user: {
    id: 0,
    firstName: 'Unassigned',
    lastName: '',
    avatarUrl: 'http://www.iiitdm.ac.in/img/bog/4.jpg',
  },
  content: 'There is currenlty an open position',
  status: 'unassigned'
};

const User = ({ user }) => (
  <div className="content">
    <div className="avatar">
      <Image avatar src={user.avatarUrl} />
    </div>
    <div className="label font18 text-uppercase">
      <b>{user.firstName}</b> {user.lastName}
    </div>
  </div>
);

const SortableItem = SortableElement(({ history, index }) =>
  (
    <Paper style={styles.paperStyle}
           zDepth={1}
           key={index}
           className="content-row">
      <Grid>
        <GridColumn width={1}>
          <div className="wrapper-element text-left">
            <Dropdown
              name="more-options"
              icon='fa-ellipsis-v'
              className="dropdown-team">
              <Dropdown.Menu>
                <Dropdown.Item>
                  <Dropdown pointing="left" text="CONTACT HISTORY">
                    <Dropdown.Menu>
                      <Dropdown.Item>
                        <div className="called sub-menu">
                                  <span className="phn-icon">
                                    <i className="fa fa-phone"></i>
                                  </span>
                          <span className="tick">
                                    <Icon2 type="check" />
                                  </span>
                          <span className="text text-uppercase">
                                    Called 12:49 am
                                  </span>
                        </div>
                      </Dropdown.Item>
                      <Dropdown.Item>
                        <div className="called sub-menu">
                                  <span className="msg-icon">
                                    <Icon2 type="message" />
                                  </span>
                          <span className="tick">
                                    <Icon2 type="close" />
                                  </span>
                          <span className="text text-uppercase">
                                    Text Disabled
                                  </span>
                        </div>
                      </Dropdown.Item>
                      <Dropdown.Item>
                        <div className="called sub-menu">
                                  <span className="phn-icon">
                                    <Icon2 type="mobile" />
                                  </span>
                          <span className="tick">
                                    <Icon2 type="check" />
                                  </span>
                          <span className="text text-uppercase">
                                    Seen 12:49 am
                                  </span>
                        </div>
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </Dropdown.Item>
                <Dropdown.Item>
                  <Dropdown pointing="left" text="JUSTIFICATION">
                    <Dropdown.Menu>
                      <Dropdown.Item>Called</Dropdown.Item>
                      <Dropdown.Item>Texted</Dropdown.Item>
                      <Dropdown.Item>Seen</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </GridColumn>
        <GridColumn width={4} className="history-name">
          <div className="wrapper-element text-left">
            <User user={history.worker} />
          </div>
        </GridColumn>
        <GridColumn width={2}>
          <div className="wrapper-element text-center">
            <p className="history-text font20">{history.seniority || '0001'}</p>
            <p className="history-text font14 text-uppercase light-gray-text">Seniority</p>
          </div>
        </GridColumn>
        <GridColumn width={2}>
          <div className="wrapper-element text-center">
            <p className="history-text font20">{history.ytdot || '0424'}</p>
            <p className="text-uppercase font14 history-text light-gray-text">YTD OT</p>
          </div>
        </GridColumn>
        <GridColumn width={1}>
          <div className="wrapper-element">
            <Image src="/images/Sidebar/tick.png" className="history-img" />
            <span className="text-uppercase">Accepted</span>
          </div>
        </GridColumn>
        <GridColumn width={1}>
          <div className="wrapper-element">
            <Icon2 type="up-circle-o" />
          </div>
        </GridColumn>
        <GridColumn width={3}>
          <div className="wrapper-element text-center">
            <p className="text-uppercase font20 history-text blue-text">0001</p>
            <p className="text-uppercase font14">Award Order</p>
          </div>
        </GridColumn>
        <GridColumn width={1}>
          <div className="wrapper-element">
            <Icon2 type="down-circle-o" />
          </div>
        </GridColumn>
        <GridColumn width={1}>
          <div className="wrapper-element">
            <Image src="/images/Sidebar/draggable.png" className="history-img" />
          </div>
        </GridColumn>
      </Grid>
    </Paper>)
);

const SortableList = SortableContainer(({ historyDetails }) => {
  return (
    <div>
      {historyDetails.map((history, index) => <SortableItem index={index} history={history} />)}
    </div>
  );
});

class ShiftHistoryDrawerComponent extends Component {
  constructor(props) {
    super(props);
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.data.loading && nextProps.data.allMarkets) {
      const historyDetails = this.getInitialData(nextProps.data);
      this.setState({ historyDetails });
    }
  }

  getInitialData = ({ allMarkets = [] }) => {
    const marketsByShiftId = allMarkets.nodes.map((shiftMarket = {}) => {
      const market = { ...shiftMarket };
      if (market.workerId) {
        market.worker = this.getUserById(market.workerId, true);
      }
      else {
        market.worker = unassignedTeamMember;
      }
      market.rules = (market.marketRulesByMarketId && market.marketRulesByMarketId.nodes) || [];
      market.showDetails = false;
      market.notes = [
        {
          title: `${market.worker.firstName} did not receive this shift because:`,
          points: [
            'Hourly Limit Exceeded',
            'Less Siniority'
          ]
        }
      ];

      return market;
    });

    return marketsByShiftId;
  };

  getUserById = (id) => {
    const users = this.props.users;
    let foundWorker = find(users.allUsers.edges, (user) => user.node.id === id);
    if (!foundWorker) foundWorker = { node: unassignedTeamMember.user };
    return pick(foundWorker.node, ['id', 'avatarUrl', 'firstName', 'lastName']);
  };

  handleBack = () => {
    this.props.handleHistory();
    this.props.handleBack();
  };

  showDetails = (historyDetails, i) => {
    historyDetails[i].showDetails = !historyDetails[i].showDetails;
    this.setState({ historyDetails });
  };

  onSortEnd = ({ oldIndex, newIndex }) => {
    this.setState({
      historyDetails: arrayMove(this.state.historyDetails, oldIndex, newIndex),
    });
  };

  render() {
    const {
      width = 750,
      open,
      openSecondary = true,
      docked = false
    } = this.props;

    if (this.props.data.loading) {
      return (<Loading />)
    }

    const { historyDetails } = this.state;

    return (
      <Drawer docked={docked} width={width} openSecondary={openSecondary} onRequestChange={this.handleCloseDrawer}
              open={open}>
        <div className="drawer-section brand-drawer-section">
          <div className="drawer-heading drawer-head col-md-12">

            <FlatButton label="Back" onClick={this.handleBack}
                        icon={<Icon name="chevron left" className="floatLeft" /> } />
            <Header as='h2' textAlign='center'>
              Shift History
            </Header>

          </div>
          <div className="drawer-content history-drawer-content">
            <SortableList historyDetails={historyDetails} onSortEnd={this.onSortEnd} />
          </div>
        </div>
        <div className="drawer-footer">
          <div className="buttons text-center">
            <CircleButton type="white" title="GO BACK" handleClick={this.handleBack} />
          </div>
        </div>
      </Drawer>
    );
  };
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

const ShiftHistoryDrawer = graphql(allMarkets, {
  options: (ownProps) => ({
    variables: {
      shiftId: ownProps.shift && ownProps.shift.id
    }
  }),
})(ShiftHistoryDrawerComponent);

export default ShiftHistoryDrawer;
