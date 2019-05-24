jest.mock('react-router')
// Otherwise you get Error...
// `Invariant Violation: You should not use <Route> or withRouter() outside a <Router>`

import PostsFilterForm from '../../../src/components/ui/PostsFilterForm'

const { shallow, mount } = Enzyme

import { config } from '../../../src/config'
import { logajohn } from '../../../src/lib/logajohn'
import { utils } from '../../../src/lib/utils'

let sWhere = '__tests__/components/ui/PostsFilterform.test.js' 

logajohn.setLevel(config.DEBUG_LEVEL)
logajohn.debug(`${sWhere}: logajohn.getLevel()=${logajohn.getLevel()}...`)

//logajohn.debug(`${sWhere}: PostsFilterForm = ${JSON.stringify(PostsFilterForm, null, ' ')}...`)

describe('<PostsFilterForm /> UI Component', () => {

    let sWhat = `${sWhere}::<PostsFilterForm /> UI Component`

    it.skip('renders submit button', () =>{
        let sWho = `${sWhat}::renders submit button`
        let postsFilterFormWrapper = mount(<PostsFilterForm props />)
        logajohn.debug(`${sWho}: postsFilterFormWrapper.debug() =\n${postsFilterFormWrapper.debug()}...`)
        //logajohn.debug(`${sWho}: postsFilterFormWrapper.html() = ${JSON.stringify(postsFilterFormWrapper.html(), null, ' ')}...`)
        //logajohn.debug(`${sWho}: postsFilterFormWrapper.state() = ${JSON.stringify(postsFilterFormWrapper.state(), null, ' ')}...`)
        //logajohn.debug(`${sWho}: postsFilterFormWrapper.instance.state = ${JSON.stringify(postsFilterFormWrapper.instance.state, null, ' ')}...`)
        //logajohn.debug(`${sWho}: postsFilterFormWrapper.props() = ${JSON.stringify(postsFilterFormWrapper.props(), null, ' ')}...`)
        //logajohn.debug(`${sWho}: postsFilterFormWrapper.instance.props = ${JSON.stringify(postsFilterFormWrapper.instance().props, null, ' ')}...`)
        //logajohn.debug(`${sWho}: postsFilterFormWrapper = ${JSON.stringify(postsFilterFormWrapper, null, ' ')}...`)
        //logajohn.debug(`${sWho}: postsFilterFormWrapper.length = ${JSON.stringify(postsFilterFormWrapper.length, null, ' ')}...`)
        //for(let i=0; i< postsFilterFormWrapper.length; i++ ){
        //    logajohn.debug(`${sWho}: postsFilterFormWrapper[${i}] = ${JSON.stringify(postsFilterFormWrapper.at(i), null, ' ')}...`)
        //}
        //expect(mount(<PostsFilterForm />).find('#load-posts').length).toBe(1)
        expect(postsFilterFormWrapper.find('#load-posts').length).toBe(1)
    })


    it.skip("submit invokes onPostsFilter", () => {

        let sWho = `${sWhere}: submit invokes onPostsFilter`

        const _onPostsFilter = jest.fn()
        mount(<PostsFilterForm onPostsFilter={_onPostsFilter} />)
            .find('#load-posts')
            .simulate('submit')
        expect(_onPostsFilter).toBeCalled()
    })


    it.skip("submit invokes onPostsFilter -- with user_id_filter, title_filter and body_filter passed along -- and with sort filters preserved", () => {

        let sWho = `${sWhere}: submit invokes onPostsFilter -- with title_filter and body_filter passed along -- and with sort filters preserved`

        const _onPostsFilter = jest.fn() // mock _onPostsFilter...

        let s_faux_user_id_filter = '3'
        let s_faux_title_filter = 'secula'
        let s_faux_body_filter = 'lorum'
        
        // SHEMP: Moe, I've already attempted to simulate user input,
        // ...but it ain't worked yet...
        // ...instead I'm colludin' widh dha PostsFilterForm and
        // usin' dhe titleFilter and bodyFilter props
        // to simulate the user settin' dhose filter...
        let faux_posts_filters = {
           "sort_by_field": "body",
           "sort_by_asc_desc": "desc"
        }
        let wrapper = mount(<PostsFilterForm
            userIdFilter={s_faux_user_id_filter}
            titleFilter={s_faux_title_filter}
            bodyFilter={s_faux_body_filter}
            onPostsFilter={_onPostsFilter}
            posts={{posts_filters: faux_posts_filters}}  />)

        const user_id_filter_wrapper = wrapper.find('#user-id-filter');
        expect(user_id_filter_wrapper.at(0).props().value).toEqual(s_faux_user_id_filter) // Confirm value of #user_id-filter set via props...

        const title_filter_wrapper = wrapper.find('#title-filter');
        expect(title_filter_wrapper.at(0).props().value).toEqual(s_faux_title_filter) // Confirm value of #title-filter set via props...

        const body_filter_wrapper = wrapper.find('#body-filter');
        expect(body_filter_wrapper.at(0).props().value).toEqual(s_faux_body_filter) // Confirm value of #body-filter set via props...

        logajohn.debug(`${sWho}(): SHEMP: Moe, body_filter_wrapper = `, body_filter_wrapper )
        logajohn.debug(`${sWho}(): SHEMP: Shmoe, body_filter_wrapper.at(0) = `, body_filter_wrapper.at(0) )
        logajohn.debug(`${sWho}(): SHEMP: Shmoe, body_filter_wrapper.at(0).props() = `, body_filter_wrapper.at(0).props() )
        logajohn.debug(`${sWho}(): SHEMP: Shmoe, body_filter_wrapper.at(0).props().value = `, body_filter_wrapper.at(0).props().value )
        logajohn.debug(`${sWho}(): SHEMP: Shmoe, body_filter_wrapper.at(0).text() = `, body_filter_wrapper.at(0).text() )

        wrapper.find('#load-posts')
                .simulate('submit')

        logajohn.debug(`${sWho}(): _onPostsFilter.calls = `,  _onPostsFilter.calls )

        // All-in-one expect gives less useful error...
        expect(_onPostsFilter).toBeCalledWith({user_id_filter: s_faux_user_id_filter, title_filter: s_faux_title_filter, body_filter: s_faux_body_filter, ...faux_posts_filters})

        // Individual expects give more useful specific error...
        expect(_onPostsFilter.mock.calls[0][0].user_id_filter).toEqual(s_faux_user_id_filter) // submitted user_id filter...
        expect(_onPostsFilter.mock.calls[0][0].title_filter).toEqual(s_faux_title_filter) // submitted title filter...
        expect(_onPostsFilter.mock.calls[0][0].body_filter).toEqual(s_faux_body_filter) // submitted body filter...

        expect(_onPostsFilter.mock.calls[0][0].sort_by_field).toEqual(faux_posts_filters.sort_by_field) // did not clobber sort_by_field...
        expect(_onPostsFilter.mock.calls[0][0].sort_by_asc_desc).toEqual(faux_posts_filters.sort_by_asc_desc) // did not clobber sort_by_asc_desc...
        
    })


    it("When props.posts.post_is_editing_iteration changes(due to an edit), calls filterIt() and autoSuggestUpdate()...", () => {

        let sWho = `${sWhere}: submit invokes onPostsFilter -- with title_filter and body_filter passed along -- and with sort filters preserved`
        logajohn.debug(`${sWho}()...`)

        let postIsEditingIteration = 1

        let postsPropInit = { post_is_editing_iteration: 1 }

        const _filterItSpy = jest.fn()
        const _autoSuggestUpdateSpy = jest.fn()

        // PostsFilterForm calls onPostsFetch() in componentDidMount(), and expects it to return a Promise...
        const _onPostsFetchSpy = jest.fn(()=>{return Promise.resolve('OK')})

        let wrapper = mount(<PostsFilterForm posts={postsPropInit} onPostsFetch={_onPostsFetchSpy} filterItSpy={_filterItSpy} autoSuggestUpdateSpy={_autoSuggestUpdateSpy} />)
        logajohn.debug(`${sWho}(): BEFORE: _filterItSpy.mock.calls = `,  utils.customStringify(_filterItSpy.mock.calls) )
        _filterItSpy.mockClear()
        _autoSuggestUpdateSpy.mockClear()

        logajohn.debug(`${sWho}(): SHEMP: BEFORE: wrapper.instance() = `, utils.customStringify(wrapper.instance()) )

        let postsPropsNew = { post_is_editing_iteration: 2 }

        logajohn.debug(`${sWho}(): SHEMP: Callin' wrapper.setProps({posts: postsPropsNew=`, postsPropsNew, `})...`)
        wrapper.setProps({ posts: postsPropsNew })

        logajohn.debug(`${sWho}(): SHEMP: AFTER: wrapper.instance() = `, utils.customStringify(wrapper.instance()) )
        logajohn.debug(`${sWho}(): AFTER: _filterItSpy.mock.calls = `,  utils.customStringify(_filterItSpy.mock.calls) )
        logajohn.debug(`${sWho}(): AFTER: _autoSuggestUpdateSpy.mock.calls = `,  utils.customStringify(_autoSuggestUpdateSpy.mock.calls) )

        expect(_filterItSpy).toHaveBeenCalledTimes(1)
        expect(_autoSuggestUpdateSpy).toHaveBeenCalledTimes(1)

    })

})
