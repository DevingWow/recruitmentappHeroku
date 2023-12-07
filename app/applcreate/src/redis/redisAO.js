const redis = require('redis');
const logger = require('../util/Logger');
const ST = require('../util/ST');

/**
 * Represents a Redis Access Object.
 * @class
 */
class redisAO {
    #table;
    #dataChannel;
    #confirmationChannel;
    #subscriber_status;
    #publisher_status;
    #subscriber;
    #publisher;

    /**
     * Represents a RedisAO object.
     * @constructor
     */
    constructor(){
        this.#subscriber = redis.createClient({
            socket: {
                host: process.env.REDIS_HOST||'localhost',
                port: process.env.REDIS_PORT||6379
            }
        });
        this.#publisher = redis.createClient({
            socket: {
                host: process.env.REDIS_HOST||'localhost',
                port: process.env.REDIS_PORT||6379
            }
        });
        const MAX_ST_ENTRIES = 100;
        this.#dataChannel = 'data-channel';
        this.#confirmationChannel = 'confirmation-channel';
        this.#subscriber_status = 'disconnected';
        this.#publisher_status = 'disconnected';
        this.#table = new ST(MAX_ST_ENTRIES);
    }

    /**
     * Initializes the RedisAO object by connecting the subscriber and publisher,
     * subscribing to the confirmation channel, and updating the status accordingly.
     * @throws {Error} If an error occurs during initialization.
     */
    async init(){
        try{
            await this.connectSubscriber();
            await this.subscribeToConfirmationChannel();
            this.#subscriber_status = 'connected';
            await this.connectPublisher();
            this.#publisher_status = 'connected';
        } catch(error){
            throw error;
        }
    }

    /**
     * Connects to the Redis server as a subscriber.
     * @async
     * @function connectSubscriber
     * @throws {Error} If there is an error connecting to Redis.
     */
    async connectSubscriber(){
        try{
            this.#subscriber.on('connect', async () => {
                logger.log("Connected to redis");
            });
            this.#subscriber.on('error', async (error) => {
                logger.log("Redis error: " + error);
            });
            await this.#subscriber.connect();
        } catch(error){
            throw error;
        }
    }

    /**
     * Connects the publisher to Redis.
     * @async
     * @function connectPublisher
     * @throws {Error} If there is an error connecting to Redis.
     */
    async connectPublisher(){
        try{
            this.#publisher.on('connect', async () => {
                logger.log("Connected to redis");
            });
            this.#publisher.on('error', async (error) => {
                logger.log("Redis error: " + error);
            });
            await this.#publisher.connect();
        } catch(error){
            throw error;
        }
    }

    /**
     * Subscribes to the confirmation channel and updates the status of a token on incoming confirmations.
     * @returns {Promise<void>} A promise that resolves when the subscription is successful.
     */
    async subscribeToConfirmationChannel(){
        const listener = async (msg) => {
            const confirmation = JSON.parse(msg);
            const keyToken = confirmation.token;
            const status = confirmation.status;
            if(this.#table.exists(keyToken)) {
                this.#table.add(keyToken,status); // update status
            }
        };
        await this.#subscriber.subscribe(this.#confirmationChannel,listener);
    }

    /**
     * Publishes a payload to a Redis channel.
     * @param {Object} payload - The payload to be published.
     * @param {string} keyToken - The key token associated with the payload.
     * @throws {Error} If an error occurs while publishing the payload.
     */
    async publishPayload(payload,keyToken){
        const status = {status: 'pending'};
        const datawrapper = {token: keyToken, payload: payload};
        this.#table.add(keyToken,status);
        try{
            await this.#publisher.publish(this.#dataChannel, JSON.stringify(datawrapper));
        } catch(error){
            throw error;
        }
    }

    /**
     * Waits for the confirmation status of a given key token within a specified maximum wait time.
     * @param {string} keyToken - The key token to wait for confirmation.
     * @param {number} maxWaitTime - The maximum wait time in milliseconds.
     * @returns {Promise<string>} - A promise that resolves with the confirmation status.
     */
    async waitConfirmation(keyToken, maxWaitTime){
        const WAIT_INTERVAL = 50;
        const NR_WAIT_INTERVALS = maxWaitTime / WAIT_INTERVAL;
        return new Promise(async (resolve) => {
            let intervals = 0;
            let status = this.#table.get(keyToken).status;
            if (status !== 'pending'){
                resolve(status);
            }
            const intervalID=setInterval(() => {
                status = this.#table.get(keyToken).status;
                if(status !== 'pending' || ++intervals >= NR_WAIT_INTERVALS){
                    clearInterval(intervalID);
                    resolve(status);
                }
            }, WAIT_INTERVAL);
        });
    }
}

module.exports = redisAO