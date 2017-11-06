import React from 'react';
import { Image } from 'semantic-ui-react';

const memberCard = (props) => {
  const user = props.user;
  return (
    <div className="teamMemberOption option">
      <div className="avatar">
        <Image src={user.avatarUrl} alt="avatar" />
      </div>
      <div className="label">
        <b>{user.firstName}</b> <span>{user.lastName}</span> <br />
        <span className="description"> Seniority: { user.seniority || `` }</span>
         <br />
      </div>
    </div>
  );
};

export default memberCard;
