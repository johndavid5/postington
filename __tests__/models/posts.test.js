import { config } from '../../src/config'
import { Posts } from '../../src/server/models/posts'

import { logajohn } from '../../src/lib/logajohn'
import { utils } from '../../src/lib/utils'

import postsFixture from './fixtures/posts.json'

import fetch from 'isomorphic-fetch'
jest.mock('isomorphic-fetch') // Need to mock isomorphic-fetch when it's used within Post...

logajohn.setLevel(config.DEBUG_LEVEL)
logajohn.debug(`__tests__/models/posts.test.js: logajohn.getLevel()=${logajohn.getLevel()}...`)

const sWhere = '__tests__/models/posts.test.js'

describe('Posts model - from fixture array...', () => {
    let postsModel = null
    const sDescribe = 'Posts model - from fixture array...'
    // One-time setup...
    beforeAll((done) => {
        const sWho = `${sWhere}::${sDescribe}::posts.test.js::beforeAll`
        postsModel = new Posts({array: postsFixture.array})
        postsModel.loadPosts()
		.then((numPosts)=>{
          logajohn.debug(`${sWho}() SPOCK: Captain, numPosts =`, numPosts)
          done();
		})
    })

    
    it('getPosts() - no filter...', (done) => {
        postsModel.getPosts({})
            .then((posts) => {
                const sWho = `${sWhere}::${sDescribe}::getPosts() - no filter`
                logajohn.debug(`${sWho}() posts =`, posts)
                expect(posts.length).toEqual(postsFixture.array.length)
                done()
            })
    })

    
    it('getPosts() - by {title_filter: \'sunt\'}...', (done) => {
      postsModel.getPosts({'title_filter': 'sunt'})
          .then((posts) => {
              const sWho = `${sWhere}::${sDescribe}::getPosts() - by {title_filter: 'sunt'}...`
              logajohn.debug(`${sWho}() posts =`, posts)
              expect(posts.length).toEqual(1)
              done()
          })
    })

    it('getPosts() - by {body_filter: \'est\'}...', (done) => {
      postsModel.getPosts({'body_filter': 'est'})
          .then((posts) => {
              const sWho = `${sWhere}::${sDescribe}::getPosts() - by {body_filter: 'est'}...`
              logajohn.debug(`${sWho}() posts =`, posts)
              expect(posts.length).toEqual(1)
              done()
          })
    })

    it('getPosts() - by {title_filter: \'e\'}...', (done) => {
      postsModel.getPosts({'body_filter': 'e', 'title_filter': 'e'})
          .then((posts) => {
              const sWho = `${sWhere}::${sDescribe}::getPosts() - by {body_filter: 'e', title_filter: 'e'}...`
              logajohn.debug(`${sWho}() posts =`, posts)
              expect(posts.length).toEqual(1)
              done()
          })
    })

    it('getPosts() - by {user_id_filter: 2}...', (done) => {

      const sWho = `${sWhere}::${sDescribe}::getPosts() - by {user_id_filter: 2}...`

      postsModel.getPosts({user_id_filter: 2})
          .then((posts) => {
              logajohn.debug(`${sWho}() posts =`, posts)
              expect(posts.length).toEqual(2)
              done()
          })
    })

    let fields = ['user_id', 'title', 'body']
    let asc_desc = ['asc', 'desc', '']

    fields.forEach((le_field)=>{
        asc_desc.forEach((le_asc_desc)=>{    
        let le_filter = { sort_by_field: le_field, sort_by_asc_desc: le_asc_desc }
        let le_description = 'getPosts: ' + JSON.stringify(le_filter)
        it( le_description, (done)=>{

            let sortedPostsExpected = postsFixture.array.sort((post1,post2)=>{                  
 
               let iComp = 0
               if( le_filter['sort_by_field'] == 'title' ){
                  iComp = utils.compareStrings( post1.title, post2.title, true, true ) 
               }
               else if( le_filter['sort_by_field'] == 'body' ){
                  iComp = utils.compareStrings( post1.body, post2.body, true, true ) 
               }
               else if( le_filter['sort_by_field'] == 'user_id' ){
                  // _Should_ be numerical...
                  iComp = post1.userId - post2.userId
               }
 
               if( le_filter["sort_by_asc_desc"] == "desc" ){
                  iComp *= -1
               }
               return iComp
            })

            postsModel.getPosts( le_filter )
            .then((posts)=>{ 
               logajohn.debug(`${le_description}() posts =`, posts)
               expect(posts).toEqual(sortedPostsExpected)
               done()
            })
        })
      })
   })

    /* Any teardown, mon amis...? */
    afterAll(() => {
        const sWho = `${sWhere}::${sDescribe}::posts.test.js::afterAll`
    })
})

describe('Posts model mocked fetch from URL...', () => {

    const sDescribe = 'Posts model mocked fetch from URL...'

    // One-time setup...
    beforeAll(() => {
        const sWho = `${sWhere}::${sDescribe}::beforeAll`

        // Setup the fetch mock...
        fetch.resetMocks()
        // Simulate fetch returning JSON equal to the postsFixture.array when the URL is fetched...
        fetch.mockResponse(JSON.stringify(postsFixture.array))
    })

    it('loadPosts() loads from URL via fetch...', (done)=>{

        const sWho = `${sWhere}::${sDescribe}::'loadPosts() loads from URL via fetch...'`

        // Should default to src = { url: config.POSTS_URL }, even though we are mocking the actual fetch()...
        let postsModel = new Posts()

        postsModel.loadPosts()
		.then((numPosts)=>{
          logajohn.debug(`${sWho}() SPOCK: Captain, numPosts =`, numPosts)
          expect(numPosts).toEqual(postsFixture.array.length)
          done();
		})
    })

})

//describe.skip('Posts model - via mocked fetch from URL...', () => {
//    let postsModel = null
//
//    const sDescribe = 'Posts model - via mocked fetch from URL...'
//
//    // One-time setup...
//    beforeAll((done) => {
//        const sWho = `${sWhere}::${sDescribe}::posts.test.js::beforeAll`
//
//        fetch.resetMocks()
//        // Simulate fetch returning JSON equal to the fixture when the URL is fetched...
//        fetch.mockResponse(JSON.stringify(postsFixture.array))
//
//        //postsModel = new Posts({array: postsFixture.array})
//
//        // Should default to src = { url: config.POSTS_URL }, even though we are mocking the actual fetch()...
//        postsModel = new Posts()
//        postsModel.loadPosts()
//		.then((numPosts)=>{
//          logajohn.debug(`${sWho}() SPOCK: Captain, numPosts =`, numPosts)
//          done();
//		})
//    })
//
//    
//    it('getPosts() - no filter...', (done) => {
//        postsModel.getPosts({})
//            .then((posts) => {
//                const sWho = `${sWhere}::${sDescribe}::getPosts() - no filter`
//                logajohn.debug(`${sWho}() posts =`, posts)
//                expect(posts.length).toEqual(postsFixture.array.length)
//                done()
//            })
//    })
//
//    
//    it('getPosts() - by {title_filter: \'sunt\'}...', (done) => {
//      postsModel.getPosts({'title_filter': 'sunt'})
//          .then((posts) => {
//              const sWho = `${sWhere}::${sDescribe}::getPosts() - by {title_filter: 'sunt'}...`
//              logajohn.debug(`${sWho}() posts =`, posts)
//              expect(posts.length).toEqual(1)
//              done()
//          })
//    })
//
//    it('getPosts() - by {body_filter: \'est\'}...', (done) => {
//      postsModel.getPosts({'body_filter': 'est'})
//          .then((posts) => {
//              const sWho = `${sWhere}::${sDescribe}::getPosts() - by {body_filter: 'est'}...`
//              logajohn.debug(`${sWho}() posts =`, posts)
//              expect(posts.length).toEqual(1)
//              done()
//          })
//    })
//
//    it('getPosts() - by {title_filter: \'e\'}...', (done) => {
//      postsModel.getPosts({'body_filter': 'e', 'title_filter': 'e'})
//          .then((posts) => {
//              const sWho = `${sWhere}::${sDescribe}::getPosts() - by {body_filter: 'e', title_filter: 'e'}...`
//              logajohn.debug(`${sWho}() posts =`, posts)
//              expect(posts.length).toEqual(1)
//              done()
//          })
//    })
//
//
//    /* Any teardown, mon amis...? */
//    afterAll(() => {
//        const sWho = `${sWhere}::${sDescribe}::posts.test.js::afterAll`
//    })
//})

/* Should we test the actual fetch...?  
* This may be more appropriate in an end-to-end test.
*/
//describe('Posts model - via actual fetch of URL...', () => {
//
//    let postsModel = null
//	let postsNum = -1
//	let postsNumWithEstInTitle = -1
//    let bError = false
//    let leError = null
//
//    const sDescribe='Posts model - via fetch of URL...'
//
//    // One-time setup...
//    beforeAll((done) => {
//        const sWho = `${sWhere}::${sDescribe}::beforeAll`
//
//        fetch.resetMocks()
//        // Simulate fetch returning JSON equal to the fixture when the URL is fetched...
//        fetch.mockResponse(JSON.stringify(postsFixture.array))
//
//        // Should default to posts source = config.POSTS_URL...
//        postsModel = new Posts();
//        postsModel.loadPosts()
//		.then((numPosts)=>{
//          logajohn.debug(`${sWho}.then((numPosts): Captain, numPosts =`, numPosts)
//		  postsNum = numPosts
//          done();
//		})
//        .catch((err)=>{
//          logajohn.debug(`${sWho}.catch((err): Captain, err =`, err )
//          bError = true
//          leError = err
//          done();
//        })
//    })
//
//    it('no errors in beforeAll()...', ()=>{
//        expect(leError).toEqual(null)
//        expect(bError).toEqual(false)
//    })
//    
//    it('getPosts() - no filter...', (done) => {
//        postsModel.getPosts({})
//            .then((posts) => {
//                let sWho = `${sWhere}::${sDescribe}::getPosts() - no filter`
//                logajohn.debug(`${sWho}() SPOCK: Captain, posts =`, posts)
//                logajohn.debug(`${sWho}() SPOCK: posts.length =`, posts.length)
//                expect(posts.length).toEqual(postsNum)
//				// Figure out how many should be make it past the filter in the next test...
//	            postsNumWithEstInTitle = posts.filter((post)=>{
//					let strFinder = "est"
//					let strFindIn = post.title
//					let bContains = utils.strContainsIgnoreCase( strFinder, strFindIn )
//					return bContains;
//				}).length
//                done()
//            })
//    })
//
//    
//    it('getPosts() - by { title.contains: \'est\'}...', (done) => {
//      postsModel.getPosts({'title.contains': 'est'})
//          .then((posts) => {
//              const sWho = `${sWhere}::${sWhere}::getPosts() - by {title.contains: 'est'}...`
//              logajohn.debug(`${sWho}() SPOCK: Captain, posts =`, posts)
//              logajohn.debug(`${sWho}() SPOCK: posts.length =`, posts.length)
//              expect(posts.length).toEqual(postsNumWithEstInTitle)
//              done()
//          })
//    })
//
//
//    /* Any teardown, Messieurs...? */
//    afterAll(() => {
//        const sWho = `${sWhere}::${sWhere}::afterAll`
//    })
//})
