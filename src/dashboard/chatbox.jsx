import React from 'react';
import {Row, Col, Form, Input, FormGroup, Spinner} from 'reactstrap';
import {gql, useSubscription, useMutation} from '@apollo/client';
import {useForm} from "react-hook-form";
import {useAuth0} from "@auth0/auth0-react";
import seedColor from 'seed-color';

const ONLINE_USER_SUBSCRIPTION = gql`
subscription {
  online_users {
    id
    last_seen
    user {
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

const ChatBox = () => {
  const {user} = useAuth0();

  // eslint-disable-next-line camelcase
  const {loading, data} = useSubscription(
    ONLINE_USER_SUBSCRIPTION
  );

  const {data: datamsg} = useSubscription(
    MESSAGES_SUBSCRIPTION
  );

  const [insert_messages_one, {loading: msgLoading}] = useMutation(INSERT_MESSAGE);

  const {register, handleSubmit} = useForm();

  const onSubmit = async(values) => {
    try {
      await insert_messages_one({
        variables: {...values, user_id: user.sub},
      });
      document.getElementById('examplemessage').value = '';
    } catch (err){
      // eslint-disable-next-line no-console
      console.error('error ', err);
    }
  };

  if (loading){
    return <Spinner color="primary"></Spinner>;
  }

  return (
      <Row style={{marginTop: '50px'}}>
        <Col sm="4">
          <h5>Online users</h5>
          <hr />
          <ul>
            {data.online_users.map(u =>
              <li key={u.id}>
                {u.user.name}
              </li>
            )}
          </ul>
        </Col>
        <Col sm="8">
          <div>
            <h5>group chat</h5>
            <hr />
            {datamsg &&
              <div style={{maxHeight: '400px', overflowY: 'auto'}}>
                {datamsg.messages.map(m =>
                  <div key={m.id} style={{display: 'block', marginBottom: '20px', color: seedColor(m.user.id).toHex()}}>
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
