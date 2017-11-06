import React, { Component } from 'react';
import { Image, Dropdown } from 'semantic-ui-react';
import TeamMemberOption from './TeamMemberOption';
import { gql, graphql } from 'react-apollo';
import { orderBy } from 'lodash';
import {Loader} from 'semantic-ui-react';

const automatedShift = {
  id: 0,
  firstName: 'Automate Shift',
  lastName: '',
  avatarUrl: 'https://s3.us-east-2.amazonaws.com/aday-website/icons/time-lapse-red.png',
};

class TeamMemberCardComponent extends Component {

  constructor(props) {
    super(props);
    const users = [ ...props.users];
    const position = [ ...props.position ]
    if (!props.isManager) {
      users.unshift(automatedShift);
    }
    this.state = {
      searchText: '',
      isManager: props.isManager,
      users
    }
  }

  componentWillReceiveProps(nextProps) {
    let users = []

    if(nextProps.allEmployees.loading == false) {

      let sortedEmployees = orderBy(nextProps.allEmployees.allEmployees.edges,  (user) => user.node.hireDate, ['asc']);
      sortedEmployees.map( function(user, i) {

          if (user.node && user.node.userByUserId.jobsByUserId.nodes.length > 0){
            let userHash = {}
            userHash["id"] = user.node.userId
            userHash["firstName"] = user.node.userByUserId.firstName
            userHash["lastName"] = user.node.userByUserId.lastName
            userHash["avatarUrl"] = user.node.userByUserId.avatarUrl
            
            var seniority = i + 1
            var str = '' + seniority;
            var str2 = '' + user.node.ytdOvertimeHours
            var pad = '0000';
            userHash["seniority"] = pad.substring(0, pad.length - str.length) + str;
            userHash["ytd"] = pad.substring(0, pad.length - str2.length) + str2;
            users.push(userHash)
          }
        } 
      )
      this.setState({ users: users });
    } 
    
    if (nextProps.isManager !== this.state.isManager) {
      if (users.length == 0) {
         users = [ ...nextProps.users];
      }
      if (!nextProps.isManager) {
        users.unshift(automatedShift);
      }
      this.setState({ isManager: nextProps.isManager, users: users });
    }
  }

  onDropDownOpen = () => {
    this.searchField.focus();
    this.setState({ userOptions: [...this.state.users] });
  };

  onSelectChange = (user, id) => {
    this.props.onSelectChange(user, id);
    this.setState({ searchText: '' });
  };

  searchChange = (event, value) => {
    this.setState({
      searchText: value,
      userOptions: this.state.users.filter(user =>
      new RegExp(value.toLowerCase(), 'g').test(user.firstName.toLowerCase()) ||
      new RegExp(value.toLowerCase(), 'g').test(user.lastName.toLowerCase()))
    });
  };

  render() {
    const { avatarUrl, firstName, id, lastName, content, color, handleRemove, seniority, ytd } = this.props;
    const { userOptions, searchText } = this.state;

    if(this.props.allEmployees.loading) {
      return(<Loader active inline='centered' />)
    }

    return (
      <div className="teamMemberCard">
        <div className="edits">
          <Image
               src="https://s3.us-east-2.amazonaws.com/aday-website/icons/exit-x.png"
               height="15"
               width="15"
               floated='left'
               onClick={handleRemove}
               style={{marginLeft:7, cursor:'pointer'}}
          />
        </div>
        <Dropdown
          placeholder="Team Member"
          name="team-member"
          ref="userDropDown"
          scrolling={true}
          forceSelection={false}
          onOpen={this.onDropDownOpen}
          trigger={<div className={'content ' + color}>
            <div className="avatar">
              <Image src={avatarUrl} alt="avatar" />
            </div>
            <div className="label">
              <span className="firstName">{firstName} </span><span className="lastName">{lastName}</span><br />
              {seniority && 
              <span className="description"> 
                Seniority: { seniority } -
                YTD OT: { ytd }
                </span>
              }
              {/* the break below puts the employee's name near top of card */}
              <br />
            </div>
          </div>}
          icon='dropdown-img-black'
          fluid
          id={id}
          className="dropdown-team">
          <Dropdown.Menu>
            <Dropdown.Item value="searchInput" onClick={(e) => {
              e.stopPropagation();
            }}>
              <input
                type="text"
                ref={(input) => this.searchField = input}
                autoFocus
                value={searchText}
                className="form-control"
                placeholder="Search member"
                onChange={(e) => this.searchChange(e.target, e.target.value)} />
            </Dropdown.Item>
            {userOptions && userOptions.map((user, index) => (
              <Dropdown.Item className="team-member-item" key={index} value={index} onClick={() => this.onSelectChange(user, id)}>
                <TeamMemberOption user={user} />
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
      </div>
    );
  }
}

const allEmployees = gql`
  query allEmployees($corp: Uuid!, $position: Uuid!) {
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
            jobsByUserId(condition: { positionId: $position, isPositionActive: true} ){
              nodes {
                id
              }
            }
          }
        }
      }
    }
  }`;

  const TeamMemberCard = graphql(allEmployees, {
  options: (ownProps) => ({
    variables: {
      corp: localStorage.getItem('corporationId'),
      position: ownProps.position || "0000-0000-0000-0000"
    },
  }),
  name: 'allEmployees'
})
(TeamMemberCardComponent);
export default TeamMemberCard;

