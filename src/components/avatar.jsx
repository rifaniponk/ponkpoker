import React from 'react';

const AvatarImg = ({id, size}) => {
  const src = `https://api.adorable.io/avatars/${size}/${id}`;
  const bd = (15 / 100 * size) + 'px';
  return (
    <img src={src} alt="avatar" style={{borderRadius: bd}} />
  );
};

export default AvatarImg;
