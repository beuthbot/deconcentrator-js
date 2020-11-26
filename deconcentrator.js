/**
 * BeuthBot Deconcentrator
 *
 * Contributed by:
 *  - Lukas Danckwerth
 */


// === ------------------------------------------------------------------------------------------------------------ ===
//
// Node.js Modules / Constants
// === ------------------------------------------------------------------------------------------------------------ ===

// use express app for handling incoming requests
const express = require("express");

// use body parser to for application/json contents foor express
const bodyParser = require('body-parser');

// use util for pretty printed debugging information
const util = require('util');

// use winston for logging - https://github.com/winstonjs/winston
const winston = require('winston');
const logger = winston.createLogger({
    level: "silly",
    format: winston.format.cli(),
    transports: [ new winston.transports.Console() ]
});

// require custom js files
const ProcessorQueue = require('./model/processor-queue');
const DemoProcessor = require('./model/processor');
const RasaApi = require('./model/rasa-processor');


// create express application
const app = express();

// current application version
const application_version = "0.1.1";

// default confidence score to use if none is send withing a request
const default_confidence_score = process.env.MIN_CONFIDENCE_SCORE || 0.79;

// default collection of processors to use
const default_processors = ["rasa", "default"];

// the port used by the express app
const port = 8338;

// fallback on a default endpoint for RASA in development where `process.env.RASA_ENDPOINT` will not be defined
const rasa_endpoint = process.env.RASA_ENDPOINT || "http://localhost:5005/model/parse";


// === ------------------------------------------------------------------------------------------------------------ ===
//
// Express Application
// @see: https://expressjs.com/de/guide/routing.html
// === ------------------------------------------------------------------------------------------------------------ ===

// for parsing application/json
app.use(bodyParser.json());

// for parsing application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}));


/**
 * present a simple hello text on a `GET` request on the base URL.  this can be use to check whether the deconcentrator
 * is running or not.
 */
app.get("/", function(req, res) {
    res.send("Hello from BeuthBot Deconcentrator: " + application_version);
    res.end();
});

/**
 * route to request the interpretation of a message.
 */
app.post("/message", function(req, res) {

    // receive message
    let message = req.body;
    let messageJSON = util.inspect(message, false, null, true)
    logger.info("[Deconcentrator]  incoming message:\n" + messageJSON);

    const historyAdd = ['deconcentrator'];
    const history = message.history ? message.history.concat(historyAdd) : historyAdd;

    // receive text from message
    const text = message.text;

    if (!text || text.length < 1) {
        return res.end();
    }

    // receive names of processors to use
    let processors = message.processors || default_processors
    logger.info("[Deconcentrator]  processors: " + processors);

    // receive confidence score to use
    let confidenceScore = message.min_confidence_score || default_confidence_score
    logger.info("[Deconcentrator]  confidence score: " + confidenceScore);

    // create queue of nlu processors
    var queue = ProcessorQueue.createQueue()

    if (processors.includes("default")) {
        queue.addProcessor(DemoProcessor);
    }

    if (processors.includes("rasa")) {
        queue.addProcessor(RasaApi);
    }

    queue.completion = function(results) {

        var filtered = results.filter(function (nluResponse) {

            let intent = nluResponse.intent
            if (!intent) {
                logger.info("[Deconcentrator]  filter out: " + nluResponse)
                return false
            }

            let confidence = intent.confidence
            if (!confidence || confidence < confidenceScore) {
                logger.info("[Deconcentrator]  filter out \"" + intent.name + "\" with too low confidence: " + confidence)
                return false
            }

            return true
        })

        let filteredCount = results.length - filtered.length
        logger.info("[Deconcentrator]  filtered responses: " + filteredCount)

        if (filtered.length > 0) {
            let result = Object.assign(filtered[0], {history});
            res.json(result);
            res.end();
        } else {
            res.json({error: "No intent found.", history});
            res.end();
        }
    }

    // start the interpretation
    queue.interpretate(message);

});

app.listen(port, function() {
    logger.info("Start Deconcentrator " + application_version);
    logger.info("Listening on port: " + port);
    logger.info("Default confidence score: " + default_confidence_score);
});
