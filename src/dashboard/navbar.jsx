import React, {useState} from 'react';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  NavbarText,
} from 'reactstrap';
import {useAuth0} from "@auth0/auth0-react";

const Example = (props) => {
  const [isOpen, setIsOpen] = useState(false);
  const {user, isAuthenticated} = useAuth0();

  const toggle = () => setIsOpen(! isOpen);

  return (
    <div>
      <Navbar color="light" light expand="md">
        <NavbarBrand href="/">simple app</NavbarBrand>
        <NavbarToggler onClick={toggle} />
        <Collapse isOpen={isOpen} navbar>
          <Nav className="mr-auto" navbar>
            <NavItem>
              <NavLink href="/components/">...</NavLink>
            </NavItem>
          </Nav>
          <NavbarText>{isAuthenticated ? user.name : 'unauthenticated'}</NavbarText>
        </Collapse>
      </Navbar>
    </div>
  );
};

export default Example;
