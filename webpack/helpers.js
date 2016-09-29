const path = require('path')
const fs = require('fs')
const webpack = require('webpack')
const HappyPack = require('happypack')

const projectRootPath = path.resolve(__dirname, '../')
const happyThreadPool = new HappyPack.ThreadPool({size: 5})

// restrict loader to files under /src
function createSourceLoader (spec) {
  return Object.keys(spec).reduce((x, key) => {
    x[key] = spec[key]

    return x
  }, {
    include: [path.resolve(__dirname, '../src')],
  })
}

function createHappyPlugin (id) {
  return new HappyPack({
    id,
    threadPool: happyThreadPool,

    // disable happypack with HAPPY=0
    enabled: process.env.HAPPY !== '0',

    // disable happypack caching with HAPPY_CACHE=0
    cache: process.env.HAPPY_CACHE !== '0',

    // make happypack more verbose with HAPPY_VERBOSE=1
    verbose: process.env.HAPPY_VERBOSE === '1',
  })
}

function loadDLLManifest (filePath) {
  try {
    return require(filePath) // eslint-disable-line import/no-dynamic-require
  } catch (e) {
    process.env.WEBPACK_DLLS = '0'

    console.error(`========================================================================
  Environment Error
------------------------------------------------------------------------
You have requested to use webpack DLLs (env var WEBPACK_DLLS=1) but a
manifest could not be found. This likely means you have forgotten to
build the DLLs.
You can do that by running:
    npm run build-dlls
The request to use DLLs for this build will be ignored.`)
  }

  return undefined
}

function installVendorDLL (config, dllName) {
  const manifest = loadDLLManifest(
    path.join(projectRootPath, `webpack/dlls/${dllName}.json`))

  if (manifest) {
    console.log(`Webpack: will be using the ${dllName} DLL.`)

    config.plugins.push(new webpack.DllReferencePlugin({
      context: projectRootPath,
      manifest,
    }))
  }
}

function isValidDLLs (dllNames, assetsPath) {
  for (const dllName of dllNames) {
    try {
      const manifestPath = path.join(projectRootPath, `webpack/dlls/${dllName}.json`)
      const manifest = require(manifestPath) // eslint-disable-line import/no-dynamic-require

      const dll = fs.readFileSync(path.join(assetsPath, `dlls/dll__${dllName}.js`)).toString('utf-8')
      if (dll.indexOf(manifest.name) === -1) {
        console.warn(`Invalid dll: ${dllName}`)
        return false
      }
    } catch (e) {
      console.warn(e.message)
      return false
    }
  }
  return true
}

module.exports = {
  createSourceLoader,
  createHappyPlugin,
  installVendorDLL,
  isValidDLLs,
}

