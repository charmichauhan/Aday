import React, { Component } from 'react';
import { Image, Dropdown } from 'semantic-ui-react';
import TeamMemberOption from './TeamMemberOption';

const automatedShift = {
  id: 0,
  firstName: 'Automate Shift',
  lastName: '',
  avatarUrl: 'https://s3.us-east-2.amazonaws.com/aday-website/icons/time-lapse-red.png',
};

export default class TeamMemberCard extends Component {

  constructor(props) {
    super(props);
    const users = [ ...props.users];
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
    if (nextProps.isManager !== this.state.isManager) {
      const users = [ ...nextProps.users];
      if (!nextProps.isManager) {
        users.unshift(automatedShift);
      }
      this.setState({ isManager: nextProps.isManager, users: nextProps.users });
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
    const { avatarUrl, firstName, id, lastName, content, color, handleRemove } = this.props;
    const { userOptions, searchText } = this.state;
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
          forceSelection={false}
          onOpen={this.onDropDownOpen}
          trigger={<div className={'content ' + color}>
            <div className="avatar">
              <Image src={avatarUrl} alt="avatar" />
            </div>
            <div className="label">
              <span className="firstName">{firstName} </span><span className="lastName">{lastName}</span><br />
              <span className="description">{ content }</span>
              {/* the break below puts the employee's name near top of card */}
              <br />
            </div>
          </div>}
          icon='dropdown-img-black'
          fluid
          id={id}
          className="dropdown-team">
          <Dropdown.Menu fluid>
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
