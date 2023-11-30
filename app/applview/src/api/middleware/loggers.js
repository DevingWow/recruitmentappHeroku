
const logger = require('../../util/Logger');

const errorLogger = async (err, req, res, next) => {
    logger.log("[ERROR-LOG] source: " + req.method + " " + req.url + " " + err.stack);
    next();
}

module.exports = {errorLogger};