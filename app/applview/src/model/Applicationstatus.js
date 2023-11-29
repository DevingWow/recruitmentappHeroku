const Sequelize = require('sequelize');
const sequelize = require('../integration/dbconfig');

const Applicationstatus = sequelize.define('applicationstatus', {
    applicationstatus_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    app_status: {
        type: Sequelize.STRING,

    },
    person_id: {
        type: Sequelize.INTEGER,
        references: {
            model: 'persons',
            key: 'person_id'
        }
    },
});


module.exports = Applicationstatus;