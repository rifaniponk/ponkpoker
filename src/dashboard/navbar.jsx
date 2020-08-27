/* eslint-disable camelcase */
/* eslint-disable no-nested-ternary */
import React, {useState} from 'react';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  // NavLink,
  NavbarText,
} from 'reactstrap';
import {useAuth0} from "@auth0/auth0-react";
import {gql, useMutation} from '@apollo/client';
import moment from 'moment';
import LogoutButton from '../components/logout-button';

const UPDATE_LAST_SEEN = gql`
mutation update_users($id: String, $last_seen: timestamptz) {
  update_users(_set: {last_seen: $last_seen}, where: {id: {_eq: $id}}) {
    affected_rows
    returning {
      name
      last_seen
    }
  }
}
`;

const Example = (props) => {
  const [isOpen, setIsOpen] = useState(false);
  const {user, isAuthenticated, isLoading} = useAuth0();
  const [update_users] = useMutation(UPDATE_LAST_SEEN);

  const toggle = () => setIsOpen(! isOpen);

  if (isAuthenticated && ! isLoading){
    // update last_seen
    update_users({variables: {last_seen: moment.utc().format(), id: user.sub}});
  }

  return (
    <div>
      <Navbar color="light" light expand="md">
        <NavbarBrand href="/">simple app</NavbarBrand>
        <NavbarToggler onClick={toggle} />
        <Collapse isOpen={isOpen} navbar>
          <Nav className="mr-auto" navbar>
            <NavItem>
              {/* <NavLink href="/components/">...</NavLink> */}
            </NavItem>
          </Nav>
          <NavbarText style={{marginRight: '10px'}}>{isAuthenticated ? user.name : (isLoading ? 'fetching user....' : 'unauthenticated')}</NavbarText>
          <LogoutButton></LogoutButton>
        </Collapse>
      </Navbar>
    </div>
  );
};

export default Example;
