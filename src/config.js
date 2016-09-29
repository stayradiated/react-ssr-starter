require('babel-polyfill')

const environment = {
  development: {
    isProduction: false,
  },
  production: {
    isProduction: true,
  },
}[process.env.NODE_ENV || 'development']

module.exports = Object.assign({
  host: process.env.HOST || 'localhost',
  port: process.env.PORT,
  apiHost: process.env.APIHOST || 'localhost',
  apiPort: process.env.APIPORT,
  app: {
    title: 'React SSR Boilerplate',
    description: 'Get up and running with SSR quickly',
    head: {
      titleTemplate: 'React SSR: %s',
      meta: [
        {
          name: 'description',
          content: 'A boilerplate project for server-side rendering with React.',
        },
        {
          charset: 'utf-8',
        },
      ],
    },
  },
}, environment)
