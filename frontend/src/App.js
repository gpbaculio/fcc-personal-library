
import React, { Fragment } from 'react'
import { Switch, Route } from 'react-router-dom';

import {
  Header, Home, Signup,
  Login,
  BookDetails
} from './components';

const App = () => (
  <Fragment>
    <Header />
    <Switch>
      <Route
        exact
        path='/(home)?'
        render={renderProps => (
          <Home {...renderProps} />
        )}
      />
      <Route
        exact
        path='/book/:bookId'
        render={renderProps => (
          <BookDetails {...renderProps} />
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

