"use strict";
/**
 * processor-queue.js
 *
 * Defines a processor queue as used by the deconcentrator.
 *
 * Discussion:
 *    This queue handles a collection of NLU processor request.
 *
 * Inspiration:
 *  - https://krasimirtsonev.com/blog/article/implementing-an-async-queue-in-23-lines-of-code
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

function ProcessorQueue() {

    /**
     * The collection of NLU processors to use
     * @type {*[]}
     */
    this.processors = [];

    this.interpretationResults = [];

    /**
     * Defines the number of concurrent running requests to different NLU processors.
     */
    this.numOfSynchronProcessors = 1;

    /**
     * A block to be executed after all processors are done with interpretation.
     * @param results
     */
    this.completion = function (results) {
        // empty
    }

    /**
     * Adds the given processor to the collection of processors owned by this queue.
     * @param processor
     */
    this.addProcessor = function(processor) {
        this.processors.push(processor);
    }

    /**
     * Request all NLU processors to interpretate the given message.
     */
    this.interpretate = function(message) {
        logger.info("[ProcessorQueue]  interpretate: " + message.text);

        let processors = this.processors
        let numOfSynchronProcessors = this.numOfSynchronProcessors
        let numOfProcessors = 0;
        let processorIndex = 0;
        let interpretationResults = [];

        return new Promise((done) => {
            const handleResult = (index) => (result) => {
                interpretationResults[index] = result;
                numOfProcessors--;
                getNextProcessor();
            };
            const getNextProcessor = () => {
                if (numOfProcessors < numOfSynchronProcessors && processorIndex < processors.length) {
                    const processor = processors[processorIndex];
                    logger.info("[ProcessorQueue]  working processor: " + processor.name)
                    processor
                        .interpretate(message)
                        .then(handleResult(processorIndex))
                        .catch(handleResult(processorIndex));
                    processorIndex++;
                    numOfProcessors++;
                    getNextProcessor();
                } else if (numOfProcessors === 0 && processorIndex === processors.length) {
                    done(interpretationResults);
                    this.interpretationResults = interpretationResults;
                    this.completion(interpretationResults);
                }
            };
            getNextProcessor();
        });
    }

    return this;
}

exports.createQueue = ProcessorQueue;
