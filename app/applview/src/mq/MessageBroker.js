

class MessageBroker {
    async connect() {}
    async sendMessage(topic, message) {}
    async receiveMessage(topic) {}   
    async ackMessage(msg) {}
    async nackMessage(msg) {}
}

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
}



class HerokukafkaAdapter extends MessageBroker {
    constructor(){
        super();
        this.kafka = require('node-rdkafka');
        this.topic = process.env.KAFKA_TOPIC||'local_queue';
    }

    async connect(){
        try {
            if(process.env.KAFKA_PRODUCER_FLAG === 'true'){
                const producer_config = {
                    'metadata.broker.list': process.env.KAFKA_URL,
                    'security.protocol': 'ssl',
                    'ssl.certificate.location': process.env.KAFKA_CERT,
                    'ssl.key.location': process.env.KAFKA_KEY,
                    'ssl.ca.location': process.env.KAFKA_CA,
                    'dr_cb': true
                };
                this.producer = new this.kafka.Producer(producer_config);
                this.producer.connect();
            }
            
        } catch (error) {
            throw error;
        }
    }
}

function MessageBrokerFactory() {
    return new MQrabbitLocalAdapter();
}


module.exports = MessageBrokerFactory;