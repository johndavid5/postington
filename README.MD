Directions:
-----------
1. npm install
2. npm run build-client (watch mode)
3. npm run build-server (watch mode)
4. npm run start-server (watch mode)
       or
   npm run start-server-node (_not_ in watch mode...need to re-start if code changes...)

tests:
------
npm run test

lint:
-----
npm run lint

Useful Links:
-------------
* https://github.com/Microsoft/vscode-recipes/tree/master/debugging-jest-tests

* https://github.com/moroshko/react-autosuggest#installation

* https://github.com/reduxjs/redux-thunk

* http://enthudrives.com/blog/unit-testing-redux-containers

C:\inetpub\wwwroot\postington\node_modules\yargs\yargs.js
// Prevent failed path 
  function pkgUp (path) {
    const npath = path || '*'
    if (pkgs[npath]) return pkgs[npath]
    const readPkgUp = require('read-pkg-up')

    let obj = {}
    try {
      let cwd1 = path
      let cwd2 = require('require-main-filename')(parentRequire || require)
      if( cwd2 == "C:\\inetpub\\wwwroot\\postington\\node_modules\\jest\\bin\\jest.js" ){
          // Trying to find ./node_modules/jest/package.json
          // Prevent bad path ./node_modules/jest/bin/jest.js/package.json
          cwd2 = "C:\\inetpub\\wwwroot\\postington\\node_modules\\jest"
      }
      let cwd = cwd1 || cwd2

      obj = readPkgUp.sync({
        //cwd: path || require('require-main-filename')(parentRequire || require),
        cwd: cwd,
        normalize: false
      })
    } catch (noop) {}

x npm install --save jest-cli
x npm install --save jest-environment-jsdom
npm install --save jsdom
