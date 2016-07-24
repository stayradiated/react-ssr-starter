const WebpackIsomorphicToolsPlugin = require('webpack-isomorphic-tools/plugin')

// see this link for more info on what all of this means
// https://github.com/halt-hammerzeit/webpack-isomorphic-tools
module.exports = {

   /*
   * debug mode.
   * when set to true, lets you see debugging messages in the console.
   */
  debug: false, // is false by default

  /*
   * verbosity.
   * when set to true, outputs Webpack stats to the console
   * in development mode on each incremental build.
   * (i don't know who might need that info)
   */
  verbose: false,

  /*
   * enables support for `require.context()` and `require.ensure()` functions.
   * is turned off by default
   * to skip unnecessary code instrumentation
   * because not everyone uses it.
   */
  patch_require: false,

  /*
   * By default it creates 'webpack-assets.json' file at
   * webpack_configuration.context (which is your project folder).
   * You can change the assets file path as you wish
   * (therefore changing both folder and filename).
   *
   * (relative to webpack_configuration.context which is your project folder)
   */
  webpack_assets_file_path: 'webpack-assets.json',

  /*
   * By default, when running in debug mode, it creates 'webpack-stats.json'
   * file at webpack_configuration.context (which is your project folder).
   * You can change the stats file path as you wish
   * (therefore changing both folder and filename).
   *
   * (relative to webpack_configuration.context which is your project folder)
   */
  webpack_stats_file_path: 'webpack-stats.json',

  /*
   * Makes `webpack-isomorphic-tools` aware of Webpack aliasing feature
   * (if you use it)
   * https://webpack.github.io/docs/resolving.html#aliasing
   *
   * The `alias` parameter corresponds to `resolve.alias`
   * in your Webpack configuration.
   */
  alias: {},

  assets: {
    images: {
      extensions: [
        'jpeg',
        'jpg',
        'png',
        'gif',
      ],
      parser: WebpackIsomorphicToolsPlugin.url_loader_parser,
    },
    fonts: {
      extensions: [
        'woff',
        'woff2',
        'ttf',
        'eot',
      ],
      parser: WebpackIsomorphicToolsPlugin.url_loader_parser,
    },
    svg: {
      extension: 'svg',
      parser: WebpackIsomorphicToolsPlugin.url_loader_parser,
    },
    style_modules: {
      extensions: ['css'],
      filter: (module, regex, options, log) => {
        if (options.development) {
          // in development mode there's webpack "style-loader",
          // so the module.name is not equal to module.name
          return WebpackIsomorphicToolsPlugin.style_loader_filter(module, regex, options, log)
        }

        // in production mode there's no webpack "style-loader",
        // so the module.name will be equal to the asset path
        return regex.test(module.name)
      },
      path: (module, options, log) => {
        if (options.development) {
          // in development mode there's webpack "style-loader",
          // so the module.name is not equal to module.name
          return WebpackIsomorphicToolsPlugin.style_loader_path_extractor(module, options, log)
        }

        // in production mode there's no webpack "style-loader",
        // so the module.name will be equal to the asset path
        return module.name
      },
      parser: (module, options, log) => {
        if (options.development) {
          return WebpackIsomorphicToolsPlugin.css_modules_loader_parser(module, options, log)
        }

        // in production mode there's Extract Text Loader which extracts CSS text away
        return module.source
      },
    },
  },
}
