const Exception = require("../util/Exception")


const errorHandler = (error, req, res, next) => {
    if (error instanceof Exception){
        res.status(error.errResponseCode).send(error.clientMessage);
    }
    else{
        res.status(500).send("Internal server error");
    }
}

module.exports = errorHandler;