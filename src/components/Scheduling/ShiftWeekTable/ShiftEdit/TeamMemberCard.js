import React, { Component } from 'react';
import { Image, Icon, Dropdown } from 'semantic-ui-react';

export default class TeamMemberCard extends Component {
	render() {
		const { avatar, firstName, id, otherNames, content, color, users, handleRemove, onSelectChange } = this.props;
		return (
			<div className="teamMemberCard">
				<div className="edits">
					<Icon name="close" onClick={handleRemove}/>
				</div>
        <Dropdown
          trigger={<div className={"content "+color}>
            <div className="avatar">
              <Image src={avatar}/>
            </div>
            <div className="label">
              <b>{firstName}</b> {otherNames} <br/>
              <span className="description">{ content }</span>
            </div>
          </div>}
          icon='dropdown-img-black'
          fluid
          id={id}
          className="dropdown-team">
          <Dropdown.Menu fluid>
            {users && users.map((user, index) => (
              <Dropdown.Item value={index} onClick={() => onSelectChange(user, id)}>
                <img src={user.avatar} className="select-dropdown-img" />
                <span>{user.firstName + ' ' + user.otherNames}</span>
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
			</div>
		);
	}
}
