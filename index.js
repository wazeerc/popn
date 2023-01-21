/*
 *Logs:
 *21/01 - created index.js: server app
 * !
 * 
 * 
 * 
 * 
 * 
 */

"use strict";

// port on which server will run
const PORT = 8000;

// init packages
const express = require('express')
const cheerio = require('cheerio')
const axios = require('axios')

// create instance of express app
const app = express()

app.get('/', (req, res) => {
    res.json('Hello, there I am a JSON response.')
})

///test server
app.listen(PORT, () => console.log
(`🚀 Server running on PORT http://localhost:${PORT}.`))
