import fetch from 'isomorphic-fetch'

import { config } from '../../config'
import { utils } from '../../lib/utils' 
import { logajohn } from '../../lib/logajohn'

logajohn.setLevel(config.DEBUG_LEVEL)
logajohn.debug('posts.js: logajohn.getLevel()=', logajohn.getLevel())

const sWhere = "./src/server/models/posts.js"

/** Note that source of posts defaults to config.POSTS_URL */
export class Posts {

    posts = []
    src = { url: config.POSTS_URL }

    /** e.g.,
    *    src = { url: 'http://myposts.com/posts' }
    * or for local file,
    *    src = { file: '/path/to/file'}
    * or to set directly...
    *    src = { array: [{<post1>}, {<post2>}, {<post3>}]}
    */
    constructor(src) {
        if(src){
            this.src = src;
        }
    }

    loadPosts(src){

        let sWho = `${sWhere}: loadPosts`

        logajohn.debug(`${sWho}: SPOCK: src = `, src )

        if(src){
            this.src = src;
        }

        logajohn.debug(`${sWho}: SPOCK: this.src = `, this.src )

		if( this.src.url ){
          return new Promise((resolve, reject) => {
				logajohn.debug(`${sWhere}: SPOCK: Captain, fetching url = this.src.url = `, this.src.url );

				fetch( this.src.url )
				.then( (response)=> {
				    logajohn.debug(`${sWhere}: SPOCK: Captain, fetching url = this.src.url = `, this.src.url, `.then()...response.status = `, response.status )
                    if( response.status != 200 ){
				        logajohn.error(`${sWhere}: SPOCK: Captain, fetching url = this.src.url = `, this.src.url, `.then()...response.status = `, response.status, ` does not equal 200, so rejecting the promise...` )
						reject("Non OK(200) status from server: " + response.status ) 
				    }
					return response.json()
				}, (err)=>{
				    logajohn.debug(`${sWhere}: SPOCK: Captain, fetching url = this.src.url = `, this.src.url, `.then.(response).error()...err = `, err )
					reject(err)
				})
				.then( (json)=>{
				    logajohn.debug(`${sWhere}: SPOCK: Captain, fetching url = this.src.url = `, this.src.url, `.then(json)...json=`, json )
					this.posts = json
				    logajohn.debug(`${sWhere}: SPOCK: Captain, just before calling resolve(), this.posts = ${JSON.stringify(this.posts)}...`)
                    resolve(this.posts.length)
				}, (err)=>{
				    logajohn.debug(`${sWhere}: SPOCK: Captain, fetching url = this.src.url = `, this.src.url, `.then(json).error()...err = `, err )
					reject(err)
				})
			})
	    }
        else if( this.src.array ){
          return new Promise((resolve, reject) => {
				this.posts = [...this.src.array]
                logajohn.debug(`${sWhere}: SPOCK: Captain, after setting posts by cloning this.src.array, just before calling resolve(), this.posts = ${JSON.stringify(this.posts)}...`)
				resolve(this.posts.length)
		  })
       }
       //else{
       //   return new Promise((resolve, reject) => {
		//		reject('Posts: no src supplied for loadPosts()')
		//  })
       //}
	}/* loadPosts() */

    getPosts(filter){
        let sWho = `${sWhere}::getPosts()`

        logajohn.debug(`${sWho}: filter = `, filter )

        return new Promise((resolve, reject) => {

        let filteredPosts = [...this.posts]

        logajohn.debug(`${sWho}: Moe, for starters, filteredPosts = [...this.posts] = ${JSON.stringify(filteredPosts)}...`)

        if( filter && ( filter['title_filter'] || filter['body_filter'] || filter['user_id_filter'] )){
            filteredPosts = filteredPosts.filter((post,index)=>{                  
               let strFinder = ''
               let strFindIn = ''
               let bFound = false

               if( filter['user_id_filter'] ){
                 bFound = ( 1*post.userId == 1*filter['user_id_filter'] )
                 if( bFound == false ){
                    return false
                 }
               }

               if( filter['title_filter'] ){
                 strFinder = filter['title_filter']
                 strFindIn = post.title
                 bFound = utils.strBeginsWithIgnoreCase( strFinder, strFindIn )
                 if( bFound == false ){
                    return false
                 }
               }

               if( filter['body_filter'] ){
                 strFinder = filter['body_filter']
                 strFindIn = post.body
                 bFound = utils.strBeginsWithIgnoreCase( strFinder, strFindIn )
                 if( bFound == false ){
                    return false
                 }
               }

               return true 
            })
		}


        if( filter && filter['sort_by_field'] ){
            filteredPosts = filteredPosts.sort((post1,post2)=>{                  

               let iComp = 0
               if( filter['sort_by_field'] == "title" ){
                  iComp = utils.compareStrings( post1.title, post2.title, true, true ) 
               }
               else if( filter['sort_by_field'] == "body" ){
                  iComp = utils.compareStrings( post1.body, post2.body, true, true ) 
               }
               else if( filter['sort_by_field'] == "user_id" ){
                  // _Should_ be numerical...
                  iComp = post1.userId - post2.userId
               }

               if( filter["sort_by_asc_desc"] == "desc" ){
                  iComp *= -1
               }
               return iComp
            })
		}

		resolve(filteredPosts)
     })
   }/* getPosts(filter) */
    
} /* class Posts */

