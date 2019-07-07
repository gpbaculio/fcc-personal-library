
import React, { Component, Fragment } from 'react'
import { Switch, Route } from 'react-router-dom';


import {
  Header, Home, Signup,
  Login
} from './components';

import enviroment from './environment'

const App = () => (
  <Fragment>
    <Header />
    <Switch>
      <Route exact path='/(home)?' component={Home} />
      <Route exact path='/login' component={Login} />
      <Route exact path='/signup' component={Signup} />
    </Switch>
  </Fragment>
)
export default App

