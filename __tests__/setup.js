/* source: https://stackoverflow.com/questions/37104033/error-it-looks-like-you-called-mount-without-a-global-document-being-loaded */
const { jsdom } = require('jsdom')

const exposedProperties = ['window', 'navigator', 'document']

global.document = jsdom('')
global.window = document.defaultView
Object.keys(document.defaultView).forEach((property) => {
    if (typeof global[property] === 'undefined') {
        exposedProperties.push(property)
        global[property] = document.defaultView[property]
    }
})

global.navigator = {
    userAgent: 'node.js',
}
