#!/usr/bin/env node
(() => {
  if (process.env.NODE_ENV !== 'production') {
    if (!require('piping')({
      hook: true,
      ignore: /(\/\.|~$|\.json$)/i,
    })) {
      return
    }
  }

  // babel registration (runtime transpilation for node)
  require('../server.babel')
  require('../api')
})()
