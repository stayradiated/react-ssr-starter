import React, {PropTypes} from 'react'
import Helmet from 'react-helmet'

import config from '../../config'

export default function App (props) {
  const css = require('./styles')
  const {children} = props

  return (
    <div className={css.container}>
      <Helmet {...config.app.head} />

      <div className={css.content}>
        {children}
      </div>
    </div>
  )
}

App.propTypes = {
  children: PropTypes.node.isRequired,
}

App.contextTypes = {
  store: PropTypes.object.isRequired,
}
