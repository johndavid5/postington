/** @reference: http://enthudrives.com/blog/unit-testing-redux-containers/ */
import { shallow, mount, render } from 'enzyme';
import React from 'react';

import {
    postsFetch, postsLocalFilter, postEditStart, postEditFinish, postEditCancel
} from '../../../src/actions'

import postsFixture from '../../models/fixtures/posts.json'

import C from '../../../src/constants' 

import { utils } from '../../../src/lib/utils'

import { PostsFilterFormContainer } from '../../../src/components/containers'

import configureStore from 'redux-mock-store';

const mockStore=configureStore();

let sWhere = './__tests__/components/containers/PostsFilterFormContainer.test.js'

describe('PostsFilterFormContainer...', () => {

    let sWhat = `${sWhere}::PostsFilterFormContainer`

    let wrapper, store;

    //let store_state = { posts: {posts_list: ['Moe', 'Larry', 'Shemp']} }
    let store_state = { posts: {posts_remote_list: postsFixture.array, posts_list: postsFixture.array} }

    beforeEach(() =>{
        
        let sWho = `${sWhat}::beforeEach()`

        store = mockStore( store_state )
        store.dispatch = jest.fn();
        wrapper = shallow(<PostsFilterFormContainer store={store}/>);
        console.log('wrapper.props()=', wrapper.props())

        console.log(`${sWho}(): utils.customStringify(wrapper.props()) = `, utils.customStringify(wrapper.props(), ' ') )
        console.log(`${sWho}(): wrapper.props().onPostsFetch = `, wrapper.props().onPostsFetch )
    });

    it('maps state and dispatch to props', () => {
        let sWho = `${sWhat}::'maps state and dispatch to props'`

        console.log(`${sWho}(): utils.customStringify(wrapper.props()) = `, utils.customStringify(wrapper.props(), ' ') )
        console.log(`${sWho}(): wrapper.props().onPostsFetch = `, wrapper.props().onPostsFetch )

        let props = wrapper.props()

        expect(wrapper.props()).toEqual(expect.objectContaining({
            posts: store_state.posts,
            onPostsFetch: expect.any(Function),
            onPostsFilter: expect.any(Function)
        }));
    });

    it(`maps onPostsFetch to dispatch postsFetch()'s thunk...`, ()=> {

        let sWho = `${sWhat}::maps onPostsFetch to dispatch postsFetch()'s thunk...`

        wrapper.props().onPostsFetch()

	    //expect(store.dispatch).toHaveBeenCalledWith(expect.any(Function))

        let numCalls =  store.dispatch.mock.calls.length
        expect(store.dispatch.mock.calls[numCalls-1][0].name).toEqual(postsFetch().name)
        expect(store.dispatch.mock.calls[numCalls-1][0].name).toEqual('postsFetchThunk')
    })

    it(`maps onPostsFilter to dispatch postsLocalFilter()'s thunk...`, ()=> {

        let sWho = `${sWhat}::maps onPostsFilter to dispatch postsLocalFilter()'s thunk...`

        wrapper.props().onPostsFilter()

	    //expect(store.dispatch).toHaveBeenCalledWith(expect.any(Function))

        let numCalls =  store.dispatch.mock.calls.length
        expect(store.dispatch.mock.calls[numCalls-1][0].name).toEqual(postsLocalFilter().name)
        expect(store.dispatch.mock.calls[numCalls-1][0].name).toEqual('postsLocalFilterThunk')
    })


});
