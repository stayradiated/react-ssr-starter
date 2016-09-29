import React from 'react'
import Helmet from 'react-helmet'
import {Link} from 'react-router'

export default function About () {
  const css = require('./styles')

  return (
    <div className={css.container}>
      <Helmet title='About' />
      <div className={css.content}>
        <h1>About</h1>
        <p>Back to the <Link to='/'>Home page</Link></p>
      </div>
    </div>
  )
}
