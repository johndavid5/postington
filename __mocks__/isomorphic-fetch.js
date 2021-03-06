

import { config } from '../src/config'
import { logajohn } from '../src/lib/logajohn'

logajohn.setLevel(config.DEBUG_LEVEL)
logajohn.debug('__mocks__/isomorphic-fetch.js: logajohn.getLevel()=', logajohn.getLevel())

// function ResponseWrapper(body, init) {
//  if (body && typeof body.constructor === 'function' && body.constructor.__isFallback) {
//    const response = new ActualResponse(null, init)
//    response.body = body
//
//    const actualClone = response.clone
//    response.clone = () => {
//      const clone = actualClone.call(response)
//      const [body1, body2] = body.tee()
//      response.body = body1
//      clone.body = body2
//      return clone
//    }
//
//    return response
//  }
//
//  return new ActualResponse(body, init)
// }

function ResponseWrapper(body, init) {
    return new JResponse(body)
}

class JResponse {
    constructor(body, init) {
        logajohn.debug('__mocks__/isomorphic-fetch.js: JResponse.constructor(): SHEMP: Moe, body arg = ', body)
        this.body = body
        this.init = init
        this.status = 200
        logajohn.debug('__mocks__/isomorphic-fetch.js: JResponse.constructor(): SHEMP: Moe, this.body (direct assign from arg) = ', this.body)
        logajohn.debug('__mocks__/isomorphic-fetch.js: JResponse.constructor(): SHEMP: Moe, this.init = ', this.init)
        logajohn.debug('__mocks__/isomorphic-fetch.js: JResponse.constructor(): SHEMP: Moe, this.status = ', this.status)
        this.json = this.json.bind(this)
    }

    // Body.json()
    // Takes a Response stream and reads it to completion.
    // It returns a promise that resolves with the result of parsing the body text as JSON.
    // (Returns a JavaScript object...)
    json() {
        logajohn.debug('__mocks__/isomorphic-fetch.js: JResponse.json(): SHEMP: Moe, this = ', this)
        logajohn.debug('__mocks__/isomorphic-fetch.js: JResponse.json(): SHEMP: Moe, this.body = ', this.body)
        logajohn.debug(`__mocks__/isomorphic-fetch.js: JResponse.json(): SHEMP: Moe, (typeof this.body) = '${typeof this.body}'`)
        logajohn.debug('__mocks__/isomorphic-fetch.js: JResponse.json(): SHEMP: Moe, this.body.constructor = \'', `${this.body.constructor}'`)

        const returno = JSON.parse(this.body)
        logajohn.debug('__mocks__/isomorphic-fetch.js: JResponse.json(): SHEMP: Moe, retoynin\' returno = ', returno)
        return Promise.resolve(returno)
        // return returno;
    }
}

// function JResponse(body){
//    // Use spread operator to clone body...rather than using Object.assign({}, body)...
//    this.body = {...body}
//    logajohn.debug('__mocks__/isomorphic-fetch.js: JResponse()<constructor>: SHEMP: Moe, this = ', this )
//    logajohn.debug('__mocks__/isomorphic-fetch.js: JResponse()<constructor>: SHEMP: Moe, this.body = ', this.body )
// }

// JResponse.prototype.json = function(){
//   logajohn.debug('__mocks__/isomorphic-fetch.js: JResponse.prototype.json(): SHEMP: Moe, this = ', this )
//   logajohn.debug('__mocks__/isomorphic-fetch.js: JResponse.prototype.json(): SHEMP: Moe, retoynin\' this.body = ', this.body )
//   return this.body
// }

const fetch = jest.fn()
// fetch.Headers = Headers
// fetch.Response = ResponseWrapper
// fetch.Request = Request

fetch.mockResponse = (body, init) => {
    logajohn.debug('__mocks__/isomorphic-fetch.js: mockResponse() SHEMP: Moe, body = ', body)

    return fetch.mockImplementation((url, options) => {
        logajohn.debug(`__mocks__/isomorphic-fetch.js: mockImplementation(url="${url}", options=`, options, ')...')
        logajohn.debug('__mocks__/isomorphic-fetch.js: mockImplementation(): fetch.mock = ', fetch.mock, '...')
        return Promise.resolve(new JResponse(body, init))
    // Promise.resolve(new ResponseWrapper(body, init))
    })
}

fetch.mockReject = error => fetch.mockImplementation(() => Promise.reject(error))

fetch.resetMocks = () => {
    fetch.mockReset()
}

// Default mock is just a empty string.
fetch.mockResponse('')

module.exports = fetch

//
// const mockFetch = jest.fn(
//    (url, options)=>{
//
//        logajohn.debug('./__mocks__/isomorphic-fetch.js: mockFetch(): url =', url)
//        logajohn.debug('./__mocks__/isomorphic-fetch.js: mockFetch(): options =', options)
//
//	    return new Promise((resolve,reject)=>{
//	        //if (filter == null) {
//	        //    reject(new Error('You supplied a null filter...'))
//	        //}
//	        resolve({ output: faux_action, json: function(){ return output} })
//	    })
// })
//
// exports.mockFetch = mockFetch
//
// exports.fetch = mockFetch
//
// const mockFetchSetOutput = (output) => {
//    output = output
// }
//
// exports.mockFetchSetOutput = mockFetchSetOutput
//
// export default mockFetch
//
