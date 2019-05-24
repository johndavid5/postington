import React from 'react'
import { hydrate } from 'react-dom'
/* The provider adds the store to the context and
 * updates the `App` component when actions have been
 * dispatched.  The provider expects a single child component...
 */
import { Provider } from 'react-redux'
/* To use the router isomorphically, use BrowserRouter
* rather than HashRouter, which adds a # before each route...
*/
import { BrowserRouter } from 'react-router-dom'
import App from './components/App'
import storeFactory from './store'
import { logajohn } from './lib/logajohn'
import { config } from './config'

let sWhere = './index.js'

//logajohn.info(`${sWhere}: logajohn.getLevel()=`, logajohn.getLevel())

//console.log(`${sWhere}: config.DEBUG_LEVEL = `, config.DEBUG_LEVEL )
logajohn.setLevel(config.DEBUG_LEVEL)

const store = storeFactory(false, window.__INITIAL_STATE__)

window.React = React
window.store = store

logajohn.debug('./src/index.js: rendered from here...')

hydrate(
  <Provider store={store}>
      <BrowserRouter>
          <App />
        </BrowserRouter>
    </Provider>,
    document.getElementById('react-container'),
)
