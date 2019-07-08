
import React, { Component, Fragment } from 'react'
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
    render={({ error, ...props }) => {
      console.log('props ', props)
      if (error) return <div>{error.message}</div>
      if (props) {
        return (
          <Fragment>
            <Header />
            <Switch>
              <Route exact path='/(home)?' render={renderProps => {
                console.log('home props ', props)
                return <Home {...props} {...renderProps} />
              }} />
              <Route exact path='/login' render={renderProps => <Login {...props} {...renderProps} />} />
              <Route exact path='/signup' render={renderProps => <Signup {...props} {...renderProps} />} />
            </Switch>
          </Fragment>
        )
      }
      return <div>Loading...</div>
    }}
  />
)

export default App

