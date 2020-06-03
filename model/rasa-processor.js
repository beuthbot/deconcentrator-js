/**
 * rasa-processor.js
 *
 * Defines the rasa-api as used by the deconcentrator.
 *
 * Contributed by:
 *  - Lukas Danckwerth
 */

// use winston for logging - https://github.com/winstonjs/winston
const winston = require('winston');
const logger = winston.createLogger({
    format: winston.format.cli(),
    transports: [ new winston.transports.Console() ]
});

// use `axios` as HTTP client for requesting rasa API
const axios = require("axios");

// set default URL of axios HTTP cslient.  fallback on local host for development
const endpoint = process.env.RASA_ENDPOINT || "http://localhost:5005/model/parse";

exports.name = "rasa"
exports.interpretate = async function(message) {

    return await axios
        .post(endpoint, message)
        .catch(function (error) {
            logger.error("[Rasa Api]  " + error);
            // TODO: return error response
            return null
        })
        .then(function (rasaResponse) {
            logger.info("[Rasa Api]  received rasa response: " + rasaResponse)
            return rasaResponse.data
        });
}
