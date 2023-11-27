const logger = require('../../util/Logger');

const errorLogger = (err, req, res, next) => {
    logger.log("[ERROR] source: " + req.method + " " + req.url + " " + err);
    next();
}

module.exports = {errorLogger};