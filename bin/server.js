#!/usr/bin/env node
(() => {
  // babel registration (runtime transpilation for node)
  require('../server.babel')

  const path = require('path')
  const rootDir = path.resolve(__dirname, '..')

  /**
   * Define isomorphic constants.
   */
  global.__CLIENT__ = false
  global.__SERVER__ = true
  global.__DISABLE_SSR__ = false
  global.__DEVELOPMENT__ = process.env.NODE_ENV !== 'production'
  global.__DLLS__ = process.env.WEBPACK_DLLS === '1'

  if (__DEVELOPMENT__) {
    if (!require('piping')({
      hook: true,
      ignore: /(\/\.|~$|\.json|\.css$)/i,
    })) {
      return
    }
  }

  // https://github.com/halt-hammerzeit/webpack-isomorphic-tools
  const WebpackIsomorphicTools = require('webpack-isomorphic-tools')
  global.webpackIsomorphicTools = new WebpackIsomorphicTools(
    require('../webpack/webpack-isomorphic-tools'))
    .development(__DEVELOPMENT__)
    .server(rootDir, () => require('../src/server'))
})()
