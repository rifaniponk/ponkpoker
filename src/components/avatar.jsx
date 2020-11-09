import React from 'react';
import {AvatarGenerator} from 'random-avatar-generator';

const AvatarImg = ({id, size}) => {
  const generator = new AvatarGenerator();
  const src = generator.generateRandomAvatar(id);

  return <img src={src} alt="avatar" style={{width: size + 'px'}} />;
};

export default AvatarImg;
