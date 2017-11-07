import React, { Component } from 'react'
import Drawer from 'material-ui/Drawer';
import { find, pick } from 'lodash';
import { Header, Icon, Table, Image, List } from 'semantic-ui-react';
import FlatButton from 'material-ui/FlatButton';
import { gql, withApollo } from 'react-apollo';

import Loading from '../../../helpers/Loading';
import CircleButton from '../../../helpers/CircleButton';

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
    <div className="label text-uppercase">
      <b>{user.firstName}</b> {user.lastName}
    </div>
  </div>
);

class ShiftHistoryNonSortDrawer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      historyDetails: [],
    }
  }

  componentWillMount() {
    this.getMarkets();
  }

  getMarkets = () => {
    this.setState({ loading: true });
    this.props.client.query({
      query: allMarkets,
      variables: { shiftId: this.props.shift && this.props.shift.id }
    }).then((res) => {
      if (res.data) {
        const historyDetails = this.getInitialData(res.data);
        this.setState({ loading: false, MarketsData: res.data, historyDetails });
      }
    }).catch(err => console.log('An error occurred, err: ', err));
  };

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

  showDetails = ( historyDetails, i) => {
    historyDetails[i].showDetails = !historyDetails[i].showDetails;
    this.setState({ historyDetails });
  };

  render() {
    const {
      width = 600,
      open,
      openSecondary = true,
      docked = false
    } = this.props;

    const { loading, historyDetails } = this.state;

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
            <Table structured className="history-table">
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell></Table.HeaderCell>
                  <Table.HeaderCell width={16}></Table.HeaderCell>
                  <Table.HeaderCell width={6}>Seniority</Table.HeaderCell>
                  <Table.HeaderCell width={6}>Accepted</Table.HeaderCell>
                  <Table.HeaderCell width={4}>
                    <Icon color='gray' name='mail' size='large' />
                  </Table.HeaderCell>
                  <Table.HeaderCell width={4}>
                    <Icon color='gray' name='comment' size='large' />
                  </Table.HeaderCell>
                  <Table.HeaderCell width={4}>
                    <Icon color='gray' name='call' size='large' />
                  </Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              {loading && <div style={{ width: 200, marginTop: 10 }}><Loading /></div>}
              {historyDetails && historyDetails.map((history, i) => (
                <Table.Body key={i}>
                  <Table.Row onClick={() => this.showDetails( historyDetails, i)}>
                    <Table.Cell>
                      <Icon name={history.showDetails ? 'chevron down' : 'chevron up'} />
                    </Table.Cell>
                    <Table.Cell width={16} textAlign="left">
                      <User user={history.worker} />
                    </Table.Cell>
                    <Table.Cell width={6}>{history.seniority}</Table.Cell>
                    <Table.Cell textAlign='center' width={6}>
                      <Icon
                        color={history.workerResponse === 'NONE' ? 'black' : history.workerResponse === 'YES' ? 'green' : 'red'}
                        name={history.workerResponse === 'NONE' ? 'help' : history.workerResponse === 'YES' ? 'checkmark' : 'remove'}
                        size='large' />
                    </Table.Cell>
                    <Table.Cell width={4}>
                      <Icon
                        color={history.isEmailed ? 'green' : 'red'}
                        name={history.isEmailed ? 'checkmark' : 'remove'}
                        size='large' />
                    </Table.Cell>
                    <Table.Cell textAlign='center' width={4}>
                      <Icon
                        color={history.isTexted ? 'green' : 'red'}
                        name={history.isTexted ? 'checkmark' : 'remove'}
                        size='large' />
                    </Table.Cell>
                    <Table.Cell textAlign='center' width={4}>
                      <Icon
                        color={history.isCalled ? 'green' : 'red'}
                        name={history.isCalled ? 'checkmark' : 'remove'}
                        size='large' />
                    </Table.Cell>
                  </Table.Row>
                  <Table.Row className={(history.showDetails && 'show-details') || 'hide-details'}>
                    <Table.Cell className="shiftDetailRow" colSpan={8}>
                      {history.notes.map((note, k) => (
                        <div key={k}>
                          <p>{note.title}</p>
                          <List bulleted>
                            {note.points.map((p, j) => (
                              <List.Item key={j}>{p}</List.Item>
                            ))}
                          </List>
                        </div>
                      ))}
                    </Table.Cell>
                  </Table.Row>
                </Table.Body>)
              )}
            </Table>
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

export default withApollo(ShiftHistoryNonSortDrawer);
