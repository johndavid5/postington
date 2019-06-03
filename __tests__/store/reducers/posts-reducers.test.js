import deepFreeze from 'deep-freeze' // deepFreeze: causes test to fail if object is modified...ensures pure functions...

import C from '../../../src/constants'
import { posts } from '../../../src/store/reducers'
import postsFixture from '../../models/fixtures/posts.json'

import { config } from '../../../src/config'
import { logajohn } from '../../../src/lib/logajohn'

const sWhere = './__tests__/store/reducers/posts-reducers.test.js'

logajohn.setLevel(config.DEBUG_LEVEL)
logajohn.debug(`${sWhere}: logajohn.getLevel()=${logajohn.getLevel()}...`)

describe('posts reducers', () => {
    const postsList = postsFixture.array

    it('POSTS_GET success', () => {
        const state = {}
        const action = {
            type: C.POSTS_GET,
            filters: { 'title.contains': 'est' },
            timestamp: new Date().toString(),
            posts: postsList,
            error: '',
        }
        deepFreeze(state)
        deepFreeze(action)
        const result = posts(state, action)
        expect(result)
            .toEqual({
                posts_filters: action.filters,
                remote_posts_list: action.posts,
                posts_list: action.posts,
                posts_timestamp: action.timestamp,
                posts_error: action.error,
            })
    })

    it('POSTS_LOCAL_FILTER', () => {
        const state = {}
        const action = {
            type: C.POSTS_LOCAL_FILTER,
            filters: { 'title.contains': 'est' },
            filtered_posts: postsList,
            error: 'OK!',
            timestamp: new Date().toString(),
        }
        deepFreeze(state)
        deepFreeze(action)
        const result = posts(state, action)
        expect(result)
            .toEqual({
                posts_filters: action.filters,
                posts_list: action.filtered_posts,
                posts_error: action.error,
                posts_timestamp: action.timestamp,
            })
    })

    it('POSTS_FETCHING true', () => {
        const state = {}
        const action = {
            type: C.POSTS_FETCHING,
            posts_is_fetching: true,
        }
        deepFreeze(state)
        deepFreeze(action)

        const result = posts(state, action)

        expect(result)
            .toEqual({
                posts_fetching: true,
            })
    })

    it('POSTS_FETCHING false', () => {
        const state = {}
        const action = {
            type: C.POSTS_FETCHING,
            posts_is_fetching: false,
        }
        deepFreeze(state)
        deepFreeze(action)

        const result = posts(state, action)

        expect(result)
            .toEqual({
                posts_fetching: false,
            })
    })

    it('POST_EDIT_START', () => {
        const state = {
            posts_list: postsList,
        }

        const lePost = {
            userId: 2,
            id: 3,
            title: 'ea molestias quasi exercitationem repellat qui ipsa sit aut',
            body: 'et iusto sed quo iure\nvoluptatem occaecati omnis eligendi aut ad\nvoluptatem doloribus vel accusantium quis pariatur\nmolestiae porro eius odio et labore et velit aut',
        }

        const leId = 3

        const action = {
            type: C.POST_EDIT_START,
            post_is_editing: true,
            post_is_editing_id: leId,
            post_is_editing_post: lePost,
        }
        deepFreeze(state)
        deepFreeze(action)

        const result = posts(state, action)

        expect(result)
            .toEqual({
                ...state,
                post_is_editing: true,
                post_is_editing_id: leId,
                post_is_editing_post: lePost,
            })
    })

    it('POST_EDIT_CANCEL', () => {
        const state = {
            posts_list: postsList,
        }

        const action = {
            type: C.POST_EDIT_CANCEL,
            post_is_editing: false,
            post_is_editing_id: 3,
        }
        deepFreeze(state)
        deepFreeze(action)

        const result = posts(state, action)

        expect(result)
            .toEqual({
                ...state,
                post_is_editing: action.post_is_editing,
                post_is_editing_id: action.post_is_editing_id,
            })
    })

    it('POST_EDIT_FINISH', () => {
        const state = {
            remote_posts_list: postsList,
            posts_list: postsList,
            post_is_editing_iteration: 1,
        }

        const lePost = {
            userId: 2,
            id: 3,
            title: 'ea molestias quasi exercitationem repellat qui ipsa sit autismo',
            body: 'et iusto sed quo iure\nvoluptatem occaecati omnis eligendi aut ad\nvoluptatem doloribus vel accusantium quis pariatur\nmolestiae porro eius odio et labore et velit aut',
        }

        const leId = 3

        const action = {
            type: C.POST_EDIT_FINISH,
            post_is_editing: false,
            post_is_editing_id: leId,
            post_is_editing_post: lePost,
        }
        deepFreeze(state)
        deepFreeze(action)

        const result = posts(state, action)

        const iWhich = state.remote_posts_list.findIndex(val => val.id == action.post_is_editing_id)

        let newRemotePostsList = [...state.remote_posts_list]

        if (iWhich > -1) {
            newRemotePostsList = [...state.remote_posts_list] // It's immutable, so copy it...
            newRemotePostsList[iWhich] = action.post_is_editing_post
        } else {
            returno.post_is_editing_err = `Can't find post with id ${action.post_is_editing_id}`
        }

        expect(result)
            .toEqual({
                ...state,
                remote_posts_list: newRemotePostsList,
                post_is_editing_iteration: state.post_is_editing_iteration + 1,
                post_is_editing: action.post_is_editing,
                post_is_editing_id: action.post_is_editing_id,
                post_is_editing_post: action.post_is_editing_post,
            })
    })
})
