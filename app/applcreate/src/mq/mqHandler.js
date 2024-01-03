
const logger = require('../util/Logger');
const MessageBroker = require('./MessageBroker');
const MQrabbitLocalAdapter = require('./MQrabbitLocalAdapter');
const HerokukafkaAdapter = require ('./HerokukafkaAdapter');

/**
 * 
 * @returns {MessageBroker}
 */
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

module.exports = MessageBrokerFactory;
