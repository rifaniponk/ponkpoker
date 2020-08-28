import React from "react";
import {
  Col,
  Row,
  Form,
  FormGroup,
  Input,
  Button,
  Spinner,
} from 'reactstrap';
import {gql, useMutation, useSubscription} from '@apollo/client';
import {useAuth0} from "@auth0/auth0-react";
import {useForm} from "react-hook-form";
import {Link, useHistory} from "react-router-dom";
import seedColor from 'seed-color';

const INSERT_SESSION = gql`
mutation insert_sessions_one($name: String = "", $user_id: String = "") {
  insert_sessions_one(object: {name: $name, user_id: $user_id}) {
    id
  }
}
`;

const GET_SESSIONS = gql`
subscription {
  sessions(limit: 10, order_by: {created_at: desc}) {
    id
    name
  }
}
`;

const PlanningPoker = () => {
  const history = useHistory();
  const {user} = useAuth0();
  const [insert_sessions_one, {loading, data: newses}] = useMutation(INSERT_SESSION);
  const {data, loading: dataloading} = useSubscription(GET_SESSIONS);
  const {register, handleSubmit} = useForm();

  const onSubmit = async(values) => {
    try {
      await insert_sessions_one({
        variables: {...values, user_id: user.sub},
      });
      document.getElementById('name').value = '';
      setTimeout(() => {
        if (newses && newses.insert_sessions_one && newses.insert_sessions_one.id){
          history.push('/planning-poker/' + newses.insert_sessions_one.id);
        } else if (data && data.sessions && data.sessions[0]){
          history.push('/planning-poker/' + data.sessions[0].id);
        }
      }, 2000);
    } catch (err){
      // eslint-disable-next-line no-console
      console.error('error ', err);
    }
  };

  return (
    <div>
      <Row style={{marginTop: '20px'}}>
        <Col>
          <h4>Join or create new session!</h4>
          <hr />
        </Col>
      </Row>
      <Row>
        <Col sm={{offset: 6, size: 6}}>
          <Form inline onSubmit={handleSubmit(onSubmit)}>
            <FormGroup className="mr-sm-2 col-sm-10">
              <Input type="name" name="name" id="name" placeholder="enter your session name" style={{width: '100%'}}
                innerRef={register({required: true})}
              />
            </FormGroup>
            <Button type="submit" disabled={loading}>Submit</Button>
          </Form>
        </Col>
      </Row>
      <Row>
        <Col className="mt-4">
          {dataloading && <Spinner></Spinner>}
          {data && data.sessions.map(s =>
            <Link key={s.id} to={'/planning-poker/' + s.id}
              className="btn btn-lg d-inline-block mr-2 mb-1 btn-warning"
              style={{backgroundColor: seedColor(s.id).toHex()}}
              >
              {s.name}
            </Link>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default PlanningPoker;
