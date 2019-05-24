/* Let's create a store factory, boys and girls... */
import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'

//import { objectives, users, posts } from './reducers'
import { posts } from './reducers'

import { config } from '../config'
import { logajohn } from '../lib/logajohn'

logajohn.setLevel(config.DEBUG_LEVEL)
logajohn.debug(`./src/store/index.js: logajohn.getLevel()=${logajohn.getLevel()}...`)

/* I thunk we'd use thunks to help us with asynchronous actions...
*
* These action creators, called thunks, will allow us to wait
* for a server response before dispatching an action locally.
* Thunks are higher-order functions.  Instead of action objects,
* they return other functions...
*/

/* For isomorphism, use different loggers on client and server... */
const clientLogger = store => next => (action) => {
    const sWho = 'store/index.js/clientLogger'
    if (action.type) {
        let result
        console.groupCollapsed(`${sWho}(): dispatching client action`, action.type)
        //console.log(`${sWho}(): ` + 'prev state', store.getState())
        //console.log(`${sWho}(): ` + 'action', action)
        result = next(action)
        //console.log(`${sWho}(): ` + 'next state', store.getState())
        console.groupEnd()
        return result
    }
    return next(action)
}

const serverLogger = store => next => (action) => {
    const sWho = 'store/index/serverLogger'
    logajohn.info(`\n${sWho}(): ` + ' dispatching server action = ', action)
    //console.log(`server action = `, action)
    //console.log('\n')
    return next(action)
}

/* Return the Redux middleware that should
* be incorporated to the new store in a single
* array...add any Redux middleware to this
* array, and it will be spread into the
* arguments of the Redux::applyMiddleware
* function...
*
* Note that we get the serverLogger if we're
* running on the server, and the clientLogger
* if we're running on the client...
*
* Note we incorporate the redux thunk
* in there...
*/
const middleware = server => [
    (server) ? serverLogger : clientLogger,
    thunk,
]

const storeFactory = (server = false, initialState = {}) => applyMiddleware(...middleware(server))(createStore)(
    //combineReducers({ objectives, users, posts }),
    combineReducers({ posts }),
    initialState,
)

export default storeFactory
