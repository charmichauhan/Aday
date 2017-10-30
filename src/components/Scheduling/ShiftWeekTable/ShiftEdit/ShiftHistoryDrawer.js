import React, { Component } from 'react';
import Drawer from 'material-ui/Drawer';
import Paper from 'material-ui/Paper';
import moment from 'moment';
import rp from 'request-promise';
import { find, pick, orderBy, findIndex } from 'lodash';
import { Header, Grid, GridColumn, Icon, Dropdown, Image, Checkbox } from 'semantic-ui-react';
import FlatButton from 'material-ui/FlatButton';
import { gql, graphql } from 'react-apollo';
import { Icon as Icon2 } from 'antd';
import { SortableContainer, SortableElement, arrayMove } from 'react-sortable-hoc';
import CircleButton from '../../../helpers/CircleButton';
import Loading from '../../../helpers/Loading';
var Halogen = require('halogen');

const styles = {
  paperStyle: {
    borderRadius: 6,
    zIndex: 99999
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

const SortableItem = SortableElement(({ history, awardorder, index, historyLen, that }) =>
  (
    <Paper style={styles.paperStyle}
           zDepth={1}
           key={index}
           className="content-row shift-history">
      <Grid>
        <GridColumn width={2} className="white-space">
          <text className="innerCircle">{index}</text>
        </GridColumn>
        <GridColumn width={4}>
          <div className="wrapper-element text-left username">
            <User user={history} />
          </div>
        </GridColumn>
        <GridColumn width={2}>
          <div className="wrapper-element text-center">
            <p className="history-text font20">{that.numberFormatter(history.seniority)}</p>
            <p className="history-text font14 text-uppercase light-gray-text">Seniority</p>
          </div>
        </GridColumn>
        <GridColumn width={2}>
          <div className="wrapper-element text-center">
            <p
              className="history-text font20">{that.numberFormatter(history.ytdOvertimeHours > 0 ? history.ytdOvertimeHours : 0)}</p>
            <p className="text-uppercase font14 history-text light-gray-text">YTD OT</p>
          </div>
        </GridColumn>
        <GridColumn width={2}>
          <div className="wrapper-element text-center">
            <Checkbox checked={history.isChecked} name={history.id} value={history}
                      onChange={(e, history) => that.toggle(e, history)} />
            <p className="text-uppercase font14 history-text light-gray-text">INCLUDE</p>
          </div>
        </GridColumn>
        <GridColumn width={1}>
          <div className="wrapper-element text-center" onClick={() => that.navigateUser(awardorder,"UP", 0)} style={{cursor: "pointer"}}>
             <Image src="/images/Sidebar/up-arrow.png" className="history-img" size="mini" />
          </div>
        </GridColumn>
        <GridColumn width={2}>
          <div className="wrapper-element text-center">
            <p className="history-text font20">{that.numberFormatter(awardorder + 1)}</p>
            <p className="text-uppercase font14 history-text light-gray-text">AWARD ORDER</p>
          </div>
        </GridColumn>
        <GridColumn width={2} className="down-arrow">
          <div className="wrapper-element text-center">
            <div className="wrapper-element text-center" onClick={() => that.navigateUser(awardorder,"DOWN",historyLen - 1)} style={{cursor: "pointer"}}>
              <Image src="/images/Sidebar/down-arrow.png" className="history-img" size="mini" />
            </div>
          </div>
        </GridColumn>
        <GridColumn width={1}>
          <div className="wrapper-element text-right">
            <Image src="/images/Sidebar/draggable.png" className="history-img" />
          </div>
        </GridColumn>
      </Grid>
    </Paper>)
);

const SortableList = SortableContainer(({ historyDetails, that }) => {
  return (
    <div>
      {historyDetails.map((history, index) => <SortableItem index={index} awardorder={index} history={history} historyLen={historyDetails.length}
                                                            that={that} />)}
    </div>
  );
});

class ShiftHistoryDrawerComponent extends Component {

  constructor(props) {
    super(props);
    this.state = {
      checked: false,
      counter: 0,
      filteredData: [],
      includedData: []
    }
  }

  componentWillMount() {
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.filteredData.length < 1 || this.props.allEmployees.loading !== nextProps.allEmployees.loading) {
      console.log(nextProps.allEmployees);
      const allUsers = nextProps.allEmployees;
      const usersCropped = this.props.users;
      var userData = usersCropped.map(function (userId, i) {
        console.log(userId)
        let foundWorker = find(allUsers.allEmployees.edges, (user) => user.node.userId === userId);
        console.log(foundWorker);
        if (!foundWorker) foundWorker = { node: unassignedTeamMember.user };
        var newFoundWorker = {
          ...foundWorker.node.userByUserId,
          hireDate: foundWorker.node.hireDate,
          isChecked: true
        };
        return pick(newFoundWorker, ['id', 'avatarUrl', 'firstName', 'lastName', 'hireDate', 'ytdOverTimeHours', 'isChecked']);
      });

      allUsers.allEmployees.edges.map
      let sortedEmployees = orderBy(allUsers.allEmployees.edges,  (user) => user.node.hireDate, ['asc']);

      let sortedSeniority = {} 

      sortedEmployees.map((values, index) => {
        sortedSeniority[values.node.userByUserId.id] = index + 1;
      });

      let filteredData = userData.map((values, index) => {
        return { ...values, seniority: sortedSeniority[values.id] };
      });

      this.setState({ filteredData: filteredData });
    }
  }

  handleBack = () => {
    this.props.handleHistory();
    this.props.handleBack();
  };

  navigateUser = (index, navi, len) => {
    if(navi === "UP" && index > 0)
      this.onSortEnd({oldIndex : index, newIndex : index - 1});
    else if(index < len)
      this.onSortEnd({oldIndex : index, newIndex : index + 1});
  };

  onSortEnd = ({ oldIndex, newIndex }) => {
    this.setState({
      filteredData: arrayMove(this.state.filteredData, oldIndex, newIndex)
    });
    this.props.phoneTree(this.state.filteredData)
  };

  toggle = (e, history) => {
    const { filteredData } = this.state;
    let foundIndex = findIndex(filteredData, { id: history.value.id });
    filteredData[foundIndex].isChecked = !filteredData[foundIndex].isChecked;
    this.setState({ filteredData }, this.filterDataCallBack);
  };

  filterDataCallBack = () => {
    let array = [];
    this.state.filteredData.map(obj => {
      if (obj.isChecked) {
        array.push(obj.id)
      }
    });
    this.props.phoneTree(array);
  };

  numberFormatter = (num) => {
    var str = '' + num;
    var pad = '0000';
    return pad.substring(0, pad.length - str.length) + str;
  };

  render() {
    if (this.props.allEmployees.loading) {
      console.log(this.props.allEmployees);
      return (<div><Halogen.SyncLoader color='#00A863' /></div>)
    }

    console.log(this.props.allEmployees);

    const {
      width = 750,
      open,
      openSecondary = true,
      docked = false
    } = this.props;

    const actionTypes = [];


    const actions = actionTypes.map((action, index) =>
      (<CircleButton key={index} type={action.type} title={action.title} handleClick={action.handleClick}
                     image={action.image} imageSize={action.imageSize} />)
    );

    return (
      <Drawer docked={docked} width={width} openSecondary={openSecondary} onRequestChange={this.handleCloseDrawer}
              open={open}>
        <div className="drawer-section brand-drawer-section">
          <div className="drawer-heading drawer-head col-md-12">

            <FlatButton label="Back" onClick={this.handleBack}
                        icon={<Icon name="chevron left" className="floatLeft" /> } />
            <Header as='h2' textAlign='center'>
              Phone Tree
            </Header>

          </div>
          <div className="drawer-content history-drawer-content">
            <SortableList historyDetails={this.state.filteredData} that={this} onSortEnd={this.onSortEnd}
                          pressDelay={200} />
          </div>
        </div>
        <div className="drawer-footer">
          <div className="buttons text-center">
            {actions}
          </div>
        </div>
      </Drawer>
    );
  }

}

const allEmployees = gql`
  query allEmployees($corp: Uuid!) {
    allEmployees(condition:{corporationId: $corp}){
      edges {
        node {
          hireDate
          ytdOvertimeHours
          userId
          userByUserId {
            id
            firstName
            lastName
            avatarUrl
          }
        }
      }
    }
  }`;

/*
 <GridColumn width={2}>
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
 <Icon2 type="check"/>
 </span>
 <span className="text text-uppercase">
 Called 12:49 am
 </span>
 </div>
 </Dropdown.Item>
 <Dropdown.Item>
 <div className="called sub-menu">
 <span className="msg-icon">
 <Icon2 type="message"/>
 </span>
 <span className="tick">
 <Icon2 type="close"/>
 </span>
 <span className="text text-uppercase">
 Text Disabled
 </span>
 </div>
 </Dropdown.Item>
 <Dropdown.Item>
 <div className="called sub-menu">
 <span className="phn-icon">
 <Icon2 type="mobile"/>
 </span>
 <span className="tick">
 <Icon2 type="check"/>
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
 <Image src="/images/Sidebar/tick.png" className="history-img"/>
 <span className="text-uppercase">Accepted</span>
 </div>
 </GridColumn>
 <GridColumn width={1}>
 <div className="wrapper-element">
 <Icon2 type="up-circle-o"/>
 </div>
 </GridColumn>
 <GridColumn width={3}>
 <div className="wrapper-element text-center">
 <p className="text-uppercase font20 history-text blue-text">0001</p>
 <p className="text-uppercase font14">Award Order</p>
 </div>
 </GridColumn>
 <div className="wrapper-element">
 <Icon2 type="down-circle-o"/>
 </div>
 */

const ShiftHistoryDrawer = graphql(allEmployees, {
  options: (ownProps) => ({
    variables: {
      corp: localStorage.getItem('corporationId'),
    },
  }),
  name: 'allEmployees'
})
(ShiftHistoryDrawerComponent);
export default ShiftHistoryDrawer;
