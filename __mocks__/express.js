"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

import { config } from '../src/config'
import { logajohn } from '../src/lib/logajohn'

logajohn.setLevel(config.DEBUG_LEVEL)
logajohn.debug('__mocks__/express.js: logajohn.getLevel()=', logajohn.getLevel())

export const mockGet = jest.fn(
    (path,callback)=>{
        logajohn.debug('__mocks__/express.js: mockGet(): path=', path, 'callback=', callback )
});
//exports.mockGet = mockGet;
//export mockGet;

class Express {
    constructor() {
        logajohn.debug('__mocks__/express.js: Express mock constructor...')

        this.get = mockGet;

        return this;
    }
}

function Router(){
    return new Express;    
}
//exports.Express = Express;
exports.Router = Router;
//export default Express
//export Express as Router
