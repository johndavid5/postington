import C from '../constants'
import { logajohn } from '../lib/logajohn'

export const posts = (state = {}, action = { type: null }) => {
    const sWho = 'reducers::posts'

    logajohn.debug(`${sWho}(): state = `, state)
    logajohn.debug(`${sWho}(): action = `, action)

    let returno

    switch (action.type) {
        case C.POSTS_GET:

            returno = {
                ...state,
                posts_filters: action.filters,
                remote_posts_list: action.posts,
                posts_list: action.posts,
                posts_timestamp: action.timestamp,
                posts_error: action.error,
            }

            logajohn.debug(`${sWho}(): SHEMP: case C.POSTS_GET: Moe, Retoynin' `, JSON.stringify(returno, null, ' '))

            return returno

        case C.POSTS_LOCAL_FILTER:

            returno = {
                ...state,
                posts_filters: action.filters,
                posts_list: action.filtered_posts,
                posts_error: action.error,
                posts_timestamp: action.timestamp,
            }

            logajohn.debug(`${sWho}(): SHEMP: case C.POSTS_LOCAL_FILTER: Moe, Retoynin' `, JSON.stringify(returno, null, ' '))

            return returno

        case C.POSTS_FETCHING:

            returno = {
                ...state,
                posts_fetching: action.posts_is_fetching,
            }

            logajohn.debug(`${sWho}(): SHEMP: case C.POSTS_FETCHING: Moe, Retoynin' `, JSON.stringify(returno, null, ' '))

            return returno

        case C.POST_EDIT_START:

            returno = {
                ...state,
                post_is_editing: action.post_is_editing,
                post_is_editing_id: action.post_is_editing_id,
                post_is_editing_post: action.post_is_editing_post,
            }

            logajohn.debug(`${sWho}(): SHEMP: case C.POST_EDIT_START: Moe, Retoynin' `, JSON.stringify(returno, null, ' '))

            return returno

        case C.POST_EDIT_CANCEL:

            returno = {
                ...state,
                post_is_editing: action.post_is_editing,
                post_is_editing_id: action.post_is_editing_id,
            }

            logajohn.debug(`${sWho}(): SHEMP: case C.POST_EDIT_CANCEL: Moe, Retoynin' `, JSON.stringify(returno, null, ' '))

            return returno

        case C.POST_EDIT_FINISH:

            returno = {
                ...state,
                post_is_editing: action.post_is_editing,
                post_is_editing_id: action.post_is_editing_id,
                post_is_editing_post: action.post_is_editing_post,
            }

            if (state.post_is_editing_iteration) {
                returno.post_is_editing_iteration = state.post_is_editing_iteration + 1
            } else {
                returno.post_is_editing_iteration = 1
            }

            // Replace element in posts_list that matches id...
            const iWhich = returno.remote_posts_list.findIndex(val => val.id == action.post_is_editing_id)

            if (iWhich > -1) {
                const newRemotePostsList = [...returno.remote_posts_list] // It's immutable, so copy it before modifying it...
                newRemotePostsList[iWhich] = action.post_is_editing_post
                returno.remote_posts_list = newRemotePostsList // Also immutable, so replace it in its entirety...
            } else {
                returno.post_is_editing_err = `Can't find post with id ${action.post_is_editing_id}`
            }

            logajohn.debug(`${sWho}(): SHEMP: case C.POST_EDIT_FINISH: Moe, Retoynin' `, JSON.stringify(returno, null, ' '))

            return returno


        default:
            // For default case, just return a copy of state unchanged...
            returno = { ...state }
            logajohn.debug(`${sWho}(): SHEMP: default: Moe, Retoynin' simple copy of state: `, JSON.stringify(returno, null, ' '))
            return returno
    }
}
