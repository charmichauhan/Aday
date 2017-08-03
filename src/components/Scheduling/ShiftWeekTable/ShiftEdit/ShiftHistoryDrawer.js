import React, { Component } from 'react'
import Drawer from 'material-ui/Drawer';
import { Header, Icon, Table, Image, List } from 'semantic-ui-react';
import FlatButton from 'material-ui/FlatButton';

import CircleButton from '../../../helpers/CircleButton';

const User = ({ user }) => (
  <div className="content">
    <div className="avatar">
      <Image avatar src={user.avatar} />
    </div>
    <div className="label text-uppercase">
      <b>{user.firstName}</b> {user.otherNames}
    </div>
  </div>
);

class ShiftHistoryDrawer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      shiftHistory: [
        {
          user: {
            firstName: 'Eric',
            otherNames: 'Wise',
            avatar: 'https://pickaface.net/assets/images/slides/slide2.png'
          },
          emailed: true,
          seniority: '0021',
          texted: true,
          called: false,
          replied: true,
          accepted: true,
          showDetails: false,
          notes: [
            {
              title: 'Ashley did not receive this shift because:',
              points: [
                'Hourly Limit Exceeded',
                'Less Siniority'
              ]
            }
          ]
        },
        {
          user: {
            firstName: 'Steve',
            otherNames: 'Nice',
            avatar: 'http://www.shieldnutra.com/wp-content/uploads/2015/02/Shield-Nutra-Steve-e1449597474132-300x300.jpg'
          },
          seniority: '0135',
          emailed: false,
          texted: true,
          called: true,
          replied: false,
          accepted: false,
          showDetails: false,
          notes: [
            {
              title: 'Ashley did not receive this shift because:',
              points: [
                'Hourly Limit Exceeded',
                'Less Siniority'
              ]
            }
          ]
        },
        {
          user: {
            firstName: 'Ashly',
            otherNames: 'Good',
            avatar: 'http://images2.fanpop.com/images/photos/4300000/Ashly-ashley-tisdale-4376203-282-229.jpg'
          },
          seniority: '0492',
          emailed: true,
          texted: true,
          called: true,
          replied: true,
          accepted: -1,
          showDetails: false,
          notes: [
            {
              title: 'Ashley did not receive this shift because:',
              points: [
                'Hourly Limit Exceeded',
                'Less Siniority'
              ]
            }
          ]
        },
        {
          user: {
            firstName: 'Lydia',
            otherNames: 'Watson',
            avatar: 'https://media.licdn.com/mpr/mpr/shrinknp_200_200/p/7/005/05c/3a5/0c4d159.jpg'
          },
          seniority: '0490',
          emailed: true,
          texted: true,
          called: true,
          replied: true,
          accepted: true,
          showDetails: false,
          notes: [
            {
              title: 'Ashley did not receive this shift because:',
              points: [
                'Hourly Limit Exceeded',
                'Less Siniority'
              ]
            }
          ]
        }
      ],
    }
  }

  handleBack = () => {
    this.props.handleHistory();
    this.props.handleBack();
  };

  showDetails = (i) => {
    const { shiftHistory } = this.state;
    shiftHistory[i].showDetails = !shiftHistory[i].showDetails;
    this.setState({ shiftHistory });
  };

  render() {
    const {
      width = 600,
      open,
      openSecondary = true,
      docked = false
    } = this.props;

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
              {this.state.shiftHistory && this.state.shiftHistory.map((history, i) => (
                <Table.Body key={i}>
                  <Table.Row>
                    <Table.Cell>
                      <Icon
                        name={history.showDetails ? 'chevron down' : 'chevron up'}
                        onClick={() => this.showDetails(i)} />
                    </Table.Cell>
                    <Table.Cell width={16} textAlign="left">
                      <User user={history.user} />
                    </Table.Cell>
                    <Table.Cell width={6}>{history.seniority}</Table.Cell>
                    <Table.Cell textAlign='center' width={6}>
                      <Icon
                        color={history.accepted === -1 ? 'black' : history.accepted ? 'green' : 'red'}
                        name={history.accepted === -1 ? 'help' : history.accepted ? 'checkmark' : 'remove'}
                        size='large' />
                    </Table.Cell>
                    <Table.Cell width={4}>
                      <Icon
                        color={history.emailed ? 'green' : 'red'}
                        name={history.emailed ? 'checkmark' : 'remove'}
                        size='large' />
                    </Table.Cell>
                    <Table.Cell textAlign='center' width={4}>
                      <Icon
                        color={history.texted ? 'green' : 'red'}
                        name={history.texted ? 'checkmark' : 'remove'}
                        size='large' />
                    </Table.Cell>
                    <Table.Cell textAlign='center' width={4}>
                      <Icon
                        color={history.called ? 'green' : 'red'}
                        name={history.called ? 'checkmark' : 'remove'}
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

export default ShiftHistoryDrawer;
