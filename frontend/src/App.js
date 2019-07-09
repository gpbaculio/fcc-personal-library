
import React, { Fragment } from 'react'
import { QueryRenderer } from 'react-relay';
import graphql from 'babel-plugin-relay/macro';
import { Switch, Route } from 'react-router-dom';


import {
  Header, Home, Signup,
  Login
} from './components';

import environment from './environment'

const AppQuery = graphql`
  query AppQuery {
    viewer {
      username
    }
  }
`;

const App = () => (
  <QueryRenderer
    environment={environment}
    query={AppQuery}
    render={({ error, props }) => {
      if (error) return <div>{error.message}</div>
      if (props) {
        return (
          <Fragment>
            <Header />
            <Switch>
              <Route
                exact
                path='/(home)?'
                render={renderProps => (
                  <Home viewer={props.viewer} {...renderProps} />
                )}
              />
              <Route
                exact
                path='/login'
                render={renderProps => (
                  <Login {...renderProps} />
                )}
              />
              <Route
                exact
                path='/signup'
                render={renderProps => (
                  <Signup {...renderProps} />
                )}
              />
            </Switch>
          </Fragment>
        )
      }
      return <div>Loading...</div>
    }}
  />
)

export default App

