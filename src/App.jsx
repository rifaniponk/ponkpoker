/* eslint-disable camelcase */
/* eslint-disable no-console */
import React, {useState} from 'react';
import logo from './logo.svg';
import './App.css';
import LoginButton from './landing/login-button';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import Dashboard from './dashboard';
import {ApolloClient, InMemoryCache, ApolloProvider, split, HttpLink, ApolloLink} from '@apollo/client';
import {WebSocketLink} from '@apollo/client/link/ws';
import {getMainDefinition} from '@apollo/client/utilities';
import {setContext} from '@apollo/client/link/context';
import {useAuth0} from "@auth0/auth0-react";
import {Container, Row, Col, Spinner} from 'reactstrap';
import Navbar from './dashboard/navbar';
import PlanningPoker from './planning-poker';
import PokerDetail from './planning-poker/details';
import {onError} from "@apollo/client/link/error";

function App(){
  const {getIdTokenClaims, isLoading, isAuthenticated} = useAuth0();
  const [token, setToken] = useState('');

  getIdTokenClaims().then((a) => {
    if (a){
      setToken(a.__raw);
    }
  });

  if (! isAuthenticated && ! isLoading){
    return (
        <div className="App">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <LoginButton></LoginButton>
          </header>
        </div>
    );
  }

  if (token === ""){
    return <Spinner color="primary" />;
  }

  const wsLink = new WebSocketLink({
    uri: process.env.REACT_APP_GRAPHQL_WEBSOCKET,
    options: {
      reconnect: true,
      connectionParams: {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
        },
      },
    },
  });
  const httpLink = new HttpLink({
    uri: process.env.REACT_APP_GRAPHQL_ENDPOINT,
  });
  const authLink = setContext((_, {headers}) => {
    // get the authentication token from local cookie if it exists
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : '',
      },
    };
  });

  // The split function takes three parameters:
  //
  // * A function that's called for each operation to execute
  // * The Link to use for an operation if the function returns a "truthy" value
  // * The Link to use for an operation if the function returns a "falsy" value
  const splitLink = split(
    ({query}) => {
      const definition = getMainDefinition(query);
      return (
        definition.kind === 'OperationDefinition' &&
        definition.operation === 'subscription'
      );
    },
    wsLink,
    httpLink,
  );

  const errlink = onError(({response, operation}) => {
    if (operation.operationName === "isp"){
      response.errors = null;
    }
  });

  const client = new ApolloClient({
    // uri: process.env.REACT_APP_GRAPHQL_ENDPOINT,
    cache: new InMemoryCache(),
    link: ApolloLink.from([errlink, authLink, splitLink]),
  });

  return (
    <ApolloProvider client={client}>
      <div className="App">
        <Router>
          <Container style={{maxWidth: '1600px'}}>
            <Row>
              <Col><Navbar></Navbar></Col>
            </Row>
            <Switch>
              <Route path="/planning-poker/:id">
                <PokerDetail />
              </Route>
              <Route path="/planning-poker">
                <PlanningPoker />
              </Route>
              <Route path="/">
                <Dashboard />
              </Route>
            </Switch>
          </Container>
        </Router>
      </div>
    </ApolloProvider>
  );
}

export default App;
