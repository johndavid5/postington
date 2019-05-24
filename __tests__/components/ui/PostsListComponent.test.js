jest.mock('react-router')
// Otherwise you get Error...
// `Invariant Violation: You should not use <Route> or withRouter() outside a <Router>`

import PostsListComponent from '../../../src/components/ui/PostsListComponent'

import postsFixture from '../../models/fixtures/posts.json'

const { shallow, mount } = Enzyme

import { config } from '../../../src/config'
import { logajohn } from '../../../src/lib/logajohn'
import { customStringify } from '../../../src/lib/utils'

let sWhere = "__tests__/components/ui/PostsListComponent.test.js"

logajohn.setLevel(config.DEBUG_LEVEL)
logajohn.debug(`${sWhere}: logajohn.getLevel()=${logajohn.getLevel()}...`)


describe("<PostsListComponent /> UI Component", () => {

    it("renders timestamp if posts.posts_timestamp is supplied...", () => {
        let sWho = `${sWhere}: <PostsListComponent /> UI Component -- renders timestamp ` + 
           ` if posts.posts_timestamp is supplied...`
        let faux_timestamp = "MOE: No, I just left!"
        let wrapper = mount(<PostsListComponent posts={{posts_timestamp: faux_timestamp}} />)
        let findee = wrapper.find('#posts-timestamp')
        logajohn.debug(`${sWho} -- SHEMP: Moe, findee.html() = `, findee.html() )
        logajohn.debug(`${sWho} -- SHEMP: Moe, findee.text() = `, findee.text() )
        expect(findee.length).toBe(1)
        expect(findee.text()).toBe(faux_timestamp)
    })

    it("renders text list of filters...", () => {
        let sWho = `${sWhere}: <PostsListComponent /> UI Component -- renders filters`

        let faux_title_filter = "en"
        let faux_body_filter = "excelsis"
        let faux_posts_filters = { "title_filter": faux_title_filter, "body_filter": faux_body_filter }

        let wrapper = mount(<PostsListComponent posts={{posts_filters: faux_posts_filters}} />)

        let title_findee = wrapper.find('#static-title-filter')
        logajohn.debug(`${sWho} -- SHEMP: Moe, title_findee.text() = `, title_findee.text() )
        expect(title_findee.length).toBe(1)
        expect(title_findee.text()).toBe(faux_title_filter)

        let body_findee = wrapper.find('#static-body-filter')
        logajohn.debug(`${sWho} -- SHEMP: Moe, body_findee.text() = `, body_findee.text() )
        expect(body_findee.length).toBe(1)
        expect(body_findee.text()).toBe(faux_body_filter)
    })

    it("does not render static filters if not specified...", () => {
        let sWho = `${sWhere}: <PostsListComponent /> UI Component -- renders filters`

        let faux_description_filter = ""
        let faux_full_name_filter = ""
        let faux_posts_filters = { "description_filter": faux_description_filter, "full_name_filter": faux_full_name_filter }

        let wrapper = mount(<PostsListComponent posts={{posts_filters: faux_posts_filters}} />)

        expect(wrapper.find('#static-description-filter').length).toBe(0);
        expect(wrapper.find('#static-full-name--filter').length).toBe(0);
    })

    it("does not render timestamp if posts.posts_timestamp is not supplied...", () => {
        let wrapper = mount(<PostsListComponent posts={{}} />)
        expect(wrapper.find('#posts-timestamp').length).toBe(0)
    })

    it("renders table of posts if posts.posts_list is populated...", () => {
        let sWho = `${sWhere}: <PostsListComponent /> UI Component -- renders table of posts if posts.posts_list is populated`
        let postsProp = {posts_list: postsFixture.array}
        let wrapper = mount(<PostsListComponent posts={postsProp} />)
        logajohn.debug(`${sWho} -- SHEMP: Moe, postsFixture = `, JSON.stringify(postsFixture, null, ' ') )
        logajohn.debug(`${sWho} -- SHEMP: Moe, postsProp = `, JSON.stringify(postsProp, null, ' ') )
        logajohn.debug(`${sWho} -- SHEMP: Moe, postsFixture.array = `, postsFixture.array )
        logajohn.debug(`${sWho} -- SHEMP: Moe, postsFixture.array.length = `, postsFixture.array.length )

        logajohn.debug(`${sWho} -- SHEMP: Moe, wrapper.html() = `, wrapper.html() )
        logajohn.debug(`${sWho} -- SHEMP: Moe, wrapper.find('#posts-table').html() = `, wrapper.find('#posts-table').html() )
        expect(wrapper.find('#posts-table').length).toBe(1)
        let num_rows = wrapper.find('#posts-table').find('tr').length
        logajohn.debug(`${sWho} -- SHEMP: Moey, wrapper.find('#posts-table').find('tr').length = `, num_rows )

        // postsFixture.length+1 because of extra <tr> with <th> headings...
        expect(wrapper.find('#posts-table').find('tr').length).toBe(postsFixture.array.length+1)

        // Check for '#title-<id1>', '#title-<id2>', ...
        // Check for '#body-<id1>', '#body-<id2>', ...
        postsFixture.array.forEach((faux_post)=>{
            ['title', 'body'].forEach((field)=>{
                let le_id = '#'+ field + '-' + faux_post.id
                logajohn.debug(`${sWho} -- SHEMP: Moe, look for id = '${le_id}' in dhere, Moe...`)
                ////logajohn.debug(`${sWho} -- SHEMP: Moe, wrapper.find(${le_id}) = `, customStringify(wrapper.find(le_id)) )
                //logajohn.debug(`${sWho} -- SHEMP: Moe, wrapper.find(${le_id}).length = `, wrapper.find(le_id).length )
                //logajohn.debug(`${sWho} -- SHEMP: Moe, wrapper.find(${le_id}).text() = '${wrapper.find(le_id).text()}'...`)
                expect(wrapper.find(le_id).length).toBe(1)
                expect(wrapper.find(le_id).text()).toEqual(faux_post[field])
            })
        })

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

        let faux_title_filter = "en"
        let faux_body_filter = "excelsis"
        let faux_posts_filters = { "title_filter": faux_title_filter, "body_filter": faux_body_filter }

        let wrapper = mount(<PostsListComponent onPostsFilter={_onPostsFilter} posts={{posts_filters: faux_posts_filters, posts_list: postsFixture.array}} />)

            wrapper
            .find('#sort-by-title')
            .simulate('click')

        logajohn.debug(`${sWho} -- SHEMP: Moe, _onPostsFilter.mock.calls=`, _onPostsFilter.mock.calls )

        expect(_onPostsFilter).toBeCalled()

        expect(_onPostsFilter.mock.calls[0][0].sort_by_field).toEqual('title') // sort by description asc
        expect(_onPostsFilter.mock.calls[0][0].sort_by_asc_desc).toEqual('asc') // sort by description asc
        expect(_onPostsFilter.mock.calls[0][0].title_filter).toEqual(faux_title_filter) // did not clobber description_filter...
        expect(_onPostsFilter.mock.calls[0][0].body_filter).toEqual(faux_body_filter) // did not clobber description_filter...
    })

})
