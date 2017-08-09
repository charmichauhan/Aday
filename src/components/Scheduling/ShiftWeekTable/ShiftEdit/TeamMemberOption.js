import React from 'react';
import { Image } from 'semantic-ui-react';

const memberCard = (props) => {
  const user = props.user;
  return (
    <div className="teamMemberOption option">
      <div className="avatar">
        <Image src={user.avatar} alt="avatar" />
      </div>
      <div className="label">
        <b>{user.firstName}</b> <span>{user.otherNames}</span> <br />
        <span className="description">{user.description || `Current hours: 20 . You've earned 1 credit`}</span>
      </div>
    </div>
  );
};

export default memberCard;
