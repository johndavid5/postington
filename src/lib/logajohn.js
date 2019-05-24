/** Convenience methods based on logatim... */
// const logatim = require('logatim') // ES5
import logatim from 'logatim' // ES6

export const dateTimeStamp = () => {
    const le_date = new Date()
    return `${le_date.getFullYear()}-${lpad(le_date.getMonth() + 1, '0', 2)}-${lpad(le_date.getDate(), '0', 2)} ${lpad(le_date.getHours(), '0', 2)}:${lpad(le_date.getMinutes(), '0', 2)}:${lpad(le_date.getSeconds(), '0', 2)}.${le_date.getMilliseconds()}`
    // return "" + le_date.year();
    // return le_date.getFullYear()
}

const lpad = (s_input, pad_string, length) => {
    let s_output = `${s_input}`
    while (s_output.length < length) { s_output = pad_string + s_output }
    return s_output
}


// console.log = function(...args){ logatim.white.info(`[${dateTimeStamp()}-INFO]`,...args) }

let trace
let debug
let info
let warn
let error

if (typeof window !== 'undefined') {
    trace = function (...args) { logatim.black.trace(`[${dateTimeStamp()}][TRACE]`, ...args) }

    debug = function (...args) { logatim.black.debug(`[${dateTimeStamp()}][DEBUG]`, ...args) }

    info = function (...args) { logatim.black.info(`[${dateTimeStamp()}][INFO]`, ...args) }

    warn = function (...args) { logatim.red.warn(`[${dateTimeStamp()}][WARN]`, ...args) }

    error = function (...args) { logatim.red.error(`[${dateTimeStamp()}][ERROR]`, ...args) }
} else {
    trace = function (...args) { logatim.cyan.trace(`[${dateTimeStamp()}][TRACE]`, ...args) }

    debug = function (...args) { logatim.magenta.debug(`[${dateTimeStamp()}][DEBUG]`, ...args) }

    info = function (...args) { logatim.green.info(`[${dateTimeStamp()}][INFO]`, ...args) }

    warn = function (...args) { logatim.yellow.warn(`[${dateTimeStamp()}][WARN]`, ...args) }

    error = function (...args) { logatim.red.error(`[${dateTimeStamp()}][ERROR]`, ...args) }
}

const setLevel = function (level) { const prevLevel = logatim.getLevel(); logatim.setLevel(level); return prevLevel }

const getLevel = function () { return logatim.getLevel() }

console.log = info

export const logajohn = {
    trace, debug, info, warn, error, setLevel, getLevel,
}
