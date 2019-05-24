import React from 'react'
import ReactDOM from 'react-dom'
import deepFreeze from 'deep-freeze'
import Enzyme from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import { config } from '../src/config'
import { logajohn } from '../src/lib/logajohn'

logajohn.setLevel(config.DEBUG_LEVEL)
logajohn.debug(`__tests__/global.js: logajohn.getLevel()=${logajohn.getLevel()}...`)

Enzyme.configure({ adapter: new Adapter() })

// For testing, add React, ReactDOM, and Enzyme
// to the global scope...
global.React = React
global.ReactDOM = ReactDOM
global.Enzyme = Enzyme

// Add mock isomorphic fetch to the global scope for your pleasure and enjoyment...
// ...see https://github.com/jefflau/jest-fetch-mock....
// ...actually we hacked our own in __mocks__ inspired by
// jefflau's version...
//global.fetch = require('jest-fetch-mock')

window.localStorage = {}
console.groupCollapsed = jest.fn()
console.log = jest.fn()
console.groupEnd = jest.fn()

