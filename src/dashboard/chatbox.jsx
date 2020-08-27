/* eslint-disable camelcase */
import React, {useEffect} from 'react';
import {Row, Col, Form, Input, FormGroup, Spinner} from 'reactstrap';
import {gql, useSubscription, useMutation} from '@apollo/client';
import {useForm} from "react-hook-form";
import {useAuth0} from "@auth0/auth0-react";
import seedColor from 'seed-color';
import AvatarImg from '../components/avatar';

const ONLINE_USER_SUBSCRIPTION = gql`
subscription {
  online_users {
    id
    last_seen
    user {
      id
      name
    }
  }
}
`;

const MESSAGES_SUBSCRIPTION = gql`
subscription {
  messages {
    id
    message
    user {
      id
      name
    }
  }
}
`;

const INSERT_MESSAGE = gql`
mutation insert_messages_one($message: String = "", $user_id: String = "") {
  insert_messages_one(object: {user_id: $user_id, message: $message}) {
    id
  }
}
`;

const TYPING_USER_SUBSCRIPTION = gql`
subscription {
  users(where: {typing: {_eq: true}}) {
    name
  }
}
`;

const UPDATE_USER_TYPING = gql`
mutation update_users($typing: Boolean, $id: String) {
  update_users(_set: {typing: $typing}, where: {id: {_eq: $id}}) {
    affected_rows
  }
}
`;

const ChatBox = () => {
  const {user} = useAuth0();
  let timeout = 0; // typing timeout
  let typing = false;

  // eslint-disable-next-line camelcase
  const {loading, data} = useSubscription(
    ONLINE_USER_SUBSCRIPTION
  );

  const {data: datamsg} = useSubscription(
    MESSAGES_SUBSCRIPTION
  );

  const {data: datatyping} = useSubscription(
    TYPING_USER_SUBSCRIPTION
  );

  const [insert_messages_one, {loading: msgLoading}] = useMutation(INSERT_MESSAGE);
  const [update_users] = useMutation(UPDATE_USER_TYPING);

  const {register, handleSubmit} = useForm();

  const onSubmit = async(values) => {
    try {
      await insert_messages_one({
        variables: {...values, user_id: user.sub},
      });
      document.getElementById('examplemessage').value = '';
      document.getElementById('examplemessage').focus();
    } catch (err){
      // eslint-disable-next-line no-console
      console.error('error ', err);
    }
  };

  const doTyping = () => {
    if (timeout){
      clearTimeout(timeout);
    }
    if (! typing){
      typing = true;
      update_users({
        variables: {typing: typing, id: user.sub},
      });
    }
    timeout = setTimeout(() => {
      typing = false;
      update_users({
        variables: {typing: typing, id: user.sub},
      });
    }, 1000);
  };

  useEffect(() => {
    setTimeout(() => {
      const cb = document.getElementById("chatbox");
      if (cb){
        cb.scrollTop = cb.scrollHeight;
      }
    }, 200);
  }, [datamsg]);

  if (loading){
    return <Spinner color="primary"></Spinner>;
  }

  const typingUsers = datatyping ? datatyping.users.map(u => u.name) : [];
  return (
      <Row style={{marginTop: '50px'}}>
        <Col sm="4">
          <h5>Online users</h5>
          <hr />
          <ul style={{paddingLeft: 0}}>
            {data.online_users.map(u =>
              <li key={u.id} style={{listStyle: 'none', color: seedColor(u.user.id).toHex(), marginBottom: '10px'}}>
                <AvatarImg id={u.user.id} size={40}></AvatarImg>
                <b style={{marginLeft: '10px'}}>{u.user.name}</b>
              </li>
            )}
          </ul>
        </Col>
        <Col sm="8">
          <div>
            <h5>Group Chat
              {typingUsers.length > 0 &&
                <small style={{marginLeft: '10px'}}><i>{typingUsers.join(', ')} is typing...</i></small>
              }
            </h5>
            <hr />
            {datamsg &&
              <div style={{height: '400px', overflowY: 'auto'}} id="chatbox">
                {datamsg.messages.map(m =>
                  <div key={m.id} style={{display: 'block', marginBottom: '10px', color: seedColor(m.user.id).toHex()}}>
                    <b>{m.user.name}</b>
                    <span style={{marginLeft: '30px'}}>{m.message}</span>
                  </div>
                )}
              </div>
            }
          </div>
          <div style={{marginTop: '70px'}}>
            <Form onSubmit={handleSubmit(onSubmit)}>
              <FormGroup>
                <Input type="message" name="message" id="examplemessage" placeholder="enter your message here..."
                  onChange={() => doTyping()}
                  disabled={msgLoading}
                  innerRef={register({required: true})}
                />
              </FormGroup>
            </Form>
          </div>
        </Col>
      </Row>
  );
};

export default ChatBox;
