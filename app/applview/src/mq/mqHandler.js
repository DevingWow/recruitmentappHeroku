
const logger = require('../util/Logger');
const MessageBroker = require('./MessageBroker');
const MQrabbitLocalAdapter = require('./MQrabbitLocalAdapter');
const HerokukafkaAdapter = require ('./HerokukafkaAdapter');


/**
 * 
 * @param {MessageBroker} mqInstance 
 * @param {*} msgcallback 
 */
async function receiveMessages(mqInstance, msgcallback) {
    try {
        await mqInstance.receiveMessage(async (msg) => {
            
            const message = JSON.parse(mqInstance.extractMessageContentString(msg));
            if (message === null || message === undefined){
                mqInstance.nackMessage(msg); 
                logger.log("[ERROR Reiceive Message]: " + "Message is null");
            }
            mqInstance.ackMessage(msg);
            logger.log("[Recieved Message]: " + mqInstance.extractMessageContentString(msg));
            await msgcallback(message);
        });
    } catch (error) {
        logger.log("[ERROR Reiceive Message]: " + error.stack);
        throw error;
    }
};

async function initMQ(mqInstance, msgcallback){
    try {
        await mqInstance.connect();
        await receiveMessages(mqInstance, msgcallback);
    } catch (error) {
        logger.log("[ERROR Init MQ]: " + error.stack);
        throw error;
    }
} 

function MessageBrokerFactory() {
    switch (process.env.MQ_ENVIRONMENT) {
        case 'local':
            return new MQrabbitLocalAdapter();
        case 'kafka':
            return new HerokukafkaAdapter();
        default:
            return new MQrabbitLocalAdapter();
    }
}

module.exports = {MessageBrokerFactory, initMQ};
