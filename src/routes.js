import React from 'react'
import {IndexRoute, Route} from 'react-router'

import './containers'
import App from './containers/App/index'
import Home from './containers/Home/index'
import NotFound from './containers/NotFound/index'

export default (/* store */) => (
  <Route path='/' component={App}>
    <IndexRoute component={Home} />

    <Route path='/home' component={Home} />

    <Route path='*' component={NotFound} status={404} />
  </Route>
)
