jest.mock('react-router')
// Otherwise you get Error...
// `Invariant Violation: You should not use <Route> or withRouter() outside a <Router>`

import PostsListComponent from '../../../src/components/ui/PostsListComponent'

import postsFixture from '../../models/fixtures/posts.json'

const { shallow, mount } = Enzyme

import { config } from '../../../src/config'
import { logajohn } from '../../../src/lib/logajohn'
import { utils } from '../../../src/lib/utils'
import { customStringify } from '../../../src/lib/utils'

let sWhere = "__tests__/components/ui/PostsListComponent.test.js"

logajohn.setLevel(config.DEBUG_LEVEL)
logajohn.debug(`${sWhere}: logajohn.getLevel()=${logajohn.getLevel()}...`)


describe("<PostsListComponent /> UI Component", () => {

    let sWhat = `${sWhere}::<PostsListComponent /> UI Component`

    it('renders timestamp if posts.posts_timestamp is supplied...', () => {
        let sWho = `${sWhat}: renders timestamp if posts.posts_timestamp is supplied...`
        let faux_timestamp = "MOE: No, I just left!"
        let wrapper = mount(<PostsListComponent posts={{posts_timestamp: faux_timestamp}} />)
        let findee = wrapper.find('#posts-timestamp')
        logajohn.debug(`${sWho} -- SHEMP: Moe, findee.html() = `, findee.html() )
        logajohn.debug(`${sWho} -- SHEMP: Moe, findee.text() = `, findee.text() )
        expect(findee.length).toBe(1)
        expect(findee.text()).toBe(faux_timestamp)
    })

    it('does not render timestamp if posts.posts_timestamp is not supplied...', () => {
        let wrapper = mount(<PostsListComponent posts={{}} />)
        expect(wrapper.find('#posts-timestamp').length).toBe(0)
    })

    it('renders text list of filters...', () => {
        let sWho = `${sWhat}: renders text list of filters...`

        let faux_user_id_filter = 27
        let faux_title_filter = 'en'
        let faux_body_filter = 'excelsis'
        let faux_posts_filters = { user_id_filter: faux_user_id_filter, title_filter: faux_title_filter, body_filter: faux_body_filter }

        let wrapper = mount(<PostsListComponent posts={{posts_filters: faux_posts_filters}} />)

        let user_id_findee = wrapper.find('#static-user-id-filter')
        logajohn.debug(`${sWho} -- SHEMP: Moe, user_id_findee.text() = `, user_id_findee.text() )
        expect(user_id_findee.length).toBe(1)
        expect(user_id_findee.text()).toBe(""+faux_user_id_filter) // coerce faux_user_id_filter to string since text() is always a string

        let title_findee = wrapper.find('#static-title-filter')
        logajohn.debug(`${sWho} -- SHEMP: Moe, title_findee.text() = `, title_findee.text() )
        expect(title_findee.length).toBe(1)
        expect(title_findee.text()).toBe(faux_title_filter)

        let body_findee = wrapper.find('#static-body-filter')
        logajohn.debug(`${sWho} -- SHEMP: Moe, body_findee.text() = `, body_findee.text() )
        expect(body_findee.length).toBe(1)
        expect(body_findee.text()).toBe(faux_body_filter)
    })

    it('does not render static filters if empty string, null, or not specified...', () => {
        let sWho = `${sWhat}: does not render static filters if empty string, null, or not specified...`

        let faux_description_filter = null
        let faux_full_name_filter = ""
        // Note: user_id_filter not specified at all...
        let faux_posts_filters = { description_filter: faux_description_filter, full_name_filter: faux_full_name_filter }

        let wrapper = mount(<PostsListComponent posts={{posts_filters: faux_posts_filters}} />)

        expect(wrapper.find('#static-user-id-filter').length).toBe(0);
        expect(wrapper.find('#static-description-filter').length).toBe(0);
        expect(wrapper.find('#static-full-name--filter').length).toBe(0);
    })




    it("does not render table of posts if posts.posts_list is nonexistent...", () => {
        let wrapper = mount(<PostsListComponent posts={{}} />)
        expect(wrapper.find('#posts-table').length).toBe(0)
    })

    it("does not render table of posts if posts.posts_list is of length zero...", () => {
        let wrapper = mount(<PostsListComponent posts={{posts_list: []}} />)
        expect(wrapper.find('#posts-table').length).toBe(0)
    })

    it("shows spinning gears if posts.posts_fetching is true... ", () => {
        let wrapper = mount(<PostsListComponent posts={{posts_fetching: true}} />)
        expect(wrapper.find('#spinning-gears').length).toBe(1)
    })

    it("does not show spinning gears if posts.posts_fetching is nonexistent... ", () => {
        let wrapper = mount(<PostsListComponent posts={{}} />)
        expect(wrapper.find('#spinning-gears').length).toBe(0)
    })

    it("does not show spinning gears if posts.posts_fetching is false... ", () => {
        let wrapper = mount(<PostsListComponent posts={{posts_fetching: false}} />)
        expect(wrapper.find('#spinning-gears').length).toBe(0)
    })

    // NOTE: Using the actual SortButton subcomponent...I don't think we need to mock it...
    it("Click on 'title' table heading invokes onPostsFilter() with sort_by_field='title', but preserving other filters...", ()=>{

        let sWho = sWhere + ": click on heading invokes onPostsFilter - description "

        const _onPostsFilter = jest.fn()

        let faux_user_id_filter = 27
        let faux_title_filter = "en"
        let faux_body_filter = "excelsis"
        let faux_posts_filters = { user_id_filter: faux_user_id_filter, title_filter: faux_title_filter, body_filter: faux_body_filter }

        let wrapper = mount(<PostsListComponent onPostsFilter={_onPostsFilter} posts={{posts_filters: faux_posts_filters, posts_list: postsFixture.array}} />)

            wrapper
            .find('#sort-by-title')
            .simulate('click')

        logajohn.debug(`${sWho} -- SHEMP: Moe, _onPostsFilter.mock.calls=`, _onPostsFilter.mock.calls )

        expect(_onPostsFilter).toBeCalled()

        expect(_onPostsFilter.mock.calls[0][0].sort_by_field).toEqual('title') // sort by description asc
        expect(_onPostsFilter.mock.calls[0][0].sort_by_asc_desc).toEqual('asc') // sort by description asc
        expect(_onPostsFilter.mock.calls[0][0].user_id_filter).toEqual(faux_user_id_filter) // did not clobber description_filter...
        expect(_onPostsFilter.mock.calls[0][0].title_filter).toEqual(faux_title_filter) // did not clobber description_filter...
        expect(_onPostsFilter.mock.calls[0][0].body_filter).toEqual(faux_body_filter) // did not clobber description_filter...
    })

})

describe('<PostsListComponent /> - table rendering', ()=>{

        let sWhat =  '<PostsListComponent /> - table rendering'

        let sWho = `${sWhat}: renders table of posts if posts.posts_list is populated...`
        let sDesc = `renders table of posts if posts.posts_list is populated...`
        
        let postsProp = {posts_list: postsFixture.array}
        let wrapper = mount(<PostsListComponent posts={postsProp} />)
        logajohn.debug(`${sWho} -- SHEMP: Moe, postsFixture = `, JSON.stringify(postsFixture, null, ' ') )
        logajohn.debug(`${sWho} -- SHEMP: Moe, postsProp = `, JSON.stringify(postsProp, null, ' ') )
        logajohn.debug(`${sWho} -- SHEMP: Moe, postsFixture.array = `, postsFixture.array )
        logajohn.debug(`${sWho} -- SHEMP: Moe, postsFixture.array.length = `, postsFixture.array.length )

        logajohn.debug(`${sWho} -- SHEMP: Moe, wrapper.html() = `, utils.customStringify( wrapper.html()) )
        logajohn.debug(`${sWho} -- SHEMP: Moe, wrapper.find('#posts-table').html() = `, wrapper.find('#posts-table').html() )
        it( sDesc + '#posts-table element exists...', ()=>{
            expect(wrapper.find('#posts-table').length).toBe(1)
        })

        it( sDesc + 'number of <tr> elements == postsFixture.array.lengty + 1 (+1 because extra <tr> with <th> headings)', ()=>{
            let num_rows = wrapper.find('#posts-table').find('tr').length
            logajohn.debug(`${sWho} -- SHEMP: Moey, wrapper.find('#posts-table').find('tr').length = `, num_rows )

           // postsFixture.length+1 because of extra <tr> with <th> headings...
           expect(wrapper.find('#posts-table').find('tr').length).toBe(postsFixture.array.length+1)
        }) 

        // Check for '#title-<id1>', '#title-<id2>', ...
        // Check for '#body-<id1>', '#body-<id2>', ...
        postsFixture.array.forEach((faux_post,index)=>{

            //logajohn.debug(`${sWho} -- SHEMP: Moe, faux_post[${index}] = `, faux_post )

            [{field: 'userId', id_prefix: 'user-id'}, {field: 'title', id_prefix: 'title'}, {field: 'body', id_prefix: 'body'}].forEach(({field, id_prefix})=>{
                let le_id = '#'+ id_prefix + '-' + faux_post.id
                logajohn.debug(`${sWho} -- SHEMP: Moe, field='${field}', id_prefix='${id_prefix}', le_id='${le_id}'...`) 
                logajohn.debug(`${sWho} -- SHEMP: Moe, look for id = '${le_id}' in dhere, Moe...`)
                ////logajohn.debug(`${sWho} -- SHEMP: Moe, wrapper.find(${le_id}) = `, customStringify(wrapper.find(le_id)) )
                //logajohn.debug(`${sWho} -- SHEMP: Moe, wrapper.find(${le_id}).length = `, wrapper.find(le_id).length )
                logajohn.debug(`${sWho} -- SHEMP: Moe, wrapper.find(${le_id}).length = '${wrapper.find(le_id).length}'...`)
                logajohn.debug(`${sWho} -- SHEMP: Moe, wrapper.find(${le_id}).text() = '${wrapper.find(le_id).text()}'...`)
                logajohn.debug(`${sWho} -- SHEMP: Moe, does wrapper.find(${le_id}).text() equal faux_post[field='${field}'] = `, faux_post[field],`...?`)
                it( sDesc + `find '${le_id}' in table...`, ()=>{
                    expect(wrapper.find(le_id).length).toBe(1)
                    expect(wrapper.find(le_id).text()).toEqual(""+faux_post[field]) // coerce to string if necessary...
                })
            })
        })

})


describe("<PostsListComponent /> - Edit ", () => {


        // Use to confirm componentDidUpdate() was called,
        // and also to spy on state since wrapper.instance().state()
        // isn't working...
        const _componentDidUpdateSpy = jest.fn()

        const _onPostEditStartSpy = jest.fn() // Spy on connector function supplied via props.onPostEditStart()

        const _onPostEditFinishSpy = jest.fn() // Spy on connector function supplied via props.onPostEditFinish()

        const _onPostEditCancelSpy = jest.fn() // Spy on connector function supplied via props.onPostEditCancel()

        let postsProp = {posts_list: postsFixture.array}
        let postsListComponentWrapper = mount(<PostsListComponent posts={postsProp} componentDidUpdateSpy={_componentDidUpdateSpy} onPostEditStart={_onPostEditStartSpy} onPostEditFinish={_onPostEditFinishSpy} onPostEditCancel={_onPostEditCancelSpy} />) 

        let clickPost = postsFixture.array[0]
        let editedPost = {}
        

        let trWrapper = null 

        let sDesc = '(1) Clicking on a table row ultimately call the onPostEditStart( post_id ) connector dispatch method, supplying the post_id...'

        it( sDesc, ()=>{
            let sWho = `${sWhere}: ${sDesc}` 
            trWrapper = postsListComponentWrapper.find('#post-'+clickPost.id)
            logajohn.debug(`${sWho} -- SHEMP: Moe, trWrapper.html() = `, utils.customStringify( trWrapper.html() ) )
            expect(trWrapper.length).toBe(1)

            trWrapper
            .simulate('click')

            let iLength = _onPostEditStartSpy.mock.calls.length
            logajohn.debug(`${sWho}(): AFTER simulatin' click: SHEMP: Moe, _onPostEditStartSpy.mock.calls.length = `,  utils.customStringify(_onPostEditStartSpy.mock.calls.length, ' ') )
            for( let i = 0 ; i < iLength; i++ ){
             logajohn.debug(`${sWho}(): AFTER simulatin' click: SHEMP: Moe, _onPostEditStartSpy.mock.calls[${i}] = `,  utils.customStringify(_onPostEditStartSpy.mock.calls[i], ' ') )
            }
            expect(_onPostEditStartSpy.mock.calls[iLength-1][0]).toEqual(clickPost.id) 
            
            iLength = _componentDidUpdateSpy.mock.calls.length
            logajohn.debug(`${sWho}(): AFTER simulatin' click: SHEMP: Moe, _componentDidUpdateSpy.mock.calls.length = `,  utils.customStringify(_componentDidUpdateSpy.mock.calls.length, ' ') )
            for( let i = 0 ; i < iLength; i++ ){
             logajohn.debug(`${sWho}(): AFTER simulatin' click: SHEMP: Moe, _componentDidUpdateSpy.mock.calls[${i}] = `,  utils.customStringify(_componentDidUpdateSpy.mock.calls[i], ' ') )
            }

        })

        sDesc = '(2) When onPostEditStart() connector is dispatched, setting props.post_is_editing=true, props.post_is_editing_id and props.post_is_editing, it causes state.postIsEditingPost and state.postsIsEditingId to be set via componentDidUpdate(), and also makes the post edit form visible...'

        it( sDesc, ()=>{
            let sWho = `${sWhere}: ${sDesc}` 

            // Edit Form not in the DOM when not in edit mode...
            expect(postsListComponentWrapper.find('#post-edit-title-form-'+clickPost.id).length).toBe(0)

            let postsPropsNew = { post_is_editing: true, post_is_editing_id: clickPost.id, post_is_editing_post: { ...clickPost }, posts_list: postsFixture.array }

            logajohn.debug(`${sWho}(): SHEMP: Callin' postsListComponentWrapper.setProps({posts: postsPropsNew=`, postsPropsNew, `})...`)
            postsListComponentWrapper.setProps({ posts: postsPropsNew })
            postsListComponentWrapper.update()

            let iLength = _componentDidUpdateSpy.mock.calls.length
            logajohn.debug(`${sWho}(): AFTER dispatchin' edit props: SPOCK: Captain, _componentDidUpdateSpy.mock.calls.length = `,  utils.customStringify(_componentDidUpdateSpy.mock.calls.length, ' ') )
            for( let i = 0 ; i < iLength; i++ ){
                logajohn.debug(`${sWho}(): AFTER dispatchin' edit props: SPOCK: Captain, _componentDidUpdateSpy.mock.calls[${i}/${iLength-1}] = `,  utils.customStringify(_componentDidUpdateSpy.mock.calls[i], ' ') )
            }


            expect(_componentDidUpdateSpy.mock.calls[iLength-1][0]['currState']['postIsEditingId']).toEqual( postsPropsNew.post_is_editing_id )
            expect(_componentDidUpdateSpy.mock.calls[iLength-1][0]['currState']['postIsEditingPost']).toEqual( postsPropsNew.post_is_editing_post )

            logajohn.debug(`${sWho} -- SHEMP: Moe, after dispatchin' edit props, trWrapper.html() = `, utils.customStringify( trWrapper.html()) )

            // Edit Form is found in the DOM when in edit mode...
            expect(postsListComponentWrapper.find('#post-edit-title-form-'+clickPost.id).length).toBe(1)
            expect(postsListComponentWrapper.find('#title-edit-'+clickPost.id).length).toBe(1)
            expect(postsListComponentWrapper.find('#title-edit-ok-button-'+clickPost.id).length).toBe(1)
            expect(postsListComponentWrapper.find('#title-edit-cancel-button-'+clickPost.id).length).toBe(1)

        })

        sDesc = `(3) When title edit field, '#title-edit-<post_id>' is modified, handleTitleEditChange() updates state.postIsEditingPost.title to reflect the new title value.`

        it( sDesc, ()=>{
            let sWho = `${sWhere}: ${sDesc}` 

            let fauxChangeEvent = { target: { name: 'titleEdit', value: 'foo' }}
            logajohn.debug(`${sWho}(): SHEMP: Moe, simulatin' 'change' event = `, fauxChangeEvent )
            let titleEditWrapper = postsListComponentWrapper.find('#title-edit-'+clickPost.id)
            titleEditWrapper.simulate('change', fauxChangeEvent )

            let iLength = _componentDidUpdateSpy.mock.calls.length
            logajohn.debug(`${sWho}(): AFTER faux change of titleEdit field:  _componentDidUpdateSpy.mock.calls.length = `,  utils.customStringify(_componentDidUpdateSpy.mock.calls.length, ' ') )
            for( let i = 0 ; i < iLength; i++ ){
                logajohn.debug(`${sWho}(): AFTER faux change of titleEdit field _componentDidUpdateSpy.mock.calls[${i}/${iLength-1}] = `,  utils.customStringify(_componentDidUpdateSpy.mock.calls[i], ' ') )
            }

            // In editedPost, title has now been set to 'foo'...
            editedPost = {...clickPost, title: fauxChangeEvent.target.value }

            // Confirm that state.postIsEditingPost has changed...
            expect(_componentDidUpdateSpy.mock.calls[iLength-1][0]['currState']['postIsEditingPost']).toEqual( editedPost )

            // Confirm that the state.postIsEditingPost has been set to 'foo'
            expect(_componentDidUpdateSpy.mock.calls[iLength-1][0]['currState']['postIsEditingPost']['title']).toEqual( fauxChangeEvent.target.value )
        })

        sDesc = `(3) When the OK button is pressed on the post edit form, calls the props.onPostEditFinish dispatch method with arguments props.posts.post_is_editing_id, and state.postsIsEditingPost, which is the edited post...` 

        it( sDesc, ()=>{
            let sWho = `${sWhere}: ${sDesc}` 

            let okButtonWrapper = postsListComponentWrapper.find('#title-edit-ok-button-'+clickPost.id)

            okButtonWrapper
            .simulate('click')

            let iLength = _onPostEditFinishSpy.mock.calls.length
            logajohn.debug(`${sWho}(): AFTER simulatin' click: SHEMP: Moe, _onPostEditFinishSpy.mock.calls.length = `,  utils.customStringify(_onPostEditFinishSpy.mock.calls.length, ' ') )
            for( let i = 0 ; i < iLength; i++ ){
             logajohn.debug(`${sWho}(): AFTER simulatin' click: SHEMP: Moe, _onPostEditFinishSpy.mock.calls[${i}] = `,  utils.customStringify(_onPostEditFinishSpy.mock.calls[i], ' ') )
            }
            expect(_onPostEditFinishSpy.mock.calls[iLength-1][0]).toEqual(clickPost.id) 
            expect(_onPostEditFinishSpy.mock.calls[iLength-1][1]).toEqual(editedPost) 
            
            iLength = _componentDidUpdateSpy.mock.calls.length
            logajohn.debug(`${sWho}(): AFTER simulatin' click: SHEMP: Moe, _componentDidUpdateSpy.mock.calls.length = `,  utils.customStringify(_componentDidUpdateSpy.mock.calls.length, ' ') )
            for( let i = 0 ; i < iLength; i++ ){
             logajohn.debug(`${sWho}(): AFTER simulatin' click: SHEMP: Moe, _componentDidUpdateSpy.mock.calls[${i}] = `,  utils.customStringify(_componentDidUpdateSpy.mock.calls[i], ' ') )
            }

        })

        sDesc = '(4) If Cancel button is hit on Post Edit form, it dispatches onPostEditCancel( post_is_editing_id )...' 

        it( sDesc, ()=>{
            let sWho = `${sWhere}: ${sDesc}` 

            let cancelButtonWrapper = postsListComponentWrapper.find('#title-edit-cancel-button-'+clickPost.id)

            cancelButtonWrapper
            .simulate('click')

            iLength = _onPostEditCancelSpy.mock.calls.length
            logajohn.debug(`${sWho}(): AFTER simulatin' click: SHEMP: Moe, _onPostEditCancelSpy.mock.calls.length = `,  utils.customStringify(_onPostEditCancelSpy.mock.calls.length, ' ') )
            for( let i = 0 ; i < iLength; i++ ){
             logajohn.debug(`${sWho}(): AFTER simulatin' click: SHEMP: Moe, _onPostEditCancelSpy.mock.calls[${i}] = `,  utils.customStringify(_onPostEditCancelSpy.mock.calls[i], ' ') )
            }
            expect(_onPostEditCancelSpy.mock.calls[iLength-1][0]).toEqual(clickPost.id) 
            
            let iLength = _componentDidUpdateSpy.mock.calls.length
            logajohn.debug(`${sWho}(): AFTER simulatin' click: SHEMP: Moe, _componentDidUpdateSpy.mock.calls.length = `,  utils.customStringify(_componentDidUpdateSpy.mock.calls.length, ' ') )
            for( let i = 0 ; i < iLength; i++ ){
             logajohn.debug(`${sWho}(): AFTER simulatin' click: SHEMP: Moe, _componentDidUpdateSpy.mock.calls[${i}] = `,  utils.customStringify(_componentDidUpdateSpy.mock.calls[i], ' ') )
            }

        })



})


