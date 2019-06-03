/* Entry point for our Node.js server... */
import React from 'react'
// Use ignoreStyles library so node.js
// doesn't generate errors when it sees
// SCSS import statements...
import ignoreStyles from 'ignore-styles'
import app from './app'
import { config } from '../config'

// Make React globally visible...
global.React = React

const lePort = config.PORT
// app.set('port', process.env.PORT || 3000)
app.set('port', lePort || 3000)

app.listen(
    app.get('port'),
    () => { console.log(`Postington running at 'http://localhost:${app.get('port')}'`) },
)

module.exports = app
