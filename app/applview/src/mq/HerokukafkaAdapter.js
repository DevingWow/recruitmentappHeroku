const MessageBroker = require('./MessageBroker');

class HerokukafkaAdapter extends MessageBroker {
    constructor(){
        super();
        this.kafka = require('node-rdkafka');
        this.topic = process.env.KAFKA_TOPIC||'local_queue';
    }

    async connect(){
        try {
            const config = {
                'metadata.broker.list': process.env.KAFKA_URL,
                'security.protocol': 'ssl',
                'ssl.certificate.location': process.env.KAFKA_CERT,
                'ssl.key.location': process.env.KAFKA_KEY,
                'ssl.ca.location': process.env.KAFKA_CA,
                'dr_cb': true
            };
            if(process.env.KAFKA_PRODUCER_FLAG === 'true'){
                this.producer = new this.kafka.HighLevelProducer(config);
                this.producer.connect();
            }
            if(process.env.KAFKA_CONSUMER_FLAG === 'true'){
                this.consumer = new this.kafka.KafkaConsumer(config);
                this.consumer.connect();
            }
        } catch (error) {
            throw error;
        }
    }

    async #producerReadyPromise(timeOutAfter){
        return new Promise((resolve, reject) => {
            this.producer.on('ready', ()=> resolve())

            setTimeout(()=>{
                reject(new Error('Timed out waiting for producer to be ready'));
            }, timeOutAfter);
        });
    }

    async #consumerReadyPromise(timeOutAfter){
        return new Promise((resolve, reject) => {
            this.consumer.on('ready', ()=> resolve())

            setTimeout(()=>{
                reject(new Error('Timed out waiting for consumer to be ready'));
            }, timeOutAfter);
        });
    }

    async #sendMsgPromise(msg) {
        return new Promise((resolve, reject) => {
            this.producer.produce(this.topic, null, Buffer.from(msg), process.env.KAFKA_PROD_KEY || "key", Date.now(), (err, offset) => {
                if (err) {
                    reject(new Error('Could not confirm message was received by kafka MQ'));
                } else {
                    resolve(offset);
                }
            });
        });
    }

    async #readMsgPromise(){
        const TIME_OUT_MS = 5000;
        return new Promise((resolve, reject)=> {
            setTimeout(()=>
                reject(new Error('Kafka time-out after attempting to read from MQ')),
            TIME_OUT_MS);
            this.consumer.subscribe([this.topic]);
            this.consumer.consume();
            this.consumer.on('data', data => {
                resolve(data);
            })
        });
    }

    async sendMessage(msg, timeoutAfter=1000){
        try {
            await this.#producerReadyPromise(timeoutAfter);
            await this.#sendMsgPromise(msg);
        } catch (error) {
            throw error;
        }
    }

    async receiveMessage(callback){
        const READY_TIME_OUT = 2000;
        try {
            await this.#consumerReadyPromise(READY_TIME_OUT);
            const msg = await this.#readMsgPromise();
            callback(msg);
        } catch (error) {
            throw error;
        }
    }

    async ackMessage(msg){
        try {
            this.consumer.commitMessage(msg);
        } catch (error) {
            throw error;
        }
    }
}

module.exports = HerokukafkaAdapter;