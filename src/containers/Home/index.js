import React from 'react'
import Helmet from 'react-helmet'

import config from '../../config'

export default function Home () {
  const css = require('./styles')

  return (
    <div className={css.container}>
      <Helmet title='Home' />
      <div className={css.content}>
        <h1>{config.app.title}</h1>
        <h2>{config.app.description}</h2>
      </div>
    </div>
  )
}
