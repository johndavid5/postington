import { connect } from 'react-redux'

import PostsFilterForm from './ui/PostsFilterForm'
import PostsListComponent from './ui/PostsListComponent'

import {
    postsFetch, postsLocalFilter, postEditStart, postEditFinish, postEditCancel,
} from '../actions'

import { config } from '../config'
import { logajohn } from '../lib/logajohn'

const sWhere = './src/components/containers.js'

logajohn.setLevel(config.DEBUG_LEVEL)
logajohn.debug(`${sWhere}: logajohn.getLevel()=${logajohn.getLevel()}...`)

export const PostsFilterFormContainer = connect(
    (state) => { /* mapStateToProps */
        const sWho = `${sWhere}: PostsFilterFormContainer::mapStateToProps`

        logajohn.debug(`${sWho}(): state = `, state)
        const mary_kay_returno = {
            posts: { ...state.posts },
        }
        logajohn.debug(`${sWho}(): SHEMP: Moe, retoynin' mary_kay_returno  = `, mary_kay_returno)
        return mary_kay_returno
    },
    dispatch => ({ /* mapDispatchToProps */
        onPostsFetch(filters) {
            const sWho = `${sWhere}: PostsFilterFormContainer::mapDispatchToProps`
            logajohn.debug(`${sWho}(): SHEMP: Moe, dispatchin' postsFetch(filters), with filters = `, filters)
            logajohn.debug(`${sWho}(): SHEMP: Moe, typeof dispatch = `, (typeof dispatch))
            return dispatch(postsFetch(filters))
        },
        onPostsFilter(filters) {
            const sWho = `${sWhere}: PostsFilterFormContainer::mapDispatchToProps`
            logajohn.debug(`${sWho}(): SHEMP: Moe, dispatchin' postsLocalFilter(filters), with filters = `, filters)
            logajohn.debug(`${sWho}(): SHEMP: Moe, typeof dispatch = `, (typeof dispatch))
            dispatch(postsLocalFilter(filters))
        },
    }),
)(PostsFilterForm)


export const PostsListContainer = connect(

    (state) => /* mapStateToProps() */ {
        const sWho = `${sWhere}: PostsListContainer::mapStateToProps`

        logajohn.debug(`${sWho}(): state = `, state)

        const returno = {
            posts: { ...state.posts },
        }

        logajohn.debug(`${sWho}(): returning `, returno)

        return returno
    },
    dispatch => ({ /* mapDispatchToProps */
        onPostsFetch(filters) {
            const sWho = `${sWhere}: PostsListContainer::mapDispatchToProps`
            logajohn.debug(`${sWho}(): SHEMP: Moe, dispatchin' postsFetch(filters), with filters = `, filters)
            logajohn.debug(`${sWho}(): SHEMP: Moe, typeof dispatch = `, (typeof dispatch))
            dispatch(postsFetch(filters))
        },
        onPostsFilter(filters) {
            const sWho = `${sWhere}: PostsListContainer::mapDispatchToProps`
            logajohn.debug(`${sWho}(): SHEMP: Moe, dispatchin' postsLocalFilter(filters), with filters = `, filters)
            logajohn.debug(`${sWho}(): SHEMP: Moe, typeof dispatch = `, (typeof dispatch))
            dispatch(postsLocalFilter(filters))
        },
        onPostEditStart(isEditingId) {
            const sWho = `${sWhere}: PostsListContainer::mapDispatchToProps::onPostEditStart`
            logajohn.debug(`${sWho}(): SHEMP: Moe, dispatchin' postEditStart(isEditingId), with isEditingId = `, isEditingId)
            dispatch(postEditStart(isEditingId))
        },
        onPostEditFinish(isEditingId, isEditingPost) {
            const sWho = `${sWhere}: PostsListContainer::mapDispatchToProps::onPostEditFinish`
            logajohn.debug(`${sWho}(): SHEMP: Moe, dispatchin' postEditFinish(isEditingId, isEditingPost), with isEditingId = `, isEditingId, ', isEditingPost = ', isEditingPost)
            dispatch(postEditFinish(isEditingId, isEditingPost))
        },
        onPostEditCancel(isEditingId) {
            const sWho = `${sWhere}: PostsListContainer::mapDispatchToProps::onPostEditCancel`
            logajohn.debug(`${sWho}(): SHEMP: Moe, dispatchin' postEditCancel(isEditingId), with isEditingId = `, isEditingId)
            dispatch(postEditCancel(isEditingId))
        },
    }),

)(PostsListComponent)
