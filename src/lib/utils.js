/** https://stackoverflow.com/questions/11616630/json-stringify-avoid-typeerror-converting-circular-structure-to-json/11616993
*
* To prevent
* TypeError: Converting circular structure to JSON
*      at JSON.stringify (<anonymous>)
*
* Examples:
*
* import { customStringify } from '../../src/lib/utils'
*
* console.log("event = ${customStringify(event, ' ')}...")
*
*
*
* import utils from '../../src/lib/utils'
*
* console.log("event = ${utils.customStringify(event, ' ')}...")
*
*/
export const customStringify = function (value, space = ' ') {
    if (typeof value === 'undefined') {
        return 'undefined'
    }
    if (value == null) {
        return 'null'
    }

    const cache = new Map()
    return JSON.stringify(value, (le_key, le_value) => {
        if (typeof le_value === 'object' && le_value !== null) {
            if (cache.get(le_value)) {
                // Circular reference found, discard key
                return
            }
            // Store value in our map
            cache.set(le_value, true)
        }
        return le_value
    }, space)
}

// https://stackoverflow.com/questions/38513493/why-are-my-js-promise-catch-error-objects-empty
export const errorStringify = function (err, space) {
    let sOut = ''

    if (err.hasOwnProperty('message')) {
        sOut += `${'\n' + 'message:' + '"'}${err.message}"`
        // err.message = err["message"]
    }
    if (err.hasOwnProperty('stack')) {
        sOut += `${'\n' + 'stack:' + '"'}${err.stack}"`
        // err.stack = err["stack"]
    }

    const sCustom = customStringify(err, space)

    if (sCustom && !sCustom == '{}') {
        sOut += `\n${sCustom}`
    }

    return sOut
}

/**
* @note: this one also converts recursive objects (using php "array" notation for the query string)
*
* @source: https://stackoverflow.com/questions/1714786/query-string-encoding-of-a-javascript-object
*/
export const objectToQueryString = function (obj, prefix) {
    const str = []; let
        p

    for (p in obj) {
        if (obj.hasOwnProperty(p)) {
            const k = prefix ? `${prefix}[${p}]` : p
            const v = obj[p]
            str.push((v !== null && typeof v === 'object')
                ? objectToQueryString(v, k)
                : `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
        }
    }
    return str.join('&')
} /* objectToQueryString() */

/*
* https://stackoverflow.com/questions/2090551/parse-query-string-in-javascript
*/
export const queryStringToObject = function (queryString) {
    if (queryString[1] == '?') {
        queryString = queryString.substring(1)
    }

    // var args = queryString.substring(1).split('&');
    const args = queryString.split('&')

    const argsParsed = {}

    let i; let arg; let kvp; let key; let
        value

    for (i = 0; i < args.length; i++) {
        arg = args[i]

        if (arg.indexOf('=') === -1) {
            argsParsed[decodeURIComponent(arg).trim()] = true
        } else {
            kvp = arg.split('=')

            key = decodeURIComponent(kvp[0]).trim()

            value = decodeURIComponent(kvp[1]).trim()

            argsParsed[key] = value
        }
    }

    return argsParsed
} /* queryStringToObject() */

export const strEqualsIgnoreCase = function (str1, str2) {
    return compareStrings(str1, str2, true, true) === 0
}

/* https://stackoverflow.com/questions/2140627/javascript-case-insensitive-string-comparison
*  Returns -1 if string1 < string 2
*  Returns -0 if string1 == string 2
*  Returns 1 if string1 > string 2
*/
export const compareStrings = function (string1, string2, ignoreCase, useLocale) {
    if (ignoreCase) {
        if (useLocale) {
            string1 = string1.toLocaleLowerCase()
            string2 = string2.toLocaleLowerCase()
        } else {
            string1 = string1.toLowerCase()
            string2 = string2.toLowerCase()
        }
    }

    return string1.localeCompare(string2)
}

export const strContainsIgnoreCase = function (strFinder, strFindIn) {
    const strFinderLower = strFinder.toLocaleLowerCase()
    const strFindInLower = strFindIn.toLocaleLowerCase()
    return (strFindInLower.indexOf(strFinderLower) !== -1)
}

export const strBeginsWithIgnoreCase = function (strFinder, strFindIn) {
    const strFinderLower = strFinder.toLocaleLowerCase()
    const strFindInLower = strFindIn.toLocaleLowerCase()
    return (strFindInLower.indexOf(strFinderLower) === 0)
}

export const stringToBool = function (str) {
    if (!str) {
        return false
    }
    if (1 * str == 1) {
        return true
    }
    if (`${str}` == 'true') {
        return true
    }

    return false
}/* stringToBool */

// let utils = { customStringify: customStringify, errorStringify: errorStringify }
// Or, using object literal assignment...
const utils = {
    customStringify, errorStringify, objectToQueryString, queryStringToObject, strEqualsIgnoreCase, compareStrings, strContainsIgnoreCase, strBeginsWithIgnoreCase, stringToBool,
}
export { utils }
export default utils
