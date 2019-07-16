
import React, { Fragment } from 'react'
import { Switch, Route } from 'react-router-dom';
import { Container } from 'reactstrap'
import {
  Header, Home, Signup,
  Login, BookDetails, Profile
} from './components';

const App = () => (
  <Fragment>
    <Header />
    <Container>
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
          path='/profile/:userId'
          render={renderProps => (
            <Profile {...renderProps} />
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
    </Container>
  </Fragment>
)

export default App

