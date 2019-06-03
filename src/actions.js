import fetch from 'isomorphic-fetch'
import C from './constants' // For Actions dispatched immediately by client...

import { config } from './config'
import { logajohn } from './lib/logajohn'

import { utils } from './lib/utils'

// Use Posts model locally for filtering and sorting...
// ...Behold thou the joys of universal JavaScript...
import { Posts } from './server/models/posts'

logajohn.setLevel(config.DEBUG_LEVEL)
// logajohn.setLevel('debug');
logajohn.debug(`src/actions.js: logajohn.getLevel()=${logajohn.getLevel()}...`)

// "Thunks have another benefit. They can invoke
//  dispatch() or getState() asynchronously as many
//  times as they like, and they are not
//  limited to dispatching one type of action."

const parseResponse = (response) => {
    const sWho = 'actions.js::parseResponse'
    // Warning: can cause "locked response" errors in browser...
    // ...not a good idea to monkey with Promises...
    // logajohn.debug(`${sWho}(): response = `, response );
    // logajohn.debug(`${sWho}(): response.json = `, response.json );
    // logajohn.debug(`${sWho}(): response.json() = `, response.json() );
    return response.json()
}

const logError = error => console.error(error)

/* Use isomorphic-fetch to send a request to a web
* service "then" automatically dispatch the response.
*
* Supply `callback` if you want something to happen
* after receiving and dispatching the response...
*/
const fetchThenDispatch = (dispatch, url, method, body, mixin) => {
    const sWho = 'actions.js::fetchThenDispatch'
    logajohn.debug(`${sWho}(): url = ${url}...`)
    logajohn.debug(`${sWho}(): method = ${method}...`)
    logajohn.debug(`${sWho}(): body = `, body)
    logajohn.debug(`${sWho}(): mixin = `, mixin)

    return fetch(url, { method, body, headers: { 'Content-Type': 'application/json' } })
        .then(parseResponse)
        .then((response) => {
            logajohn.debug(`${sWho}(): Calling dispatch( response ), response = `, response)
            logajohn.debug(`${sWho}(): Calling dispatch( response ), typeof response = '${typeof response}'...`)
            logajohn.debug(`${sWho}(): Calling dispatch( response ), response.constructor.name = '${response.constructor.name}'...`)
            response = { ...response, ...mixin }
            dispatch(response)
            // logajohn.debug(`${sWho}(): Returned from dispatch( response ), response = `, response )
        })
        .catch(logError)
}


// SHEMP: Immediate dispatch of dhis thunk, Moe...
//
// NOTE: Fortunately, not all your action creators have to be thunks.
// The `redux-thunk` middleware knows the difference between
// thunks and action objects.  Action objects are immediately
// dispatched.
export const postsIsFetching = (dispatch, isFetching) => {
    const sWho = 'actions.js:postsIsFetching'

    // logajohn.debug(`${sWho}(): dispatch = `, dispatch )
    logajohn.debug(`${sWho}(): isFetching = `, isFetching)

    const action = {
        type: C.POSTS_FETCHING,
        posts_is_fetching: isFetching,
    }

    logajohn.debug(`${sWho}(): Calling dispatch( action ), typeof dispatch = `, (typeof dispatch))

    logajohn.debug(`${sWho}(): Calling dispatch( action ), action = `, action, '...')
    logajohn.debug(`${sWho}(): Calling dispatch( action ), typeof action = '${typeof action}'...`)
    logajohn.debug(`${sWho}(): Calling dispatch( action ), action.constructor.name = '${action.constructor.name}'...`)

    return dispatch(action)
}/* postsIsFetching() */


/* thunk...hit up the server which returns the Action object
* that should look something like this:
* { type: C.POSTS_GET,
*   filters: { title_filter: 'est', body_filter: 'seculum' },
*   posts: [ {<post1>}, {<post2>}, {<post3>}... },
*   timestamp: 'Today, Month X, Year',
*   error: ''
*  }
*/
// Grabs all posts from remote server, then filters and sorts locally...
// NOTE: Use named functions rather than arrow functions
// to allow tests checking on Function.name equal to 'postsFetchThunk',
// as in ./__tests__/components/containers.PostFilterFormContainer.js
// Also, the named functions make it a little more obvious what
// we are up to, n'est-ce pas?
// export const postsFetch = (filters) => (dispatch,getState) => {
export const postsFetch = function postsFetcherator(filters) {
    return function postsFetchThunk(dispatch, getState) {
        return new Promise(((resolve, reject) => {
            const sWho = 'actions.js::postsFetch'

            logajohn.debug(`${sWho}()...filters = `, filters)
            logajohn.debug(`${sWho}()...typeof dispatch = `, (typeof dispatch))

            logajohn.debug(`${sWho}()...callin' postsIsFetching(dispatch, true)...`)
            postsIsFetching(dispatch, true)

            // const url = "/posts_api/posts" + encodeURIComponent(JSON.stringify(filters))
            // const url = "/posts_api/posts?name=fred";
            // const url = '/posts_api/posts?name=fredrika'
            // const url = '/posts_api/posts?' + utils.objectToQueryString(filters)

            // For reverse proxy...suffix /postington...
            // const url = '/postington/posts_api/posts?' + utils.objectToQueryString(filters)

            // Actually, don't supply filters for the remote fetch since we will filter locally...
            const url = '/postington/posts_api/posts'

            // For consistency with later local filterings, override Action from server with local timestamp...?
            const mixin = { timestamp: new Date().toString() }

            logajohn.debug(`${sWho}(): Callin' fetchThenDispatch(${url})...`)

            // Dispatch a postIsFetching(...false) when we're done with the fetch...
            return fetchThenDispatch(
	        dispatch,
	        url,
	        'GET',
                null,
                mixin,
            )
                .then(() => {
                    // let fakeLatency = 3000
                    // setTimeout( ()=>{
                    //  logajohn.debug(`${sWho}()...callin' postsIsFetching(dispatch, true)...`)
                    //  postsIsFetching( dispatch, false )
                    // }, fakeLatency )

                    logajohn.debug(`${sWho}(): Callin' postsIsFetching(dispatch, false)...`)
	    postsIsFetching(dispatch, false)
                })
            // .then(()=>{
            //    logajohn.debug(`${sWho}(): SHEMP: Moe, dispatchin' postsLocalFilter( filters ), with filters = `, filters )
            //    dispatch( postsLocalFilter( filters ) )
            // })
                .then(() => {
                    resolve('OK')
                })
        }))/* return new Promise */
    }/* postsFetchThunk */
}/* postsFetcherator()() */


// export const postsLocalFilter = (filters) => (dispatch,getState) => {
export const postsLocalFilter = function postsLocalFilterator(filters) {
    return function postsLocalFilterThunk(dispatch, getState) {
	  return new Promise(((resolve, reject) => {
	    const sWho = 'actions.js::postsLocalFilter'

	    logajohn.debug(`${sWho}(): SHEMP: Moe, filters = `, filters)
	    logajohn.debug(`${sWho}(): SHEMP: Moe, getState() = `, getState())

	    const action = {
	      type: C.POSTS_LOCAL_FILTER,
	      filters,
	      timestamp: new Date().toString(),
	    }

	    // logajohn.debug(`${sWho}()...callin' postsIsFetching(dispatch, true)...`)
	    // postsIsFetching( dispatch, true )

	    const { remote_posts_list } = getState().posts

	    const postsModel = new Posts()

	    const postsModelSrc = { array: remote_posts_list }

	    logajohn.debug(`${sWho}(): SHEMP: Moe, callin' postsModel.loadPosts(src), with src = `, postsModelSrc)

	    // Use Posts model to filter remote_posts_list...
            postsModel.loadPosts({ array: remote_posts_list })
                .then((numPosts) => {})
	    .then(() => postsModel.getPosts(filters))
	    .then((posts) => {
	        logajohn.debug(`${sWho}().then: posts = `, posts)

	        action.filtered_posts = posts

	        logajohn.debug(`${sWho}(): SHEMP: Moe, callin' dispatch( action ), where action = `, action)

	        dispatch(action)
	     })
	     .catch((error) => {
	        logajohn.debug(`${sWho}(): Caught error = `, utils.errorStringify(error))

	        action.error = error
	        action.filtered_posts = []

	        logajohn.debug(`${sWho}(): SHEMP: Moe, callin' dispatch( action ), where action = `, action)

	        dispatch(action)
	     })
	     .then(() => {
	        // This .then() should execute regardless of whether or not we have an error condition...

	        // let fakeLatency = 0
	        // setTimeout( ()=>{
	        //  logajohn.debug(`${sWho}()...callin' postsIsFetching(dispatch, true)...`)
	        //  postsIsFetching( dispatch, false )
	        // }, fakeLatency )
	        resolve('OK')
	     })
	  })) /* return new Promise */
    }/* postsLocalFilterThunk()() */
}/* postsLocalFilterator() */


/* Need to use a thunk since we need getState() */
// export const postEditStart = (isEditingId) => (dispatch,getState) => {
export const postEditStart = function postEditStartThunkerator(isEditingId) {
    return function postEditStartThunk(dispatch, getState) {
	  return new Promise(((resolve, reject) => {
		  const sWho = 'actions.js:postEditStart'

		  logajohn.info(`${sWho}(): isEditingId = `, isEditingId)

		  const action = {
		    type: C.POST_EDIT_START,
		    post_is_editing: true,
		    post_is_editing_id: isEditingId,
		  }

		  const { posts_list } = getState().posts

		  const iWhich = posts_list.findIndex(post => post.id == isEditingId)

		  if (iWhich > -1) {
		    const oWhich = { ...posts_list[iWhich] }
		    action.post_is_editing_post = oWhich
		  } else {
		    action.post_is_editing_post = {}
		    action.post_is_editing_err = `Can\'t find post with id=${isEditingId}`
		  }

		  dispatch(action)
		  // .then(()=>{
		        resolve('OK')
		  // })
	  }))/* return new Promise(function(resolve, reject) { */
    }/* postEditStartThunk() */
}/* postEditStartThunkerator() */

export const postEditCancel = (isEditingId) => {
    const sWho = 'actions.js:postEditCancel'

    logajohn.info(`${sWho}(): isEditingId = `, isEditingId)

    const action = {
        type: C.POST_EDIT_CANCEL,
        post_is_editing: false,
        post_is_editing_id: isEditingId,
    }

    return action
}/* postEditCancel() */


// export const postEditFinish = (isEditingId,isEditingPost) => (dispatch,getState) => {
export const postEditFinish = function postEditFinisherator(isEditingId, isEditingPost) {
    return function postEditFinishThunk(dispatch, getState) {
        return new Promise(((resolve, reject) => {
    	  const sWho = 'actions.js:postEditFinish'

    	  logajohn.info(`${sWho}(): isEditingId = `, isEditingId)

    	  const action = {
    	    type: C.POST_EDIT_FINISH,
    	    post_is_editing: false,
    	    post_is_editing_id: isEditingId,
    	    post_is_editing_post: isEditingPost,
    	  }

    	  dispatch(action)

    	  // Or, leave it to the client to re-filter (they
    	  // can listen for a change on posts.post_is_editing_iteration)
    	  // so we'll catch any changes in the filter fields...
    	  // dispatch( postsLocalFilter( getState().posts.posts_filters ) )

            resolve('OK')
        })) /* return new Promise(function(resolve, reject)  */
    }/* postEditFinishThunk() */
}/* postEditFinisherator() */
