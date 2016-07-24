import React from 'react'

export default function NotFound () {
  const css = require('./styles.css')

  return (
    <div className={css.container}>
      <h1>Doh! 404!</h1>
      <p>These are <em>not</em> the droids you are looking for!</p>
    </div>
  )
}
