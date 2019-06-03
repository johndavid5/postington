

/* By default loads posts from the fixture, but requires loadPosts() to be called for the posts to be loaded, just like the real deal... */
import { logajohn } from '../../../lib/logajohn'

import postsFixture from '../../../../__tests__/models/fixtures/posts.json'

Object.defineProperty(exports, '__esModule', { value: true })

logajohn.debug('__mocks__/posts.js: logajohn.getLevel()=', logajohn.getLevel())

const sWhere = './src/server/models/__mocks__/posts.js'

const posts = []

const mockGetPosts = jest.fn(
    function (filter) {
        const sWho = `${sWhere} mockGetPosts()`
        logajohn.debug(`${sWho}: filter=`, filter)

	    return new Promise((resolve, reject) => {
	        if (filter == null) {
                logajohn.error(`${sWho}: filter is null, rejecting promise...`)
	            reject(new Error('You supplied a null filter...'))
	        }
	        resolve(this.posts)
	    })
    },
)

const mockLoadPosts = jest.fn(
    function () {
        const sWho = `${sWhere} mockLoadPosts()`
        logajohn.debug(`${sWho}...`)

        this.posts = postsFixture.array

	    return new Promise((resolve, reject) => {
	        resolve(this.posts.length)
	    })
    },
)

exports.mockGetPosts = mockGetPosts

class Posts {
    constructor() {
        const sWho = `${sWhere} Post mock constructor()`
        // this.disable = jest.fn((key) => {
        //    this.setting[key] = false;
        // });
        // thisPosts = []
        this.posts = []
        logajohn.debug(`${sWho}...this.posts = `, posts)
        this.loadPosts = mockLoadPosts
        this.getPosts = mockGetPosts
        // return this;
    }
}
exports.Posts = Posts
// # sourceMappingURL=express.js.map


// const mock = jest.fn().mockImplementation(() => {
//  return {getPosts: mockGetPosts};
// });

// export default mock;
