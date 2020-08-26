import React from 'react';
import {Container, Row, Col} from 'reactstrap';
import Navbar from './navbar';

const Dashboard = () => {
  return (
    <Container>
      <Row>
        <Col><Navbar></Navbar></Col>
      </Row>
      <Row style={{marginTop: '50px'}}>
        <Col>test</Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
