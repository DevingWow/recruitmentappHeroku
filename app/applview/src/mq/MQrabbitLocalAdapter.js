const MessageBroker = require('./MessageBroker')

class MQrabbitLocalAdapter extends MessageBroker {
    
    constructor() {
        super();
        this.amqp = require('amqplib');
        this.QUEUE = process.env.LOCAL_QUEUE||'local_queue';
        this.durability = process.env.LOCAL_DURABILITY||false;
    }
    
    async connect() {
        try {
            this.connection = await this.amqp.connect(process.env.RABBITMQ_URL);
            this.channel = await this.connection.createConfirmChannel();
            await this.channel.assertQueue(this.QUEUE, { durable: this.durability });
        } catch (error) {
            throw error;
        }
    }

    async #promiseSendToQueue(message, timeOutAfter){
        return new Promise((resolve, reject) => {
            this.channel.sendToQueue(this.QUEUE, Buffer.from(message), {}, (err, ok) => {
                if (err) {
                    reject(new Error(err));
                }
                resolve({status: 'OK'});
            });
            setTimeout(()=>{
                reject(new Error('Sending to msg queue timedout'));
            }, timeOutAfter);
        });
    }

    async sendMessage(message, timeOutAfter) {
        try {
            const status = await this.#promiseSendToQueue(message, timeOutAfter);
            return status;
        } catch (error) {
            throw error;
        }
    }

    async ackMessage(msg) { 
        this.channel.ack(msg);
    }

    async nackMessage(msg) {
        this.channel.nack(msg);
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

    extractMessageContentString(msg){
        return msg.content.toString();
    }
}

module.exports = MQrabbitLocalAdapter;