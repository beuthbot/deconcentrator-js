/**
 * BeuthBot Deconcentrator
 *
 * Contributed by:
 *  - Lukas Danckwerth
 *
 */


// === ------------------------------------------------------------------------------------------------------------ ===
//
// Node.js Modules / Constants
// === ------------------------------------------------------------------------------------------------------------ ===

// use acios for HTTP request to the RASA endpoint
const axios = require('axios')

// use express app for hadling incoming requests
const express = require('express')

// use body parser to for application/json contents foor express
const bodyParser = require('body-parser')

// create express application
const app = express()

// current application version
const application_version = "0.1.0"

// default confidence score to use if none is send withing a request
const default_confidence_score = 0.8

// fallback on a default endpoint for RASA in development where `process.env.RASA_ENDPOINT` will not be defined
const rasa_endpoint = process.env.RASA_ENDPOINT || "http://localhost:5005/model/parse"


// === ------------------------------------------------------------------------------------------------------------ ===
//
// Express Application
// @see: https://expressjs.com/de/guide/routing.html
// === ------------------------------------------------------------------------------------------------------------ ===

// for parsing application/json
app.use(bodyParser.json())

// for parsing application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

// present a simple hello text on a `GET` request on the base URL.  this can be use to check whether the deconcentrator
// is running or not.
app.get('/', function(req, res) {
    res.send('Hello from BeuthBot Deconcentrator: ' + application_version)
    res.end()
})

// the route the API will call:
app.post('/message', function(req, res) {

    // receive message
    const message = req.body
    console.log('incoming message: ', message)

    // receive text from message
    const text = message.text

    if (!text || text.length < 1) {
        return res.end()
    }

    // LD: for now just delegate the request to the rasa endpoint
    axios.post(rasa_endpoint, message)
        .catch(function (error) {
            console.error(error)
        })
        .then(function (rasaResponse) {
            console.log('rasaResponse: ' + rasaResponse.data.text)
            res.json(rasaResponse.data)
            res.end()
        })
})

const port = 8338
app.listen(port, function() {
    console.log('Deconcentrator listening on port ' + port + '!')
    console.log('rasa_endpoint: ' + rasa_endpoint)
})
