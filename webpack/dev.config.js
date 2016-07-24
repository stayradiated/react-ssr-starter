require('babel-polyfill')

// Webpack config for development
const fs = require('fs')
const path = require('path')
const webpack = require('webpack')
const assetsPath = path.resolve(__dirname, '../static/dist')
const host = (process.env.HOST || 'localhost')
const port = (+process.env.PORT + 1) || 3001
const helpers = require('./helpers')

// https://github.com/halt-hammerzeit/webpack-isomorphic-tools
const WebpackIsomorphicToolsPlugin = require('webpack-isomorphic-tools/plugin')
const webpackIsomorphicToolsPlugin = new WebpackIsomorphicToolsPlugin(
  require('./webpack-isomorphic-tools'))

const babelrc = fs.readFileSync('./.babelrc')
let babelrcObject = {}

try {
  babelrcObject = JSON.parse(babelrc)
} catch (err) {
  console.error('==>     ERROR: Error parsing your .babelrc.')
  console.error(err)
}

const babelrcObjectDevelopment = babelrcObject.env
  ? babelrcObject.env.development
  : {}

// merge global and dev-only plugins
let combinedPlugins = babelrcObject.plugins || []
combinedPlugins = combinedPlugins.concat(babelrcObjectDevelopment.plugins)

const babelLoaderQuery = Object.assign(
  {},
  babelrcObjectDevelopment,
  babelrcObject,
  {plugins: combinedPlugins})
delete babelLoaderQuery.env

const validDLLs = helpers.isValidDLLs(['vendor'], assetsPath)
if (process.env.WEBPACK_DLLS === '1' && !validDLLs) {
  process.env.WEBPACK_DLLS = '0'
  console.warn('webpack dlls disabled')
}

const webpackConfig = module.exports = {
  devtool: 'inline-source-map',
  context: path.resolve(__dirname, '..'),
  entry: {
    main: [
      `webpack-hot-middleware/client?path=http://${host}:${port}/__webpack_hmr`,
      'react-hot-loader/patch',
      './src/client.js',
    ],
  },
  output: {
    path: assetsPath,
    filename: '[name]-[hash].js',
    chunkFilename: '[name]-[chunkhash].js',
    publicPath: `http://${host}:${port}/dist/`,
  },
  module: {
    loaders: [
      helpers.createSourceLoader({
        happy: {id: 'jsx'},
        test: /\.jsx?$/,
        loaders: [
          'react-hot-loader/webpack',
          `babel?${JSON.stringify(babelLoaderQuery)}`,
          'eslint-loader',
        ],
      }),
      helpers.createSourceLoader({
        happy: {id: 'json'},
        test: /\.json$/,
        loader: 'json-loader',
      }),
      helpers.createSourceLoader({
        happy: {id: 'css'},
        test: /\.css$/,
        loaders: [
          'style',
          'css?modules&importLoaders=2&sourceMap&localIdentName=[folder]_[local]_[hash:base64:5]',
          'autoprefixer?browsers=last 2 version',
        ],
      }),
      {
        test: /\.woff2?(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url?limit=10000&mimetype=application/font-woff',
      },
      {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url?limit=10000&mimetype=application/octet-stream',
      },
      {
        test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'file',
      },
      {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url?limit=10000&mimetype=image/svg+xml',
      },
      {
        test: webpackIsomorphicToolsPlugin.regular_expression('images'),
        loader: 'url-loader?limit=10240',
      },
    ],
  },
  progress: true,
  resolve: {
    modulesDirectories: [
      'src',
      'node_modules',
    ],
    extensions: ['', '.json', '.js', '.jsx', '.css'],
  },
  plugins: [
    // hot reload
    new webpack.HotModuleReplacementPlugin(),
    new webpack.IgnorePlugin(/webpack-stats\.json$/),
    new webpack.DefinePlugin({
      __CLIENT__: true,
      __SERVER__: false,
      __DEVELOPMENT__: true,
      __DEVTOOLS__: true,
      __DLLS__: process.env.WEBPACK_DLLS === '1',
    }),
    webpackIsomorphicToolsPlugin.development(),

    helpers.createHappyPlugin('jsx'),
    helpers.createHappyPlugin('json'),
    helpers.createHappyPlugin('css'),
  ],
}

if (process.env.WEBPACK_DLLS === '1' && validDLLs) {
  helpers.installVendorDLL(webpackConfig, 'vendor')
}
