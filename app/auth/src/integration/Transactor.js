const sequelize = require('../integration/dbconfig');

/**
 * Transaction interface
 * useful for transaction which are multiple SQL statements
 */
class Transactor {
    #manager;
    #transaction;

    constructor(){
        this.#manager = sequelize;
    }

    async startTransaction (){
        try {
            this.#transaction = await this.#manager.transaction();
        } catch (error) {
            throw error;
        }
    }

    async commit (){
        if (!this.#transaction) throw Error('No transaction started');
        try {
            await this.#transaction.commit();
        } catch (error) {
            throw error;
        }
    }

    async rollback (){
        if(!this.#transaction) throw Error('No transaction started');
        try {
            await this.#transaction.rollback();
        } catch (error) {
            throw error;
        }
    }
}

module.exports = Transactor;