import React from 'react'
import {IndexRoute, Route} from 'react-router'

import {About, App, Home, NotFound} from './containers'

console.log(About)

export default (/* store */) => (
  <Route path='/' component={App}>
    <IndexRoute component={Home} />

    <Route path='/home' component={Home} />
    <Route path='/about' component={About} />

    <Route path='*' component={NotFound} status={404} />
  </Route>
)
