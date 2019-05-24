import { utils } from '../../src/lib/utils'

import { config } from '../../src/config'
import { logajohn } from '../../src/lib/logajohn'

let sWhere = '__tests__/lib/utils.test.js'

logajohn.setLevel(config.DEBUG_LEVEL)
logajohn.debug(`${sWhere}: logajohn.getLevel()=${logajohn.getLevel()}...`)

describe('./src/lib/utils', () => {

    describe('objectToQueryString => queryStringToObject', () => {

        const test_cases = [
            {
                input: { "name": "Moe", "stooge_number": "1", "line": "Why, you!" },
                expected_output: "name=Moe&stooge_number=1&line=Why%2C%20you!",
                // decoded: "name=Moe&stooge_number=1&line=Why, you!"
                linda_round_trippable: true 
            },

            {  
                input: {
                  foo: "hi there",
                  bar: {
                    blah: 123,
                    quux: [1, 2, 3]
                  }
                },
                expected_output: "foo=hi%20there&bar%5Bblah%5D=123&bar%5Bquux%5D%5B0%5D=1&bar%5Bquux%5D%5B1%5D=2&bar%5Bquux%5D%5B2%5D=3",
                // decoded: "foo=hi there&bar[blah]=123&bar[quux][0]=1&bar[quux][1]=2&bar[quux][2]=3"
                linda_round_trippable: false
            }
        ]

        it('converts...', () => {

            let sWho = "${sWhere}::converts"

            test_cases.forEach(({input, expected_output, linda_round_trippable})=>{
                let actual_output = utils.objectToQueryString(input)                    

                logajohn.debug(`${sWho}(): utils.objectToQueryString(): input = `, input )
                logajohn.debug(`${sWho}(): utils.objectToQueryString(): actual_output = `, actual_output )
                logajohn.debug(`${sWho}(): utils.objectToQueryString(): decodeURIComponent(actual_output) = `, decodeURIComponent(actual_output) )

                expect(actual_output).toEqual(expected_output)

                if( linda_round_trippable ){
                    // round trip...
                    let round_trip_object = utils.queryStringToObject(actual_output)
                    expect(round_trip_object).toEqual(input)
                }
            })
        })

    })

    describe('strContainsIgnoreCase', () => {

        const testCases = [
            {
                strFinder: "Moe",
                strFindIn: "Where are you, Moe?",
                expectedOutput: true
            },
            {
                strFinder: "moe",
                strFindIn: "Where are you, Moe?",
                expectedOutput: true
            },
            {
                strFinder: "moe",
                strFindIn: "Where are you, Larry?",
                expectedOutput: false
            },
            {
                strFinder: "",
                strFindIn: "Where are you, Larry?",
                expectedOutput: true
            },
            {
                strFinder: "Moe",
                strFindIn: "",
                expectedOutput: false
            },
            {
                strFinder: "",
                strFindIn: "",
                expectedOutput: true
            },
        ]

        let strContainsIgnoreCase = utils.strContainsIgnoreCase

        testCases.forEach( (testCase)=>{
            let { strFinder, strFindIn, expectedOutput } = testCase
            let label = `strContainsIgnoreCase('${strFinder}','${strFindIn}') returns ${expectedOutput}...`
            it(label, () => {
               expect(strContainsIgnoreCase(strFinder, strFindIn)).toEqual(expectedOutput)
            })
       })

    }) 


    describe('strBeginsWithIgnoreCase', () => {

        const testCases = [
            {
                strFinder: "Where",
                strFindIn: "Where are you, Moe?",
                expectedOutput: true
            },
            {
                strFinder: "where",
                strFindIn: "Where are you, Moe?",
                expectedOutput: true
            },
            {
                strFinder: "larry",
                strFindIn: "Where are you, Larry?",
                expectedOutput: false
            },
            {
                strFinder: "",
                strFindIn: "Where are you, Larry?",
                expectedOutput: true
            },
            {
                strFinder: "Moe",
                strFindIn: "",
                expectedOutput: false
            },
            {
                strFinder: "",
                strFindIn: "",
                expectedOutput: true
            },
        ]

        let strBeginsWithIgnoreCase = utils.strBeginsWithIgnoreCase

        testCases.forEach( (testCase)=>{
            let { strFinder, strFindIn, expectedOutput } = testCase
            let label = `strBeginsWithIgnoreCase('${strFinder}','${strFindIn}') returns ${expectedOutput}...`
            it(label, () => {
               expect(strBeginsWithIgnoreCase(strFinder, strFindIn)).toEqual(expectedOutput)
            })
       })

    }) 


    describe('compareStrings', () => {

        const testCases = [
            {
                strA: "Moe",
                strB: "shemp",
                expectedOutput: -1
            },
            {
                strA: "Moe",
                strB: "larry",
                expectedOutput: +1
            },
            {
                strA: "Moe",
                strB: "moe",
                expectedOutput: 0
            },
            {
                strA: "",
                strB: "",
                expectedOutput: 0
            },
            {
                strA: "Moe",
                strB: "",
                expectedOutput: 1
            },
            {
                strA: "",
                strB: "Moe",
                expectedOutput: -1
            },
        ]

        let compareStrings = utils.compareStrings 

        testCases.forEach( (testCase)=>{
            let { strA, strB, expectedOutput } = testCase
            let label = `compareStrings('${strA}','${strB}') returns ${expectedOutput}...`
            it(label, () => {
               expect(compareStrings(strA, strB, true, true)).toEqual(expectedOutput)
            })
       })

    }) 

    describe('strEqualsIgnoreCase', () => {

        const testCases = [
            {
                strA: "Moe",
                strB: "moe",
                expectedOutput: true
            },
            {
                strA: "Moe",
                strB: "Moe",
                expectedOutput: true
            },
            {
                strA: "Moe",
                strB: "Larry",
                expectedOutput: false
            },
            {
                strA: "moe",
                strB: "",
                expectedOutput: false
            },
            {
                strA: "",
                strB: "moe",
                expectedOutput: false
            },
            {
                strA: "",
                strB: "",
                expectedOutput: true
            },
        ]

        let strEqualsIgnoreCase = utils.strEqualsIgnoreCase

        testCases.forEach( (testCase)=>{
            let { strA, strB, expectedOutput } = testCase
            let label = `strEqualsIgnoreCase('${strA}','${strB}') returns ${expectedOutput}...`
            it(label, () => {
               expect(strEqualsIgnoreCase(strA, strB, true, true)).toEqual(expectedOutput)
            })
       })

    }) 

})
