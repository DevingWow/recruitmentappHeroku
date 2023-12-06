class Exception extends Error{
    constructor(message, clientMessage=message, errResponseCode=500){
        super(message);
        this.clientMessage = clientMessage;
        this.errResponseCode = errResponseCode;
    }
}

module.exports = Exception;