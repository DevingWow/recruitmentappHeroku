
const MessageBrokerFactory = require('../mq/MessageBroker');
const controller = require('../controller/Controller');
const logger = require('../util/Logger');

const mqInstance = MessageBrokerFactory();

async function receiveMessages() {
    try {
        await mqInstance.receiveMessage(async (msg) => {
            const message = JSON.parse(msg.content.toString());
            if (message === null) logger.log("[ERROR Reiceive Message]: " + "Message is null");
            mqInstance.ackMessage(msg);
            logger.log("[Recieved Message]: " + msg.content.toString());
        });
    } catch (error) {
        logger.log("[ERROR Reiceive Message]: " + error.stack);
    }
};

async function initMQ(){
    try {
        await mqInstance.connect();
        await receiveMessages();
    } catch (error) {
        logger.log("[ERROR Init MQ]: " + error.stack);
    }
} 

module.exports = initMQ;
