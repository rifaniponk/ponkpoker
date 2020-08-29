import React, {useState} from "react";
import {Row, Col, Form, Input, FormGroup, Spinner, Button} from 'reactstrap';
import {useParams} from 'react-router-dom';
import {gql, useSubscription, useMutation} from '@apollo/client';
import seedColor from 'seed-color';
import AvatarImg from '../components/avatar';
import {useAuth0} from "@auth0/auth0-react";
import {SetDiv, ParticipantList, Shortcut} from './details-styled';

const GET_SESSION_PARTICIPANTS = gql`
subscription session_details($id: uuid!) {
  sessions_by_pk(id: $id) {
    sessions_participants {
      user {
        name
        id
      }
    }
    user_id
    name
    is_finished
  }
}
`;

const INSERT_SES_PAR = gql`
mutation isp($session_id: uuid = "", $user_id: String = "") {
  insert_sessions_participants_one(object: {user_id: $user_id, session_id: $session_id}) {
    id
  }
}
`;



const PokerDetail = () => {
  const {id} = useParams();
  const {user, isLoading} = useAuth0();
  const {loading: lodu, data: dpar} = useSubscription(
    GET_SESSION_PARTICIPANTS,
    {variables: {id}}
  );
  const [isp] = useMutation(INSERT_SES_PAR);
  const [valueSets, setValueSets] = useState([1, 2, 3, 5, 8]);

  let found = false;
  if (dpar && dpar.sessions_by_pk){
    // check if user hasnt joined the session yet
    dpar.sessions_by_pk.sessions_participants.forEach((su) => {
      if (su.user.id === user.sub){
        found = true;
      }
    });
  }

  if (! lodu && ! isLoading && ! found){
    try {
      isp({variables: {session_id: id, user_id: user.sub}}).then(() => {});
    } catch (err){
      // eslint-disable-next-line no-console
      console.log(err);
    }
  }

  const changeSet = (event) => {
    setValueSets(event.target.value.split(','));
  };

  return (
    <Row className="mt-4">
      <Col sm="6" md="4" lg="3">
        <h4>Participants</h4>
        <hr />
        <ul style={{paddingLeft: 0}}>
          {lodu && <Spinner></Spinner>}
          {dpar && dpar.sessions_by_pk.sessions_participants.map(su =>
            <ParticipantList key={su.user.id} style={{color: seedColor(su.user.id).toHex()}} className="voted">
              <AvatarImg id={su.user.id} size={50}></AvatarImg>
              <b style={{marginLeft: '10px', fontSize: '20px'}}>{su.user.name}</b>
              {user && su.user.id === dpar.sessions_by_pk.user_id &&
                <img src="/jedi.png" alt="jedi" width="50px" className="float-right" title="jedi" />
              }
            </ParticipantList>
          )}
        </ul>
      </Col>
      <Col>
        <h4>Session: {dpar && dpar.sessions_by_pk.name}</h4><hr />
        {/* <Button color="light">New</Button> */}
        <Row>
          <Col>
            <Form>
              <FormGroup>
              <Input type="select" name="select" id="exampleSelect" onChange={changeSet}>
                <option value={[1, 2, 3, 5, 8]}>1, 2, 3, 5, 8</option>
                <option value={[4, 8, 12, 16, 24, 40]}>4h, 8h, 12h, 16h, 24h, 40h</option>
              </Input>
              </FormGroup>
            </Form>
          </Col>
          <Col>
            <Button color="success" className="float-right">Reveal!!!</Button>
          </Col>
        </Row>
        <Row>
          <Col>
            {valueSets.map((v, idx) =>
              <SetDiv key={idx} className="hvr-shutter-in-vertical">
                <h1>
                  {v}
                </h1>
                <Shortcut className="shortcut">{idx + 1}</Shortcut>
              </SetDiv>
            )}
          </Col>
        </Row>
        <Row className="mt-4">
          <Col>You can use keyboard shortcut&nbsp;
            <Shortcut className="d-inline-block">1</Shortcut> /&nbsp;
            <Shortcut className="d-inline-block">2</Shortcut> /&nbsp;
            <Shortcut className="d-inline-block">3</Shortcut> /&nbsp;
            <Shortcut className="d-inline-block">4</Shortcut> /&nbsp;
            <Shortcut className="d-inline-block">5</Shortcut> &nbsp;
            to select the card <b>in secret</b>
          </Col>
        </Row>
      </Col>
    </Row>
  );
};

export default PokerDetail;
