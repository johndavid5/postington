/* Bump off two birds with one stone: Test store and action creators together... */
import C from '../src/constants'
import storeFactory from '../src/store/index'
import { postsFetch, postsIsFetching, postsLocalFilter, postEditStart, postEditCancel, postEditFinish } from '../src/actions'

import postsFixture from './models/fixtures/posts.json'

import { config } from '../src/config'
import { logajohn } from '../src/lib/logajohn'

import { errorStringify } from '../src/lib/utils'

import fetch from 'isomorphic-fetch'
jest.mock('isomorphic-fetch') // Need to mock isomorphic-fetch for objectivesFilter() action creator...

logajohn.setLevel(config.DEBUG_LEVEL)
logajohn.debug(`__tests__/actions.test.js: logajohn.getLevel()=${logajohn.getLevel()}...`)

let sWhere = './__tests__/actions.js'

describe("Action Creators", () => {

    let fauxAction

    describe("postsFetch() thunk-based action creator...", () => {

        let store

        let ourMockSnapshot = null;

        let sWhich = `${sWhere}: postsFetch() thunk-based action creator`

        beforeAll((done) => {

            let sWho = `${sWhich}: beforeAll`
            logajohn.debug(`${sWho}(): SHEMP: Moe, storeFactory = `, storeFactory )
            let bServer = true
            store = storeFactory(bServer,{"posts": {"name":"Moe"}})
            logajohn.debug(`${sWho}(): SHEMP: Moe, after constructin' store, store.getState() = `, store.getState() )
            logajohn.debug(`${sWho}(): SHEMP: Moe, after constructin' store, typeof store.dispatch = `, (typeof store.dispatch) )

            fetch.resetMocks()

            fauxAction = {"type":"POSTS_GET",
                "filters":{},
                "timestamp":"Fri May 03 2019 17:25:07 GMT-0400 (Eastern Daylight Time)",
                "posts": [...postsFixture.array],
                "error":""}

            logajohn.debug(`${sWho}(): SHEMP: Moe, postsFixture.array = `, postsFixture.array )
            logajohn.debug(`${sWho}(): SHEMP: Moe, settin' fetch.mockResponse to fauxAction = ${JSON.stringify(fauxAction, null, ' ')}...`)
            // Set the response that we desire when isomorphic fetch is called within the actions.js file...
            fetch.mockResponse(JSON.stringify(fauxAction))

            let le_filters = {"description_filter": "Macbeth"}
            logajohn.debug(`${sWho}(): SHEMP: Moe, before dispatchin' postsFetchThunk(), fetch.mock = `, fetch.mock )
            logajohn.debug(`${sWho}(): SHEMP: Moe, dispatchin' postsFetchThunk()...here goes nuttin'...!`)

            let postsFetchThunk = postsFetch(le_filters) // Thunk returns a function...
            postsFetchThunk(store.dispatch)
            .then(()=>{
                logajohn.debug(`${sWho}(): SHEMP: Moe, after dispatchin' postsFetchThunk(), store.getState() = `, store.getState() )
                logajohn.debug(`${sWho}(): SHEMP: Moe, after dispatchin' postsFetchThunk(), fetch.mock = `, fetch.mock )
                ourMockSnapshot = fetch.mock
                logajohn.debug(`${sWho}(): SHEMP: Moe, after dispatchin' postsFetchThunk(), ourMockSnapshot = `, ourMockSnapshot )
                done()
            })
        })


        it("should have posts fetched from the remote site", () =>{
            let sWho = `${sWhich}: should have posts fetched from the remote site`
            logajohn.debug(`${sWho}(): SHEMP: Moe, store.getState() = ${JSON.stringify(store.getState(), null, ' ')}...`)
            let state = store.getState()
            logajohn.debug(`${sWho}(): SHEMP: Moe, store.getState().posts = ${JSON.stringify(state.posts, null, ' ')}...`)
            logajohn.debug(`${sWho}(): SHEMP: Moe, store.getState().posts.remote_posts_list = ${JSON.stringify(state.posts.remote_posts_list, null, ' ')}...`)
            logajohn.debug(`${sWho}(): SHEMP: Moe, store.getState().posts.remote_posts_list.length = `, state.posts.remote_posts_list.length )
            logajohn.debug(`${sWho}(): SHEMP: Moe, store.getState().posts.posts_list.length = `, state.posts.posts_list.length )
            expect(state.posts.remote_posts_list.length).toBe(postsFixture.array.length)
            expect(state.posts.posts_list.length).toBe(postsFixture.array.length)
            expect(state.posts.remote_posts_list).toEqual(postsFixture.array)
            expect(state.posts.posts_list).toEqual(postsFixture.array)
        })

        it("should have timestamp", () => {
            let sWho = `${sWhich}: should have timestamp`
            logajohn.debug(`${sWho}(): SHEMP: Moe, store.getState() = ${JSON.stringify(store.getState(), null, ' ')}...`)
            expect(store.getState().posts.posts_timestamp).toBeDefined()
        })

        it('should be fetching from our API at /postington/posts_api/post', () => {
            let sWho = `${sWhich}: should be fetching from our API at /postington/posts_api/post`
            logajohn.debug(`${sWho}(): SHEMP: Moe, store.getState() = ${JSON.stringify(store.getState(), null, ' ')}...`)
            logajohn.debug(`${sWho}(): SHEMP: Moe, fetch.mock = `, fetch.mock )
            logajohn.debug(`${sWho}(): SHEMP: Moe, fetch.mock.calls = `, fetch.mock.calls )
            // I think some wise guy is re-setting the mocks, so I saved ourMockSnapshot from before...
            logajohn.debug(`${sWho}(): SHEMP: Moe, ourMockSnapshot = `, ourMockSnapshot )

            const url_expect = '/postington/posts_api/post'
            expect(ourMockSnapshot.calls[0][0]).toEqual(expect.stringMatching(url_expect))
        })

        it('postsLocalFilter() action filters properly from remote_posts_list into posts_list...', (done) => {
            let sWho = `${sWhich}: postsLocalFilter() action filters properly from remote_posts_list into posts_list...` 

            let leFiltersAlpha = {
                body_filter: "a",
                sort_by_asc_desc: "asc",
                sort_by_field: "title",
                title_filter: "a",
                user_id_filter: "1"
            }

            let leFilters = { user_id_filter: 1, sort_by_field: 'title', sort_by_asc_desc: 'asc' }

            let postsLocalFilterThunk = postsLocalFilter(leFilters) // Thunk returns a function...

            logajohn.debug(`${sWho}(): SHEMP: Moe, dispatchin' postsLocalFilterThunk...`)

            postsLocalFilterThunk(store.dispatch, store.getState)
            //store.dispatch( postsLocalFilterThunk )
            .then(()=>{
                logajohn.debug(`${sWho}(): SHEMP: Moe, Larry, after dispatchin' postsLocalFilterThunk(), store.getState() = ${JSON.stringify(store.getState(), null, ' ')}...`)
                expect(store.getState().posts.posts_list).toEqual(
                [
                   {
                    "userId": 1,
                    "id": 2,
                    "title": "qui est esse",
                    "body": "est rerum tempore vitae\nsequi sint nihil reprehenderit dolor beatae ea dolores neque\nfugiat blanditiis voluptate porro vel nihil molestiae ut reiciendis\nqui aperiam non debitis possimus qui neque nisi nulla"
                   },
                   {
                    "userId": 1,
                    "id": 1,
                    "title": "sunt aut facere repellat provident occaecati excepturi optio reprehenderit",
                    "body": "quia et suscipit\nsuscipit recusandae consequuntur expedita et cum\nreprehenderit molestiae ut ut quas totam\nnostrum rerum est autem sunt rem eveniet architecto"
                   }
                  ]
                )
                done()
            })
        })

    })/* describe("postsFetch() thunk-based action creator..." */


    describe("postsIsFetching()...client-based action...(it uses thunks immediately dispatched by the client...)", () => {

        let store

        beforeAll(() => {
            let sWho = "__tests__/actions.js: postsIsFetching():beforeAll"
            logajohn.debug(`${sWho}(): SHEMP: Moe, storeFactory = `, storeFactory )
            let bServer = true
            store = storeFactory(bServer,{"posts": {"name":"Shemp"}})
            logajohn.debug(`${sWho}(): SHEMP: Moe, store.getState() = `, store.getState() )
        })

        it("can dispatch POSTS_FETCHING true", () => {
            let sWho = "__tests__/actions.js: can dispatch POSTS_FETCHING true"
            //store.dispatch(postsIsFetching(true)) // Naughty, naughty, not for thunks...they get dispatched later...
            postsIsFetching(store.dispatch, true) // Call it the same way it's called in ./src/actions.js/postsFilter()...
            logajohn.debug(`${sWho}(): SHEMP: Moe, store.getState() = `, store.getState() )
            expect(store.getState().posts.posts_fetching).toEqual(true)
        })

        it("can dispatch POSTS_FETCHING false", () => {
            let sWho = "__tests__/actions.js: can dispatch POSTS_FETCHING false"
            postsIsFetching(store.dispatch, false)
            logajohn.debug(`${sWho}(): SHEMP: Moe, store.getState() = `, store.getState() )
            expect(store.getState().posts.posts_fetching).toEqual(false)
        })

    })


    describe("postsLocalFilter()...", () => {

        let store

        let sWhich = `${sWhere}: postsLocalFilter()`

        beforeAll(() => {
            let sWho = `${sWhich}: beforeAll`
            logajohn.debug(`${sWho}(): SHEMP: Moe, storeFactory = `, storeFactory )
            let bServer = true
            store = storeFactory(bServer,{"posts": {remote_posts_list: [...postsFixture.array], posts_list: [...postsFixture.array]}})
            logajohn.debug(`${sWho}(): SHEMP: Moe, store.getState() = `, store.getState() )
        })

        it('filters properly from remote_posts_list into posts_list...', (done) => {
            let sWho = `${sWhich}: filters from remote_posts_list into posts_list...` 

            let leFiltersAlpha = {
                body_filter: "a",
                sort_by_asc_desc: "asc",
                sort_by_field: "title",
                title_filter: "a",
                user_id_filter: "1"
            }

            let leFilters = { user_id_filter: 1, sort_by_field: 'title', sort_by_asc_desc: 'asc' }

            let postsLocalFilterThunk = postsLocalFilter(leFilters) // Thunk returns a function...

            logajohn.debug(`${sWho}(): SHEMP: Moe, dispatchin' postsLocalFilterThunk...`)

            postsLocalFilterThunk(store.dispatch, store.getState)
            //store.dispatch( postsLocalFilterThunk )
            .then(()=>{
                logajohn.debug(`${sWho}(): SHEMP: Moe, after dispatchin' postsLocalFilterThunk(), store.getState() = ${JSON.stringify(store.getState(), null, ' ')}...`)
                expect(store.getState().posts.posts_list).toEqual(
                [
                   {
                    "userId": 1,
                    "id": 2,
                    "title": "qui est esse",
                    "body": "est rerum tempore vitae\nsequi sint nihil reprehenderit dolor beatae ea dolores neque\nfugiat blanditiis voluptate porro vel nihil molestiae ut reiciendis\nqui aperiam non debitis possimus qui neque nisi nulla"
                   },
                   {
                    "userId": 1,
                    "id": 1,
                    "title": "sunt aut facere repellat provident occaecati excepturi optio reprehenderit",
                    "body": "quia et suscipit\nsuscipit recusandae consequuntur expedita et cum\nreprehenderit molestiae ut ut quas totam\nnostrum rerum est autem sunt rem eveniet architecto"
                   }
                  ]
                )
                done()
            })
        })

    })/* describe.("postsLocalFilter()...", () => { */


    describe("postEditStart()...", () => {

        let store

        let sWhich = `${sWhere}: postEditStart()`

        let postIsEditingId = 3 

        let iWhere = postsFixture.array.findIndex((post)=>{ return post.id == postIsEditingId })

        let expectedPostIsEditing = {}
        if( iWhere > -1 ){
            expectedPostIsEditing = {...postsFixture.array[iWhere]}
        }

        beforeAll((done) => {
            let sWho = `${sWhich}: beforeAll`
            logajohn.debug(`${sWho}(): SHEMP: Moe, storeFactory = `, storeFactory )
            let bServer = true
            store = storeFactory(bServer,{"posts": {remote_posts_list: [...postsFixture.array], posts_list: [...postsFixture.array]}})
            logajohn.debug(`${sWho}(): SHEMP: Moe, store.getState() = ${JSON.stringify(store.getState(),null,' ')}...` )

            let postEditStartThunk = postEditStart(postIsEditingId) // Thunk returns a function...

            logajohn.debug(`${sWho}(): SHEMP: Moe, dispatchin' postEditStartThunk()...`)

            postEditStartThunk(store.dispatch, store.getState)
            .then(()=>{
                logajohn.debug(`${sWho}(): SHEMP: Moe, after dispatchin' postEditStartThunk(), store.getState() = ${JSON.stringify(store.getState(), null, ' ')}...`)
                done()
            })
        })

        it('Does not modify remote_posts_list...', ()=>{ 
            expect(store.getState().posts.remote_posts_list).toEqual(postsFixture.array)
        })

        it('Does not modify _posts_list...', ()=>{ 
            expect(store.getState().posts.posts_list).toEqual(postsFixture.array)
        })

        it('Sets post_is_editing to true...', ()=>{ 
            expect(store.getState().posts.post_is_editing).toBe(true)
        })

        it('Sets post_is_editing_id to ${postIsEditingId}...', ()=>{ 
            expect(store.getState().posts.post_is_editing_id).toBe(postIsEditingId)
        })

        it(`Sets post_is_editing_post to ${JSON.stringify(expectedPostIsEditing)}...`, ()=>{ 
            expect(store.getState().posts.post_is_editing_post).toEqual(expectedPostIsEditing)
        })

        //let posts_is_editing_post = store.getState().posts.post_is_editing_post
        //Object.keys(post_is_editing_post).forEach((key)=>{
        //    it(`Sets post_is_editing_post["${key}"] to ${JSON.stringify(expectedPostIsEditing[key])}...`, ()=>{
        //        expect(post_is_editing_post[key]).toEqual(expectedPostIsEditing[key])
        //    })
        //})

        //expect(store.getState().posts.post_is_editing_post.userId).toBe(2)
        //expect(store.getState().posts.post_is_editing_post.id).toBe(3)
        //expect(store.getState().posts.post_is_editing_post.title).toBe("ea molestias quasi exercitationem repellat qui ipsa sit aut")
        //expect(store.getState().posts.post_is_editing_post.body).toBe("et iusto sed quo iure\nvoluptatem occaecati omnis eligendi aut ad\nvoluptatem doloribus vel accusantium quis pariatur\nmolestiae porro eius odio et labore et velit aut")

    })

    describe("postEditCancel()...", () => {

        let store

        let sWhich = `${sWhere}: postEditCancel()`

        let postIsEditingId = 3

        beforeAll((done) => {
            let sWho = `${sWhich}: beforeAll`

            logajohn.debug(`${sWho}(): SHEMP: Moe, storeFactory = `, storeFactory )
            let bServer = true

            store = storeFactory(bServer,{"posts": {remote_posts_list: [...postsFixture.array], posts_list: [...postsFixture.array]}})
            logajohn.debug(`${sWho}(): SHEMP: Moe, store.getState() = `, store.getState() )

            logajohn.debug(`${sWho}(): SHEMP: Moe, dispatchin' postEditCancel()...`)
            store.dispatch( postEditCancel(postIsEditingId) )
            logajohn.debug(`${sWho}(): SHEMP: Moe, after dispatchin' postEditCancel(), store.getState() = ${JSON.stringify(store.getState(), null, ' ')}...`)
            done()
        })

        it(`Sets post_is_editing to false...`, ()=>{
            expect(store.getState().posts.post_is_editing).toBe(false)
        })

        it(`Sets post_is_editing_id to ${postIsEditingId}...`, ()=>{
                expect(store.getState().posts.post_is_editing_id).toBe(postIsEditingId)
        })

        it(`Does not modify remote_posts_list...`, ()=>{
            expect(store.getState().posts.remote_posts_list).toEqual(postsFixture.array)
        })

        it(`Does not modify posts_list...`, ()=>{
            expect(store.getState().posts.posts_list).toEqual(postsFixture.array)
        })

    }) /* postEditCancel */


    describe("postEditFinish()...", () => {

        let store

        let sWhich = `${sWhere}: postEditFinish()`

        let editedPost = {
                      "userId": 2,
                      "id": 3,
                      //"title": "ea molestias quasi exercitationem repellat qui ipsa sit aut",
                      "title": "I changed the title",
                      "body": "et iusto sed quo iure\nvoluptatem occaecati omnis eligendi aut ad\nvoluptatem doloribus vel accusantium quis pariatur\nmolestiae porro eius odio et labore et velit aut"
        }

        let postIsEditingId = editedPost.id

        let expectedNewRemotePostsList = [...postsFixture.array]

        let iWhere = expectedNewRemotePostsList.findIndex((post)=>{ return post.id == postIsEditingId })

        if( iWhere > -1 ){
            expectedNewRemotePostsList[iWhere] = editedPost
        }


        beforeAll((done) => {
            let sWho = `${sWhich}: beforeAll`

            logajohn.debug(`${sWho}(): SHEMP: Moe, storeFactory = `, storeFactory )
            let bServer = true

            store = storeFactory(bServer,{"posts": {remote_posts_list: [...postsFixture.array], posts_list: [...postsFixture.array]}})
            logajohn.debug(`${sWho}(): SHEMP: Moe, store.getState() = `, store.getState() )

            let postEditFinishThunk = postEditFinish(postIsEditingId, editedPost) // Thunk returns a function...
            logajohn.debug(`${sWho}(): SHEMP: Moe, dispatchin' postEditStartThunk()...`)

            postEditFinishThunk(store.dispatch, store.getState)
            .then(()=>{
                logajohn.debug(`${sWho}(): SHEMP: Moe, after dispatchin' postEditFinishThunk(), store.getState() = ${JSON.stringify(store.getState(), null, ' ')}...`)
                done()
            })
        })

        it(`Sets post_is_editing to false...`, ()=>{
            expect(store.getState().posts.post_is_editing).toBe(false)
        })

        it(`Sets post_is_editing_id to ${postIsEditingId}...`, ()=>{
                expect(store.getState().posts.post_is_editing_id).toBe(postIsEditingId)
        })

        it(`Sets post_is_editing_post to editedPost argument supplied...`, ()=>{
                expect(store.getState().posts.post_is_editing_post).toEqual(editedPost)
        })
           
        it(`Modifies element[${iWhere}] of remote_posts_list...`, ()=>{
            expect(store.getState().posts.remote_posts_list[iWhere]).toEqual(editedPost)
        })

        it(`Modifies *only* element[${iWhere}] of remote_posts_list...`, ()=>{
            expect(store.getState().posts.remote_posts_list).toEqual(expectedNewRemotePostsList)
        })

        it(`Does not modify posts_list...`, ()=>{
            expect(store.getState().posts.posts_list).toEqual(postsFixture.array)
        })
        

    }) /* postEditFinish */



})
