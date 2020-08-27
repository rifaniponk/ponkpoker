import React from 'react';
import {Container, Row, Col} from 'reactstrap';
import Navbar from './navbar';
import ChatBox from './chatbox';

const Dashboard = () => {
  return (
    <Container>
      <Row>
        <Col><Navbar></Navbar></Col>
      </Row>
      <ChatBox></ChatBox>
    </Container>
  );
};

export default Dashboard;
