// Testing out our mock, actually...which may seem strange...
import { config } from '../../src/config'
import { logajohn } from '../../src/lib/logajohn'

// Will actually load the mock below...
import { Posts, mockGetPosts} from '../../src/server/models/posts'

// Explicitly supply the path to __mocks__/posts.js
// Posts is now the mock constructor...
// Can also use shorthand 
//   jest.mock('../../src/server/models/posts')
// in which case Jest will find the mock in the parallel __mocks__ path
//     '../../src/server/models/__mocks__/posts');
// but I like to specifically ask for it...
jest.mock('../../src/server/models/posts',() => {
  return require('../../src/server/models/__mocks__/posts');
}); 

let sWhere = './__tests__/mocks/posts-mock.test.js'

logajohn.setLevel(config.DEBUG_LEVEL)
logajohn.debug(`posts-mock.test.js: logajohn.getLevel()=${logajohn.getLevel()}...`)

describe('Posts mock...', () => {

    let sDescribe = 'Posts mock...'

    const postsMockModel = new Posts()

    beforeEach((done) => {
      const sWho = `${sWhere}::${sDescribe}::beforeEach` 
      logajohn.debug(`${sWho}: postsMockModel.getPosts.mockClear()...`)
      postsMockModel.getPosts.mockClear();
      logajohn.debug(`${sWho}: postsMockModel.loadPosts()...`)
      postsMockModel.loadPosts()
      .then((numPosts)=>{
           logajohn.debug(`${sWho}: postsMockModel.loadPosts()...then()...numPosts = `, numPosts )
           done()
      })
    })

    it('getPosts()', (done) => {

        const sWho = `${sWhere}::${sDescribe}::getPosts()`

        postsMockModel.getPosts({})
            .then((posts) => {
                logajohn.debug(`${sWho} .then: posts = `, posts )
                expect(posts.length).toBeGreaterThan(0)
                expect(postsMockModel.getPosts).toHaveBeenCalledTimes(1)
                expect(mockGetPosts).toHaveBeenCalledTimes(1)
                done()
            })
    })

//    it('getPosts()--exception if null filter', (done) => {
//        postsMockModel.getPosts(null)
//            .catch((err) => {
//                logajohn.debug('__tests__/mocks/posts-mock.test.js/getPosts()--exception if null filter .catch: err.name =', err.name, ', err.message = ', err.message )
//                expect(err).toBeDefined()
//                //expect(err).toEqual('You supplied a null filter...')
//                expect(err.name).toEqual('Error')
//                expect(err.message).toEqual('You supplied a null filter...')
//                done()
//            })
//    })

})


describe('Posts mock...forgetting to call loadPosts()...', () => {

    let sDescribe = 'Posts mock...forgetting to call loadPosts()...'

    const postsMockModel2 = new Posts()

    beforeEach((done) => {
      const sWho = `${sWhere}::${sDescribe}::beforeEach` 
      logajohn.debug(`${sWho}: postsMockModel2.getPosts.mockClear()...`)
      postsMockModel2.getPosts.mockClear();
      // BELOW: "Forget" to call loadPosts()...
      //logajohn.debug(`${sWho}: postsMockModel.loadPosts()...`)
      //postsMockModel.loadPosts();
      done()  
    })

    it('getPosts()', (done) => {

        const sWho = `${sWhere}::${sDescribe}::postsMockModel2.getPosts()`

        postsMockModel2.getPosts({})
            .then((posts) => {
                logajohn.debug(`${sWho} .then: posts = `, posts )
                expect(posts.length).toEqual(0)
                expect(postsMockModel2.getPosts).toHaveBeenCalledTimes(1)
                expect(mockGetPosts).toHaveBeenCalledTimes(1)
                done()
            })
    })

})
