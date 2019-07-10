
import React, { Fragment } from 'react'
import { Switch, Route } from 'react-router-dom';

import {
  Header, Home, Signup,
  Login
} from './components';

const App = () => (
  <Fragment>
    <Header />
    <Switch>
      <Route path="empty" component={null} key="empty" />
      <Route
        exact
        path='/(home)?'
        render={renderProps => (
          <Home {...renderProps} />
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

export default App

