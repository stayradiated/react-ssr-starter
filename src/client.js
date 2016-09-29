import 'babel-polyfill'
import React from 'react'
import ReactDOM from 'react-dom'
import {Provider} from 'react-redux'
import {Router, browserHistory} from 'react-router'
import {syncHistoryWithStore} from 'react-router-redux'
import {ReduxAsyncConnect} from 'redux-connect'
import {AppContainer as HotEnabler} from 'react-hot-loader'
import withScroll from 'scroll-behavior'

import createStore from './redux/create'
import ApiClient from './helpers/ApiClient'
import getRoutes from './routes'

const client = new ApiClient()
const _browserHistory = withScroll(browserHistory)
const dest = document.getElementById('content')
const store = createStore(_browserHistory, client, window.__data)
const history = syncHistoryWithStore(_browserHistory, store)

const renderRouter = (props) => (
  <ReduxAsyncConnect
    {...props}
    helpers={{client}}
    filter={(item) => !item.deferred}
  />
)

const render = (routes) => {
  ReactDOM.render(
    <HotEnabler>
      <Provider store={store} key='provider'>
        <Router history={history} render={renderRouter}>
          {routes}
        </Router>
      </Provider>
    </HotEnabler>,
    dest
  )
}

render(getRoutes(store))

if (module.hot) {
  module.hot.accept('./routes', () => {
    const nextRoutes = require('./routes')(store)
    render(nextRoutes)
  })
}

if (process.env.NODE_ENV !== 'production') {
  window.React = React // enable debugger

  if (
    !dest ||
    !dest.firstChild ||
    !dest.firstChild.attributes ||
    !dest.firstChild.attributes['data-react-checksum']
  ) {
    console.error(
      'Server-side React render was discarded. Make sure that your initial ' +
      'render does not contain any client-side code.')
  }
}

if (__DEVTOOLS__ && !window.devToolsExtension) {
  console.log('Rendering dev tools!')
  const devToolsDest = document.createElement('div')
  window.document.body.insertBefore(devToolsDest, null)
  const DevTools = require('./containers/DevTools')
  ReactDOM.render(
    <Provider store={store} key='provider'>
      <DevTools />
    </Provider>,
    devToolsDest
  )
}
