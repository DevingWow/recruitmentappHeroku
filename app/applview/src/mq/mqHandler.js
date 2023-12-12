
const logger = require('../util/Logger');


async function receiveMessages(mqInstance, msgcallback) {
    try {
        await mqInstance.receiveMessage(async (msg) => {
            const message = JSON.parse(msg.content.toString());
            if (message === null || message === undefined){
                mqInstance.nackMessage(msg); 
                logger.log("[ERROR Reiceive Message]: " + "Message is null");
            }
            mqInstance.ackMessage(msg);
            logger.log("[Recieved Message]: " + msg.content.toString());
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

module.exports = initMQ;
