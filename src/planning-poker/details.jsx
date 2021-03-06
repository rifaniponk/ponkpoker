import React, {useState} from "react";
import {Row, Col, Form, Input, FormGroup, Spinner, Button} from 'reactstrap';
import {useParams} from 'react-router-dom';
import {gql, useSubscription, useMutation} from '@apollo/client';
import seedColor from 'seed-color';
import AvatarImg from '../components/avatar';
import {useAuth0} from "@auth0/auth0-react";
import {SetDiv, ParticipantList, Shortcut, SetDivRevealed, SessionName} from './details-styled';
import _ from 'lodash';
import EasyEdit from 'react-easy-edit';

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
    value_sets
    inc
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

const SET_VALUE = gql`
mutation setValue($value: Int, $sid: uuid = "", $user_id: String = "") {
  update_sessions_participants(_set: {value: $value}, where: {session_id: {_eq: $sid}, user_id: {_eq: $user_id}}) {
    affected_rows
  }
}
`;

const RESET_VALUE = gql`
mutation resetValues($id: uuid! = "", $inc: Int) {
  update_sessions_participants(_set: {value: 0}, where: {session_id: {_eq: $id}}) {
    affected_rows
  }
  update_sessions_by_pk(pk_columns: {id: $id}, _set: {is_finished: false, inc: $inc}) {
    id
  }
}
`;

const GET_USER_SELECTED = gql`
subscription getUserSelected($id: uuid) {
  sessions_participants(where: {value: {_neq: 0}, session_id: {_eq: $id}}) {
    user_id
  }
}
`;

const REVEAL = gql`
mutation reveal($id: uuid! = "") {
  update_sessions_by_pk(_set: {is_finished: true}, pk_columns: {id: $id}) {
    sessions_participants {
      value
      user_id
      user {
        name
      }
    }
    inc
  }
}
`;

const UPDATE_VALUE_SETS = gql`
mutation updateSets($id: uuid! = "", $value_sets: jsonb = "") {
  update_sessions_by_pk(pk_columns: {id: $id}, _set: {value_sets: $value_sets}) {
    id
  }
}
`;

const UPDATE_SESSION_NAME = gql`
mutation updateSessionName($id: uuid! = "", $name: String = "") {
  update_sessions_by_pk(pk_columns: {id: $id}, _set: {name: $name}) {
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
  const {data: dseluser} = useSubscription(
    GET_USER_SELECTED,
    {variables: {id}}
  );
  const [isp] = useMutation(INSERT_SES_PAR);
  const [setValue] = useMutation(SET_VALUE);
  const [resetValues, {loading: resetLoading}] = useMutation(RESET_VALUE);
  const [reveal, {data: dataReveal}] = useMutation(REVEAL);
  const [updateSessionName] = useMutation(UPDATE_SESSION_NAME);
  const [updateSets, {loading: updateSetLoading}] = useMutation(UPDATE_VALUE_SETS);
  const [valueSets, setValueSets] = useState([1, 2, 3, 5, 8]);
  const [selectedValueIdx, setSelectedValueIdx] = useState(-1);
  const [isRevealed, setIsRevealed] = useState(false);
  const [isRevealing, setIsRevealing] = useState(false);
  const [kingValue, setKingValue] = useState(0);
  const [userincards, setUserincards] = useState([]);
  let kdtimeout = 0; // keydown timeout

  const updateUserInCards = () => {
    const _userincards = [];
    valueSets.forEach((v) => {
      _userincards.push({value: v, userNames: []});
    });
    if (dataReveal){
      _userincards.forEach(uic => {
        dataReveal.update_sessions_by_pk.sessions_participants.forEach(uv => {
          if (uv.value === uic.value){
            uic.userNames.push(uv.user.name);
          }
        });
      });

      const guc = _.groupBy(_userincards, (uc) => {
        return uc.userNames.length;
      });
      for (let i = 50; i > 0; i--){
        if (guc[i]){
          if (guc[i].length === 1){
            setKingValue(guc[i][0].value);
          }
          break;
        }
      }
    }
    setUserincards(_userincards);
  };

  const changeSet = (event) => {
    const newset = event.target.value.split(',').map(v => Number(v));
    updateSets({variables: {id, value_sets: newset}});
  };

  const selectCard = (idx, silentMode = false) => {
    if (! silentMode){
      setSelectedValueIdx(idx);
    }
    if (valueSets[idx]){
      setValue({variables: {sid: id, value: valueSets[idx], user_id: user.sub}}).then(()=>{});
    }
  };

  const isUserSelected = (userId) => {
    if (dseluser && user){
      if (_.find(dseluser.sessions_participants, {user_id: userId})){
        return true;
      }
    }
    return false;
  };

  const onReveal = () => {
    setIsRevealing(true);
    reveal({variables: {id}}).then(()=>{});
  };

  const onStartNew = () => {
    resetValues({variables: {id, inc: dpar.sessions_by_pk.inc + 1}});
  };

  const onUpdateSessionName = (name) => {
    updateSessionName({variables: {id, name}});
  };

  window.addEventListener("keydown", (e) => {
    if (e.path[2].className !== 'easy-edit-inline-wrapper'){
      if (kdtimeout){
        clearTimeout(kdtimeout);
      }
      kdtimeout = setTimeout(() => {
        selectCard(e.key - 1, true);
      }, 500);
    }
  });

  if (dataReveal && dataReveal.update_sessions_by_pk){
    if (! isRevealed && dpar.sessions_by_pk.inc === dataReveal.update_sessions_by_pk.inc){
      setTimeout(() => {
        updateUserInCards();
        setIsRevealed(true);
        setIsRevealing(false);
      }, 1000);
    }
  }

  let found = false;
  if (dpar && dpar.sessions_by_pk){
    // check if user hasnt joined the session yet
    dpar.sessions_by_pk.sessions_participants.forEach((su) => {
      if (su.user.id === user.sub){
        found = true;
      }
    });

    if (valueSets !== dpar.sessions_by_pk.value_sets){
      setValueSets(dpar.sessions_by_pk.value_sets);
      updateUserInCards();
    }

    if (dpar.sessions_by_pk.is_finished && ! isRevealed && ! isRevealing){
      onReveal();
    } else if (! dpar.sessions_by_pk.is_finished){
      if (isRevealed){
        setIsRevealed(false);
        setKingValue(0);
        setSelectedValueIdx(-1);
      }
    }
  }

  if (! lodu && ! isLoading && ! found){
    try {
      isp({variables: {session_id: id, user_id: user.sub}}).then(() => {});
    } catch (err){
      // eslint-disable-next-line no-console
      console.log(err);
    }
  }

  return (
    <Row className="mt-4">
      <Col sm="6" md="4" lg="3">
        <h4>Participants</h4>
        <hr />
        <ul style={{paddingLeft: 0}}>
          {lodu && <Spinner></Spinner>}
          {dpar && dpar.sessions_by_pk.sessions_participants.map(su =>
            <ParticipantList key={su.user.id} style={{color: seedColor(su.user.id).toHex()}} className={isUserSelected(su.user.id) ? 'voted' : ''}>
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
        <SessionName>Session: {dpar &&
          <EasyEdit
            type="text"
            allowEdit={user && user.sub === dpar.sessions_by_pk.user_id}
            onSave={onUpdateSessionName}
            placeholder={dpar.sessions_by_pk.name}
            saveButtonLabel="Save"
            cancelButtonLabel="Cancel"
            attributes={{name: "awesome-input", id: 1}}
          />
        }</SessionName><hr />

        {/* <Button color="light">New</Button> */}
        {user && dpar && user.sub === dpar.sessions_by_pk.user_id &&
          <Row>
            <Col>
              <Form>
                <FormGroup>
                <Input type="select" name="select" id="exampleSelect" onChange={changeSet} disabled={updateSetLoading} defaultValue={valueSets.join(',')}>
                  <option value={[1, 2, 3, 5, 8]}>1, 2, 3, 5, 8</option>
                  <option value={[4, 8, 12, 16, 24, 40]}>4h, 8h, 12h, 16h, 24h, 40h</option>
                </Input>
                </FormGroup>
              </Form>
            </Col>
            <Col>
            {! isRevealed &&
              <Button color="primary" className="float-right" onClick={onReveal} disabled={isRevealing}>Reveal!!!</Button>
            }
            {isRevealed &&
              <Button color="success" className="float-right" onClick={onStartNew} disabled={resetLoading}>Start New One</Button>
            }
            </Col>
          </Row>
        }
        <Row>
          <Col>
            {valueSets.map((v, idx) =>{
              if (! isRevealed){
                return (
                  <SetDiv key={idx} className={(selectedValueIdx !== idx ? 'hvr-shutter-in-vertical' : 'selected') + (isRevealing ? ' revealing' : '')} onClick={()=> selectCard(idx)}>
                    <h1>
                      {v}
                    </h1>
                    <Shortcut className="shortcut">{idx + 1}</Shortcut>
                  </SetDiv>
                );
              }
              return (
                // eslint-disable-next-line no-nested-ternary
                <SetDivRevealed key={idx} className={v === kingValue ? 'king' : (_.find(userincards, {value: v})?.userNames.length ? 'yeah' : '')}>
                  <h1>
                    {v}
                  </h1>
                  <ul>
                    {_.find(userincards, {value: v})?.userNames.map((uname, uidx) =>
                      <li key={uidx}>{uname}</li>
                    )}
                  </ul>
                </SetDivRevealed>
              );
            })}
          </Col>
        </Row>
        <Row className="mt-4">
          <Col>You can use keyboard shortcut&nbsp;
            <Shortcut className="d-inline-block">1</Shortcut> /&nbsp;
            <Shortcut className="d-inline-block">2</Shortcut> /&nbsp;
              ...&nbsp;/&nbsp;
            <Shortcut className="d-inline-block"><i>n</i></Shortcut> &nbsp;
            to select the card <b>in secret</b>
          </Col>
        </Row>
      </Col>
    </Row>
  );
};

export default PokerDetail;
