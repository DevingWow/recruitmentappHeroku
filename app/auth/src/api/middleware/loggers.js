const logger = require('../../util/Logger');

const errorLogger = async (err, req, res, next) => {
    console.log("LOGGER TRIGGERED");
    logger.log("[ERROR] source: " + req.method + " " + req.url + " " + err.stack);
    next();
}

module.exports = {errorLogger};