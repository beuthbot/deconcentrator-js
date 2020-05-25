/**
 * processor.js
 *
 * Defines a processor as used by the deconcentrator.  This class
 * demonstrates the usage of a processor. Don't use this in production
 * mode.
 *
 * Contributed by:
 *  - Lukas Danckwerth
 */

/**
 * The name of the processor.
 *
 * @type {string}
 */
exports.name = "demo processor"

/**
 * Tries to interpretate the given message.
 *
 * @param message
 * @returns {Promise<unknown>}
 */
exports.interpretate = function(message) {
    return new Promise((done) => {
        done({
            "intent": {
                "name": "unknown",
                "confidence": 0.0
            },
            "text": message.text
        });
    });
};
