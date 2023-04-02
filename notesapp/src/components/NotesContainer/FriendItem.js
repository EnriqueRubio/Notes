import React from 'react';

const FriendItem = ({ friend, onClick }) => {
  return (
    <div className="friend-item" onClick={onClick}>
      <img
        src={friend.avatar.url ? friend.avatar.url : 'https://s3.eu-central-1.amazonaws.com/bootstrapbaymisc/blog/24_days_bootstrap/fox.jpg'}
        alt={friend.username}
        style={{ width: '50px', height: '50px', borderRadius: '50%', borderColor: 'black', borderWidth: '1px', borderStyle: 'solid', marginRight: '10px', marginBottom: '10px'}}
        />
    {friend.username}
    </div>
  );
};

export default FriendItem;
