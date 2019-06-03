-----------
Postington: 
-----------

-----------
Directions:
-----------

Install:
- - - - 
1. Install node and npm (and/or yarn)
2. npm install /* install all stuff in packages.json, package-lock.json */

Optional Installs:
------------------
1. OPTIONAL: npm install --global nodemon   /* nodemon: optional, if you want `npm run start-server`, which is watch mode */
2. OPTIONAL: npm install --global babel-cli /* babel-node: optional, if you want to do `npm run start-server-babel`...without building 
                                            * the server via npm run build-server */
3. OPTIONAL: npm install --global esw /* esw or eslint-watch: optional, for lint in watch mode `npm run lint-watch`

Run:
--- 
1. npm run build-client (watch mode)
2. npm run build-server (watch mode)
3. npm run start-server (watch mode -- uses nodemon)
       or
   npm run start-server-node (_not_ in watch mode...uses node directly...need to re-start if code changes...)

------
tests:
------
npm run test

---------------------------------------
tests with coverage report:
(see ./coverage/lcov-report/index.html
---------------------------------------
npm run test-coverage

-----
lint:
-----
npm run lint

