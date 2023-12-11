

class MessageBroker {
    async connect() {}
    async sendMessage(topic, message) {}
    async receiveMessage(topic) {}   
    async ackMessage(msg) {}
}

const amqp = require('amqplib');

class MQrabbitLocalAdapter extends MessageBroker {
    
    constructor() {
        super();
        this.QUEUE = process.env.LOCAL_QUEUE||'local_queue';
        this.durability = process.env.LOCAL_DURABILITY||false;
    }
    
    async connect() {
        try {
            this.connection = await amqp.connect(process.env.RABBITMQ_URL);
            this.channel = await this.connection.createConfirmChannel();
            await this.channel.assertQueue(this.QUEUE, { durable: this.durability });
        } catch (error) {
            throw error;
        }
    }

    async #promiseSendToQueue(message){
        return new Promise((resolve, reject) => {
            this.channel.sendToQueue(this.QUEUE, Buffer.from(message), {}, (err, ok) => {
                if (err) {
                    reject(new Error(err));
                }
                resolve({status: 'OK'});
            });
        });
    }

    async sendMessage(message) {
        try {
            const status = await this.#promiseSendToQueue(message);
            return status;
        } catch (error) {
            throw error;
        }
    }

    async ackMessage(msg) { 
        this.channel.ack(msg);
    }

    async receiveMessage(callback) {
        try {
            await this.channel.consume(this.QUEUE, (msg)=> {
                callback(msg);
            });
        } catch (error) {
            throw error;
        }
    }
}

function MessageBrokerFactory() {
    return new MQrabbitLocalAdapter();
}


module.exports = MessageBrokerFactory;