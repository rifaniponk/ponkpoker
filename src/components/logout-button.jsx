import React from 'react';
import {useAuth0} from '@auth0/auth0-react';
import {Button} from 'reactstrap';

const LogoutButton = () => {
  const {logout} = useAuth0();
  return (
    <Button
      onClick={() =>
        logout({
          returnTo: process.env.REACT_APP_BASE_URL,
        })
      }
      color="danger"
      size="sm"
    >
      Log Out
    </Button>
  );
};

export default LogoutButton;
