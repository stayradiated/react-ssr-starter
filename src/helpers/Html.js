import React, {PropTypes} from 'react'
import {renderToString} from 'react-dom/server'
import serialize from 'serialize-javascript'
import Helmet from 'react-helmet'

/* eslint-disable react/no-danger */

/**
 * Wrapper component containing HTML metadata and boilerplate tags.
 * Used in server-side code only to wrap the string output of the
 * rendered route component.
 *
 * The only thing this component doesn't (and can't) include is the
 * HTML doctype declaration, which is added to the rendered output
 * by the server.js file.
 */

export default function Html (props) {
  const {assets, component, store} = props
  const content = component ? renderToString(component) : ''
  const head = Helmet.rewind()

  return (
    <html lang='en-US'>
      <head>
        {head.base.toComponent()}
        {head.title.toComponent()}
        {head.meta.toComponent()}
        {head.link.toComponent()}
        {head.script.toComponent()}

        <link rel='shortcut icon' href='/favicon.ico' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />

        {/*
          * Styles (will be present only in production with webpack extract
          * text plugin).
          */}
        {Object.keys(assets.styles).map((style, key) => (
          <link
            href={assets.styles[style]}
            key={key}
            media='screen, projection'
            rel='stylesheet'
            type='text/css'
            charSet='UTF-8'
          />
        ))}

        {/* (will be present only in development mode) */}
        {Object.keys(assets.styles).length === 0 &&
          <style
            dangerouslySetInnerHTML={{__html: '#content{display:none}'}}
          />}
      </head>
      <body>
        <div
          id='content'
          dangerouslySetInnerHTML={{
            __html: content,
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.__data=${serialize(store.getState())};`,
          }}
          charSet='UTF-8'
        />
        {__DLLS__ &&
          <script
            key='dlls__vendor'
            src='/dist/dlls/dll__vendor.js'
            charSet='UTF-8'
          />}
        <script src={props.assets.javascript.main} charSet='UTF-8' />

        {/* (will be present only in development mode) */}
        {Object.keys(props.assets.styles).length === 0 &&
          <script
            dangerouslySetInnerHTML={{
              __html: 'document.getElementById("content").style.display="block";',
            }}
          />}
      </body>
    </html>
  )
}

Html.propTypes = {
  component: PropTypes.node,
  assets: PropTypes.shape({
    javascript: PropTypes.shape({
      main: PropTypes.string,
    }),
    styles: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  store: PropTypes.shape({
    getState: PropTypes.func,
  }).isRequired,
}
