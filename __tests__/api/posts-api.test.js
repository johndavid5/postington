import { config } from '../../src/config'
import { logajohn } from '../../src/lib/logajohn'
import { errorStringify, customStringify } from '../../src/lib/utils'

logajohn.setLevel(config.DEBUG_LEVEL)
logajohn.debug(`posts-api.test.js: logajohn.getLevel()=${logajohn.getLevel()}...`)

//jest.mock('express', () => {
//  return require('../../__mocks__/express');
//});

//import { Router } from 'express';

//const mockGet = jest.fn();
//jest.mock('express', () => {
//  return jest.fn().mockImplementation(() => {
//    return {get: mockGet};
//  })
//})

// Mock 'express'...
jest.mock('express')


// jest.mock('../../src/server/models/posts');
// Make Posts() into a mock object...explicitly supplying
// the path to our mock...Posts is now a mock constructor...
jest.mock('../../src/server/models/posts', ()=>{
    return require('../../src/server/models/__mocks__/posts');
})

import { Request as RequestMock } from 'request'
import { Response as ResponseMock } from 'response'
//import { router as posts_mock_api_router, doGet }  from '../../src/server/posts-api'
import { doGet }  from '../../src/server/posts-api'

// Posts here is the _mock_ constructor...
import { Posts as PostsMockModel, mockGetPosts } from '../../src/server/models/posts'

import constants from '../../src/constants'

describe('posts_api...', () => {

    let mockPosts = {};
    let numPosts = -1;
    let mockPostsModel = new PostsMockModel()

    beforeAll(async () => {
       const sWho = "posts-api.test.js: beforeAll()"
       try {
          numPosts = await mockPostsModel.loadPosts({}) 
          logajohn.debug(`${sWho}(): SHEMP: Moe, my first time usin' async await...got numPosts = `, numPosts )
          mockPosts = await mockPostsModel.getPosts({}) 
          logajohn.debug(`${sWho}(): SHEMP: Moe, my first time usin' async await...got mockPosts = `, mockPosts )
       }
       catch( err ){
          logajohn.error(`${sWho}(): Trouble with mockPosts: `, errorStringify(err) )
       }
       await mockPostsModel.getPosts.mockClear()
    });

    beforeEach(async () => {
      mockGetPosts.mockClear()
    })


    test('doGet()...', (done) => {
        const sWho = "posts-api.test.js::doGet"
        logajohn.debug(`${sWho}()...`)

        let request_mock = new RequestMock();
        request_mock.setQuery("title.contains", "est");
        let response_mock = new ResponseMock();

        logajohn.debug(`${sWho}(): Here goes, Moe...`)

        doGet(request_mock, response_mock, { callback: ()=>{

            expect(mockGetPosts).toHaveBeenCalledTimes(1)
            expect(mockGetPosts).toHaveBeenCalledWith({"title.contains": "est"})

            //expect(response_mock.status).toHaveBeenCalled()
            expect(response_mock.status).toHaveBeenCalledTimes(1)
            expect(response_mock.status).toBeCalledWith(200)
            //expect(response_mock.json).toHaveBeenCalled()
            expect(response_mock.json).toHaveBeenCalledTimes(1)
            
            logajohn.debug(`${sWho}() mockGetPosts.mock.calls = `, mockGetPosts.mock.calls )
            logajohn.debug(`${sWho}() response_mock.status.mock.calls = `, response_mock.status.mock.calls )
            logajohn.debug(`${sWho}() response_mock.status.mock.calls.length = `, response_mock.status.mock.calls.length )
        
            logajohn.debug(`${sWho}() response_mock.json.mock.calls = `, response_mock.json.mock.calls )
            logajohn.debug(`${sWho}() response_mock.json.mock.calls.length = `, response_mock.json.mock.calls.length )

            let payload = response_mock.json.mock.calls[0][0]

            logajohn.debug(`${sWho}() payload = `, payload )
            logajohn.debug(`${sWho}() Does payload.type = `, payload.type, ` equal constants.POSTS_GET = `, constants.POSTS_GET, `...?` )

            expect(payload.type).toEqual(constants.POSTS_GET)

            logajohn.debug(`${sWho}(): SHEMP: Moe, does payload.posts = `, payload.posts, ` equal mockPosts = `, mockPosts, `...?` )

            expect(payload.posts).toEqual(mockPosts)

            expect(payload.error).toEqual('')

            done();
          }
        }
        )
    })

})

